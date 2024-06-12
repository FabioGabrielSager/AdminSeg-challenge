<?php

namespace AppBundle\Service;

use AppBundle\DTO\Product\CreateProductRequest;
use AppBundle\DTO\Product\ModifyProductRequest;

interface ProductServiceInterface
{
    public function getProducts($name, $categoryId, $page = 1, $limit = 10);
    public function getUserRegisteredProducts($username, $productName, $categoryId, $page, $limit);
    public function createProduct(CreateProductRequest $product);
    public function updateProduct(ModifyProductRequest $product);
    public function deleteProduct($creatorUsername, $productId);
    public function getProductById($productId);

}