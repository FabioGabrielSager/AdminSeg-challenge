<?php

namespace AppBundle\DTO\Product;

use AppBundle\DTO\Category\CategoryResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ProductDto
{
    /**
     * @var string
     * @Assert\NotBlank
     */
    protected $name;

    /**
     * @var CategoryResponse
     * @Assert\NotNull
     */
    protected $category;

    /**
     * @param string $name
     * @param CategoryResponse $category
     */
    public function __construct($name, $category)
    {
        $this->name = $name;
        $this->category = $category;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return CategoryResponse
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * @param CategoryResponse $category
     */
    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }


}