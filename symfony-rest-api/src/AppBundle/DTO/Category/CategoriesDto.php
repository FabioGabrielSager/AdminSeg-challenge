<?php

namespace AppBundle\DTO\Category;

class CategoriesDto
{
    private $categories;

    public function __construct(array $categories) {
        $this->categories = $categories;
    }

    /**
     * @return array
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * @param array $categories
     */
    public function setCategories($categories)
    {
        $this->categories = $categories;
    }


}