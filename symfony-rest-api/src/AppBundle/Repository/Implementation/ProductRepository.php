<?php

namespace AppBundle\Repository\Implementation;

use AppBundle\Repository\common\CrudRepository;
use AppBundle\Repository\ProductRepositoryInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Tools\Pagination\Paginator;

class ProductRepository extends CrudRepository implements ProductRepositoryInterface
{
    public function findAllByNameAndCategory($name, $categoryId, $page = 1, $limit = 10)
    {
        $queryBuilder = $this->createQueryBuilder('p')
            ->join('p.category', 'c')
            ->where('p.name LIKE :name')
            ->andWhere(':categoryId IS NULL OR c.id = :categoryId')
            ->setParameter('name', '%' . $name . '%')
            ->setParameter('categoryId', $categoryId)
            ->orderBy('p.id', 'ASC');

        // Paginate the results
        $paginator = new Paginator($queryBuilder);
        $paginator->getQuery()
            ->setFirstResult(($page - 1) * $limit) // Offset
            ->setMaxResults($limit); // Limit

        return $paginator;
    }

    public function countByNameAndCategory($name, $categoryId)
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(DISTINCT p.id)')
            ->join('p.category', 'c')
            ->where(':name IS NULL OR p.name LIKE :name')
            ->andWhere(':categoryId IS NULL OR c.id = :categoryId')
            ->setParameter('name', '%' . $name . '%')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()->getSingleScalarResult();
    }

    public function findAllByCreatorUsername($username, $productName, $categoryId, $page = 1, $limit = 10)
    {
        $queryBuilder = $this->createQueryBuilder('p')
            ->join('p.user', 'u')
            ->join('p.category', 'c')
            ->where('u.username = :creatorUsername')
            ->andWhere(':name IS NULL OR p.name LIKE :name')
            ->andWhere(':categoryId IS NULL OR c.id = :categoryId')
            ->setParameter('name', '%' . $productName . '%')
            ->setParameter('categoryId', $categoryId)
            ->setParameter('creatorUsername', $username)
            ->orderBy('p.id', 'ASC');

        // Paginate the results
        $paginator = new Paginator($queryBuilder);
        $paginator->getQuery()
            ->setFirstResult(($page - 1) * $limit) // Offset
            ->setMaxResults($limit); // Limit

        return $paginator;
    }

    public function countByCreatorUsername($username, $productName, $categoryId)
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(DISTINCT p.id)')
            ->join('p.user', 'u')
            ->join('p.category', 'c')
            ->where('u.username = :creatorUsername')
            ->andWhere(':name IS NULL OR p.name LIKE :name')
            ->andWhere(':categoryId IS NULL OR c.id = :categoryId')
            ->setParameter('name', '%' . $productName . '%')
            ->setParameter('categoryId', $categoryId)
            ->setParameter('creatorUsername', $username)
            ->getQuery()->getSingleScalarResult();
    }

    /**
     * @throws NonUniqueResultException
     */
    public function findByIdAndCreatorUsername($id, $creatorUsername)
    {
        return $this->createQueryBuilder('p')
            ->join('p.user', 'u')
            ->where('p.id = :id')
            ->andWhere('u.username = :creatorUsername')
            ->setParameter('id', $id)
            ->setParameter('creatorUsername', $creatorUsername)
            ->getQuery()->getOneOrNullResult();
    }
}
