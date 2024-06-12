<?php

namespace AppBundle\DTO\Product;

use AppBundle\DTO\Common\PaginatedResponseBase;

class ProductSearchResultDto extends PaginatedResponseBase
{
    /**
     * @var array
     * */
    private $products;

    /**
     * @return array
     */
    public function getProducts()
    {
        return $this->products;
    }

    /**
     * @param array $products
     */
    public function setProducts($products)
    {
        $this->products = $products;
    }
}