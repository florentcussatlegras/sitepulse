<?php

// src/Repository/AuditRepository.php

namespace App\Repository;

use App\Entity\Audit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Audit>
 *
 * @method Audit|null find($id, $lockMode = null, $lockVersion = null)
 * @method Audit|null findOneBy(array $criteria, array $orderBy = null)
 * @method Audit[]    findAll()
 * @method Audit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AuditRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Audit::class);
    }

    // Exemple : récupérer l'audit le plus récent
    public function findLatestAudit(): ?Audit
    {
        return $this->createQueryBuilder('a')
            ->orderBy('a.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    // Exemple : récupérer par URL
    public function findByUrl(string $url): ?Audit
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.url = :url')
            ->setParameter('url', $url)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
