<?php

namespace AppBundle\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;

class UserDto
{
    /**
     * @var string
     *
     * @Assert\NotBlank
     */
    protected $username;

    /**
     * @Assert\NotBlank
     * @Assert\Email
     */
    protected $email;

    /**
     * @param string $username
     * @param $email
     */
    public function __construct(string $username, $email)
    {
        $this->username = $username;
        $this->email = $email;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername(string $username)
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail(string $email)
    {
        $this->email = $email;

        return $this;
    }
}