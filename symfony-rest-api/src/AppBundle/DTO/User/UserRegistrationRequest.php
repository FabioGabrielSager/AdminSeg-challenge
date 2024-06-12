<?php

namespace AppBundle\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;

class UserRegistrationRequest extends UserDto
{
    /**
     * @var string
     *
     * @Assert\NotBlank
     */
    private $password;

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword(string $password)
    {
        $this->password = $password;

        return $this;
    }
}