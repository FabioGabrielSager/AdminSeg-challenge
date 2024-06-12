<?php

namespace AppBundle\Service;

interface CategoryServiceInterface
{
    public function getAllCategories();
    public function createCategory($categoryName, $categoryIcon);
    public function modifyCategory($categoryId, $categoryName, $categoryIcon);
    public function deleteCategory($categoryId);
}