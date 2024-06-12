<?php

namespace AppBundle\Service\Implementation;

use AppBundle\DTO\Category\CategoryResponse;
use AppBundle\DTO\Product\ProductResponseDto;
use AppBundle\DTO\Product\ProductSearchResultDto;
use AppBundle\DTO\User\ChangePasswordRequest;
use AppBundle\DTO\User\UserDto;
use AppBundle\DTO\User\UserRegistrationRequest;
use AppBundle\DTO\User\UserRegistrationSuccessResponse;
use AppBundle\Entity\User;
use AppBundle\Exception\UserRegistrationException;
use AppBundle\Repository\ProductRepositoryInterface;
use AppBundle\Repository\RoleRepositoryInterface;
use AppBundle\Repository\UserRepositoryInterface;
use AppBundle\Service\UserServiceInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\NoResultException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Translation\Exception\NotFoundResourceException;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserService implements UserServiceInterface
{
    private $passwordEncoder;
    private $userRepository;
    private $roleRepository;
    private $jwtManager;
    private $validator;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder, JWTManagerInterface $jwtManager,
                                UserRepositoryInterface $userRepository, ValidatorInterface $validator,
                                RoleRepositoryInterface $roleRepository)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
        $this->jwtManager = $jwtManager;
        $this->validator = $validator;
    }

    public function registerUser(UserRegistrationRequest $userData)
    {
        $errors = $this->validator->validate($userData);

        if (count($errors) > 0) {
            $errorsString = (string)$errors;
            throw new UserRegistrationException($errorsString);
        }

        $this->checkUsernameAvailability($userData->getUsername());
        $this->checkEmailAvailability($userData->getEmail());

        $userRole = $this->roleRepository->findOneBy(['name' => 'ROLE_USER']);

        $newUser = new User();
        $newUser->setUsername($userData->getUsername());
        $newUser->setPassword($this->passwordEncoder->encodePassword($newUser, $userData->getPassword()));
        $newUser->setEmail($userData->getEmail());
        $newUser->addRole($userRole);

        $this->userRepository->save($newUser);

        $token = $this->jwtManager->create($newUser);

        return new UserRegistrationSuccessResponse(
            $newUser->getUsername(),
            $newUser->getEmail(),
            $token,
            $newUser->getRoles()
        );
    }

    /**
     * @throws NoResultException
     */
    public function getUserData($username)
    {
        $userEntity = $this->userRepository->findByUsername($username);

        if ($userEntity == null) {
            throw new NoResultException();
        }

        return new UserDto($userEntity->getUsername(), $userEntity->getEmail());
    }

    /**
     * @throws NoResultException
     */
    public function modifyUserData($username, UserDto $modifiedUser)
    {
        $userEntity = $this->userRepository->findByUsername($username);

        if ($userEntity == null) {
            throw new NoResultException();
        }

        if ($userEntity->getUsername() != $modifiedUser->getUsername()) {
            $this->checkUsernameAvailability($modifiedUser->getUsername());
        }

        if ($userEntity->getEmail() != $modifiedUser->getEmail()) {
            $this->checkEmailAvailability($modifiedUser->getEmail());
        }

        if ($modifiedUser->getUsername() != null && $modifiedUser->getUsername() != "") {
            $userEntity->setUsername($modifiedUser->getUsername());
        }

        if ($modifiedUser->getEmail() != null && $modifiedUser->getEmail() != "") {
            $errors = $this->validator->validate($modifiedUser->getEmail(), [new Email()]);

            if (count($errors) > 0) {
                $errorsString = (string)$errors;
                throw new UserRegistrationException($errorsString);
            }

            $userEntity->setEmail($modifiedUser->getEmail());
        }

        $this->userRepository->save($userEntity);

        return new UserDto($userEntity->getUsername(), $userEntity->getEmail());
    }

    public function changePassword(ChangePasswordRequest $request) {
        $errors = $this->validator->validate($request);

        if (count($errors) > 0) {
            $errorsString = (string)$errors;
            throw new UserRegistrationException($errorsString);
        }

        $userEntity = $this->userRepository->findByUsername($request->getUsername());

        if ($userEntity == null) {
            throw new NotFoundResourceException("User not found.");
        }

        if(!$this->passwordEncoder->isPasswordValid($userEntity, $request->getPassword())) {
            throw new AuthenticationException("Password invalid.");
        }

        $userEntity->setPassword($this->passwordEncoder->encodePassword($userEntity, $request->getNewPassword()));

        $this->userRepository->save($userEntity);
    }

    public function deleteUser($username)
    {
        $userEntity = $this->userRepository->findByUsername($username);

        if ($userEntity == null) {
            throw new NoResultException();
        }

        $this->userRepository->delete($userEntity);
    }

    private function checkUsernameAvailability($username)
    {
        $existingUser = $this->userRepository->findOneBy(['username' => $username]);
        if ($existingUser !== null) {
            throw new UserRegistrationException('Username already exists.');
        }
    }

    private function checkEmailAvailability($email)
    {
        $existingUser = $this->userRepository->findOneBy(['email' => $email]);
        if ($existingUser !== null) {
            throw new UserRegistrationException('Email already exists.');
        }
    }
}