<?php

namespace AppBundle\DTO\Category;

class CategoryResponse extends CategoryDto
{
    private $id;

    /**
     * @param $id
     * @param $name
     * @param $icon
     */
    public function __construct($id, $name, $icon = null)
    {
        parent::__construct($name, $icon);
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }
}