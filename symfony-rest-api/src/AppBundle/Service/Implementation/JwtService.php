<?php

namespace AppBundle\Service\Implementation;

use AppBundle\Service\JwtSeviceInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\HttpFoundation\Request;

class JwtService implements JwtSeviceInterface
{
    private $jwtEncoder;
    private $jwtCookieName;

    public function __construct(JWTEncoderInterface $jwtEncoder, $jwtCookieName)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->jwtCookieName = $jwtCookieName;
    }


    public function getTokenFromHeader(Request $request)
    {
        $authHeader = $request->headers->get('Authorization');
        $token = "";
        if (strpos($authHeader, 'Bearer ') === 0) {
            // Remove 'Bearer ' prefix
            $token = substr($authHeader, 7);
        }

        return $token;
    }

    public function getUsernameFromToken($token)
    {
        $decodedToken = $this->jwtEncoder->decode($token);

        return $decodedToken['username'];
    }

    public function getUsernameFromHeader(Request $request)
    {
        return $this->getUsernameFromToken($this->getTokenFromHeader($request));
    }

    public function getTokenFromCookie(Request $request)
    {
        return $request->cookies->get($this->jwtCookieName);
    }

    public function getTokenFromRequest(Request $request)
    {
       $token = $this->getTokenFromHeader($request);

       if($token == "") {
           $token = $this->getTokenFromCookie($request);
       }

       return $token;
    }

    public function getUsernameFromCookie(Request $request)
    {
        return $this->getUsernameFromToken($this->getTokenFromCookie($request));
    }

    public function getUsernameFromRequest(Request $request)
    {
        return $this->getUsernameFromToken($this->getTokenFromRequest($request));
    }
}