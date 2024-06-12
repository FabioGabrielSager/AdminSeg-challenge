<?php

namespace AppBundle\Repository;

use AppBundle\Repository\common\CrudRepositoryInterface;

interface RoleRepositoryInterface extends CrudRepositoryInterface
{
    public function findByName($name);
}