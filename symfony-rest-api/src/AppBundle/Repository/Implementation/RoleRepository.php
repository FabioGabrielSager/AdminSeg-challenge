<?php

namespace AppBundle\Repository\Implementation;

use AppBundle\Repository\common\CrudRepository;
use AppBundle\Repository\RoleRepositoryInterface;
use Doctrine\ORM\NonUniqueResultException;

class RoleRepository extends CrudRepository implements RoleRepositoryInterface
{

    /**
     * @throws NonUniqueResultException
     */
    public function findByName($name)
    {
       return $this->createQueryBuilder('r')
           ->where('r.name = :name')
           ->setParameter('name', $name)
           ->getQuery()->getOneOrNullResult();
    }
}