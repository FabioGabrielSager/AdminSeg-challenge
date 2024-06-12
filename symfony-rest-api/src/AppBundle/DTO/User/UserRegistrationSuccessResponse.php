<?php

namespace AppBundle\DTO\User;

class UserRegistrationSuccessResponse extends UserDto
{
    /**
     * @var string
     */
    private $token;

    /**
     * @var string[]
     */
    private $roles;

    /**
     * @param string $username
     * @param string $email
     * @param string $token
     * @param string[] $roles
     */
    public function __construct($username, $email, $token, $roles)
    {
        parent::__construct($username, $email);
        $this->token = $token;
        $this->roles = $roles;
    }

    public function getToken()
    {
        return $this->token;
    }

    public function setToken($email)
    {
        $this->token = $email;

        return $this;
    }

    /**
     * @return string[]
     */
    public function getRoles()
    {
        return $this->roles;
    }

    /**
     * @param string[] $roles
     */
    public function setRoles($roles)
    {
        $this->roles = $roles;

        return $this;
    }
}