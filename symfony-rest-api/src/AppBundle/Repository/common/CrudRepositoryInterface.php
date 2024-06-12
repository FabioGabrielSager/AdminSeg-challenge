<?php

namespace AppBundle\Repository\common;

use Doctrine\Common\Persistence\ObjectRepository;

interface CrudRepositoryInterface extends ObjectRepository
{
    public function save($entity);
    public function delete($entity);
}