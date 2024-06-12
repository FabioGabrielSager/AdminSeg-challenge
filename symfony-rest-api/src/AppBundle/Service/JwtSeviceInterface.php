<?php

namespace AppBundle\Service;

use Symfony\Component\HttpFoundation\Request;

interface JwtSeviceInterface
{
    public function getTokenFromRequest(Request $request);
    public function getTokenFromHeader(Request $request);
    public function getTokenFromCookie(Request $request);
    public function getUsernameFromToken($token);
    public function getUsernameFromHeader(Request $request);
    public function getUsernameFromCookie(Request $request);
    public function getUsernameFromRequest(Request $request);
}