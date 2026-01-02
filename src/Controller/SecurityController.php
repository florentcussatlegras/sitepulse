<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use App\Security\Authenticator\SocialAuthenticator;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\String\ByteString;

class SecurityController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): Response
    {
        if ($request->isMethod('POST')) {
            $email = $request->request->get('email');
            $password = $request->request->get('password');

            if ($email && $password) {
                $user = new User();
                $user->setEmail($email);
                $user->setPassword($hasher->hashPassword($user, $password));
                $em->persist($user);
                $em->flush();

                $this->addFlash('success', 'Compte créé ! Vous pouvez vous connecter.');
                return $this->redirectToRoute('app_login');
            }

            $this->addFlash('error', 'Email et mot de passe requis.');
        }

        return $this->render('security/register.html.twig');
    }

    #[Route('/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        // Symfony gère l’authentification via Security.yaml
        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {}

    // -------------------------------------------------------------------------
    // GOOGLE LOGIN
    // -------------------------------------------------------------------------
    #[Route('/connect/google', name: 'connect_google')]
    public function connectGoogle(ClientRegistry $clientRegistry)
    {
        return $clientRegistry->getClient('google')->redirect(['email']);
    }

    #[Route('/connect/google/check', name: 'connect_google_check')]
    public function connectGoogleCheck(
        Request $request,
        EntityManagerInterface $em,
        ClientRegistry $clientRegistry,
        UserAuthenticatorInterface $userAuthenticator,
        SocialAuthenticator $authenticator
    ): Response {
        try {
            $client = $clientRegistry->getClient('google');
            $googleUser = $client->fetchUser();

            $email = $googleUser->getEmail();
            $googleId = $googleUser->getId();
            $name = $googleUser->getName() ?: 'google_user_' . uniqid();

            // Recherche par email
            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                // Crée un nouvel utilisateur
                $user = new User();
                $user->setEmail($email);
                $user->setGoogleId($googleId);
                $user->setPassword(''); // pas de mot de passe
                $em->persist($user);
            } else {
                $user->setGoogleId($googleId);
            }

            $em->flush();

            return $userAuthenticator->authenticateUser(
                $user,
                $authenticator,
                $request
            );

        } catch (\Exception $e) {
            $this->addFlash('error', 'Erreur Google : ' . $e->getMessage());
            return $this->redirectToRoute('app_login');
        }
    }

    // -------------------------------------------------------------------------
    // GITHUB LOGIN
    // -------------------------------------------------------------------------
    #[Route('/connect/github', name: 'connect_github')]
    public function connectGithub(ClientRegistry $clientRegistry)
    {
        return $clientRegistry->getClient('github')->redirect(['user:email']);
    }

    #[Route('/connect/github/check', name: 'connect_github_check')]
    public function connectGithubCheck(
        Request $request,
        ClientRegistry $clientRegistry,
        UserAuthenticatorInterface $userAuthenticator,
        EntityManagerInterface $em,
        SocialAuthenticator $authenticator
    ): Response {
        try {
            $client = $clientRegistry->getClient('github');
            $githubUser = $client->fetchUser();

            $githubId = $githubUser->getId();
            $data = $githubUser->toArray();

            $email = $githubUser->getEmail() ?? ($data['login'] . '@github.local');
            $username = $data['login'] ?? ('github_user_' . uniqid());

            // Recherche par email (ou création)
            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                $user = new User();
                $user->setEmail($email);
                $user->setGithubId($githubId);
                $user->setPassword('');
                $em->persist($user);
            } else {
                $user->setGithubId($githubId);
            }

            $em->flush();

            return $userAuthenticator->authenticateUser(
                $user,
                $authenticator,
                $request
            );

        } catch (\Exception $e) {
            $this->addFlash('error', 'Erreur GitHub : ' . $e->getMessage());
            return $this->redirectToRoute('app_login');
        }
    }
}
