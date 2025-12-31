<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LandingController extends AbstractController
{
    #[Route('/', name: 'landing')]
    public function landing(): Response
    {
        return $this->render('pages/landing/index.html.twig');
    }

    #[Route('/app', name: 'react_landing')]
    public function reactLanding(): Response
    {
        return $this->render('pages/landing/react_home.html.twig');
    }
}
