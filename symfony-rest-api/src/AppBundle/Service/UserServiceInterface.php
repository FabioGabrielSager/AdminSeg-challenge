<?php

namespace AppBundle\Service;

use AppBundle\DTO\User\ChangePasswordRequest;
use AppBundle\DTO\User\UserDto;
use AppBundle\DTO\User\UserRegistrationRequest;

interface UserServiceInterface
{
    public function registerUser(UserRegistrationRequest $userData);
    public function getUserData($username);
    public function modifyUserData($username, UserDto $modifiedUser);
    public function deleteUser($username);
    public function changePassword(ChangePasswordRequest $request);
}