<?php

namespace AppBundle\DTO\Product;

use AppBundle\DTO\Category\CategoryResponse;

class ProductResponseDto extends ProductDto
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $image;


    /**
     * @param int $id
     * @param string $name
     * @param string $image
     * @param CategoryResponse $category
     */
    public function __construct($id, $name, $image, $category)
    {
        parent::__construct($name, $category);
        $this->id = $id;
        $this->image = $image;
    }


    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param string $image
     */
    public function setImage($image)
    {
        $this->image = $image;
    }
}