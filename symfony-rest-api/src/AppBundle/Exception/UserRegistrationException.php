<?php

namespace AppBundle\Exception;

use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserRegistrationException extends HttpException
{
    public function __construct($message = 'User registration error', $statusCode = 400,
                                Exception $previous = null, array $headers = [], $code = 0)
    {
        parent::__construct($statusCode, $message, $previous, $headers, $code);
    }
}