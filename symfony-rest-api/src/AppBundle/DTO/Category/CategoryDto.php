<?php

namespace AppBundle\DTO\Category;

class CategoryDto
{
    /**
     * @var string
     */
    private $name;
    private $icon;

    /**
     * @param string $name
     * @param $icon
     */
    public function __construct($name, $icon)
    {
        $this->name = $name;
        $this->icon = $icon;
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
     * @return mixed
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param mixed $icon
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;
    }
}