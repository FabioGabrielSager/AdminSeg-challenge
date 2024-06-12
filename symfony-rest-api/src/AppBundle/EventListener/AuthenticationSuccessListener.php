<?php

namespace AppBundle\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthenticationSuccessListener
{
    private $jwtCookieName;

    public function __construct($jwtCookieName)
    {
        $this->jwtCookieName = $jwtCookieName;
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        // Create the JWT cookie
        $jwt = $data["token"];
        $response = $event->getResponse();
        $response->headers->setCookie(
            new Cookie($this->jwtCookieName, $jwt, 0, '/',
                "http://localhost:4200/", false, true, false,
                Cookie::SAMESITE_LAX)
        );

        // Restructure the response data
        $data = [
            "token" => $jwt,
            "email" => $user->getEmail(),
            "username" => $user->getUsername(),
            "roles" => $user->getRoles()
        ];

        $event->setData($data);
    }
}