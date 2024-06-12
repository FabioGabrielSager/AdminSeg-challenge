<?php

namespace AppBundle\EventListener;

use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class ExceptionListener
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        $statusCode = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;

        if($exception instanceof NoResultException || $exception instanceof NotFoundResourceException) {
            $statusCode = 404;
        }

        $response = new JsonResponse([
            'error' => [
                'code' => $statusCode,
                'message' => $exception->getMessage(),
//                'trace' => $exception->getTrace()
            ]
        ], $statusCode);

        // Set headers if needed
        $response->headers->set('Content-Type', 'application/json');

        $event->setResponse($response);
    }
}