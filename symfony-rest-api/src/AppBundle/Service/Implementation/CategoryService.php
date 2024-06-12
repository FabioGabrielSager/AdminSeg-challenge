<?php

namespace AppBundle\Service\Implementation;

use AppBundle\DTO\Category\CategoriesDto;
use AppBundle\DTO\Category\CategoryResponse;
use AppBundle\Entity\Category;
use AppBundle\Exception\CategoryRegistrationException;
use AppBundle\Repository\CategoryRepositoryInterface;
use AppBundle\Service\CategoryServiceInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CategoryService implements CategoryServiceInterface
{
    private $categoryRepository;
    private $fileUploader;
    private $validator;

    /**
     * @param CategoryRepositoryInterface $categoryRepository
     * @param FileUploader $fileUploader
     * @param ValidatorInterface $validator
     */
    public function __construct(CategoryRepositoryInterface $categoryRepository, FileUploader $fileUploader,
                                ValidatorInterface $validator)
    {
        $this->categoryRepository = $categoryRepository;
        $this->fileUploader = $fileUploader;
        $this->validator = $validator;
    }


    public function getAllCategories()
    {
       $categoriesEntities = $this->categoryRepository->findAll();

       $categories = [];

       foreach ($categoriesEntities as $categoryEntity) {
           $categoryDto = new CategoryResponse($categoryEntity->getId(), $categoryEntity->getName(),
               $categoryEntity->getIcon());
           $categories[] = $categoryDto;
       }

       return new CategoriesDto($categories);
    }

    public function createCategory($categoryName, $categoryIcon)
    {
        $errors = $this->validator->validate($categoryName, [new NotBlank()]);

        if (count($errors) > 0) {
            $errorsString = (string)$errors;
            throw new CategoryRegistrationException($errorsString);
        }

        $iconPath = null;
        if($categoryIcon) {
            $iconPath = $this->fileUploader->upload($categoryIcon);
        }

        $newCategory = new Category();
        $newCategory->setName($categoryName);
        $newCategory->setIcon($iconPath);

        $this->categoryRepository->save($newCategory);

        return new CategoryResponse($newCategory->getId(), $newCategory->getName(), $iconPath);
    }

    public function modifyCategory($categoryId, $categoryName, $categoryIcon)
    {
        $category = $this->categoryRepository->find($categoryId);

        if(!$category) {
            throw new NotFoundHttpException("Category not found");
        }

        if($categoryName) {
            $category->setName($categoryName);
        }

        if($categoryIcon) {
            $category->setIcon($this->fileUploader->upload($categoryIcon));
        }

        $this->categoryRepository->save($category);

        return new CategoryResponse($category->getId(), $category->getName(), $category->getIcon());
    }

    public function deleteCategory($categoryId)
    {
        $category = $this->categoryRepository->find($categoryId);

        if(!$category) {
            throw new NotFoundHttpException("Category not found");
        }

        $this->categoryRepository->delete($category);
    }
}