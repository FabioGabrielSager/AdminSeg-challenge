<?php

namespace AppBundle\Repository;

use AppBundle\Repository\common\CrudRepositoryInterface;

interface ProductRepositoryInterface extends CrudRepositoryInterface
{
    public function findAllByNameAndCategory($name, $categoryId, $page = 1, $limit = 10);
    public function countByNameAndCategory($name, $categoryId);
    public function findAllByCreatorUsername($username, $productName, $categoryId, $page = 1, $limit = 10);
    public function countByCreatorUsername($username, $productName, $categoryId);
    public function findByIdAndCreatorUsername($id, $creatorUsername);
}