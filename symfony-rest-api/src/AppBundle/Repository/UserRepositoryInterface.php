<?php

namespace AppBundle\Repository;

use AppBundle\Repository\common\CrudRepositoryInterface;

interface UserRepositoryInterface extends CrudRepositoryInterface
{
    public function findByUsername($username);
}