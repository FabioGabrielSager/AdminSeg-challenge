<?php

namespace AppBundle\DTO\Product;

use AppBundle\DTO\Category\CategoryResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ModifyProductRequest extends CreateProductRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @param int $id
     * @param mixed $image
     * @param int $categoryId
     * @param string $name
     * @param string $creatorUsername
     */
    public function __construct($id, $image, $categoryId, $name, $creatorUsername)
    {
        parent::__construct($image, $categoryId, $name, $creatorUsername);
        $this->id = $id;
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
}