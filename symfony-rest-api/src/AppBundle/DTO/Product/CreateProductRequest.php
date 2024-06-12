<?php

namespace AppBundle\DTO\Product;

use AppBundle\DTO\Category\CategoryResponse;
use Symfony\Component\Validator\Constraints as Assert;

class CreateProductRequest
{
    /**
     * @var string
     * @Assert\NotBlank
     */
    protected $name;

    /**
     * @var int
     * @Assert\NotNull
     */
    protected $categoryId;

    /**
     * @var mixed
     **/
    private $image;

    /**
     * @var string
     * @Assert\NotNull
     **/
    private $creatorUsername;

    /**
     * @param mixed $image
     * @param int $categoryId
     * @param string $name
     * @param string $creatorUsername
     */
    public function __construct($image, $categoryId, $name, $creatorUsername)
    {
        $this->name = $name;
        $this->categoryId = $categoryId;
        $this->image = $image;
        $this->creatorUsername = $creatorUsername;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     */
    public function setImage($image)
    {
        $this->image = $image;
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
    }

    /**
     * @return int
     */
    public function getCategoryId()
    {
        return $this->categoryId;
    }

    /**
     * @param int $categoryId
     */
    public function setCategoryId($categoryId)
    {
        $this->categoryId = $categoryId;
    }

    /**
     * @return string
     */
    public function getCreatorUsername()
    {
        return $this->creatorUsername;
    }

    /**
     * @param string $creatorUsername
     */
    public function setCreatorUsername($creatorUsername)
    {
        $this->creatorUsername = $creatorUsername;
    }
}