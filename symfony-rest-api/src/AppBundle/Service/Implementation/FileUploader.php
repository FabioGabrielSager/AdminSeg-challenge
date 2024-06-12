<?php

namespace AppBundle\Service\Implementation;

use AppBundle\Service\FileUploaderInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class FileUploader implements FileUploaderInterface
{
    private $targetDirectory;
    private $router;

    public function __construct($targetDirectory, RouterInterface $router)
    {
        $this->targetDirectory = $targetDirectory;
        $this->router = $router;
    }

    public function upload(UploadedFile $file)
    {
        $fileName = md5(uniqid()).'.'.$file->guessExtension();
        $file->move($this->getTargetDirectory(), $fileName);
        return $this->router->generate('serve_image', ["filename" => $fileName],
            UrlGeneratorInterface::ABSOLUTE_URL);
    }

    public function getTargetDirectory()
    {
        return $this->targetDirectory;
    }
}