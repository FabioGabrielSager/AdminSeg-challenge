<?php

namespace AppBundle\Service\Implementation;

use AppBundle\DTO\Category\CategoryResponse;
use AppBundle\DTO\Product\CreateProductRequest;
use AppBundle\DTO\Product\ModifyProductRequest;
use AppBundle\DTO\Product\ProductResponseDto;
use AppBundle\DTO\Product\ProductSearchResultDto;
use AppBundle\Entity\Product;
use AppBundle\Exception\ProductRegistrationException;
use AppBundle\Repository\CategoryRepositoryInterface;
use AppBundle\Repository\ProductRepositoryInterface;
use AppBundle\Repository\UserRepositoryInterface;
use AppBundle\Service\FileUploaderInterface;
use AppBundle\Service\ProductServiceInterface;
use Symfony\Component\Translation\Exception\NotFoundResourceException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService implements ProductServiceInterface
{
    private $productRepository;
    private $categoryRepository;
    private $userRepository;
    private $fileUploader;
    private $validator;

    /**
     * @param ProductRepositoryInterface $productRepository
     * @param FileUploaderInterface $fileUploader
     * @param CategoryRepositoryInterface $categoryRepository
     * @param ValidatorInterface $validator
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(ProductRepositoryInterface $productRepository, FileUploaderInterface $fileUploader,
                                CategoryRepositoryInterface $categoryRepository, ValidatorInterface $validator,
                                UserRepositoryInterface $userRepository)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
        $this->userRepository = $userRepository;
        $this->fileUploader = $fileUploader;
        $this->validator = $validator;
    }


    public function getProducts($name, $categoryId, $page = 1, $limit = 10)
    {
        $result = new ProductSearchResultDto();
        $result->setPage($page);
        $result->setLimit($limit);
        $result->setTotalMatches($this->productRepository->countByNameAndCategory($name, $categoryId));

        $productsEntities = $this->productRepository->findAllByNameAndCategory($name, $categoryId, $page, $limit);

        $result->setProducts($this->mapProductEntitiesPaginatorToProductResponseArray($productsEntities));

        return $result;
    }


    public function getUserRegisteredProducts($username, $productName, $categoryId, $page, $limit)
    {
        $result = new ProductSearchResultDto();
        $result->setPage($page);
        $result->setLimit($limit);
        $result->setTotalMatches($this->productRepository->countByCreatorUsername($username, $productName, $categoryId));

        $productsEntities = $this->productRepository->findAllByCreatorUsername($username, $productName, $categoryId,
            $page, $limit);

        $result->setProducts($this->mapProductEntitiesPaginatorToProductResponseArray($productsEntities));

        return $result;
    }

    public function createProduct(CreateProductRequest $product)
    {
        $errors = $this->validator->validate($product);

        if (count($errors) > 0) {
            $errorsString = (string)$errors;
            throw new ProductRegistrationException($errorsString);
        }

        $category = $this->categoryRepository->find($product->getCategoryId());
        if (!$category) {
            throw new NotFoundResourceException('Category not found');
        }

        $creator = $this->userRepository->findByUsername($product->getCreatorUsername());
        if (!$creator) {
            throw new NotFoundResourceException('User not found');
        }

        $imageName = null;
        if($product->getImage()) {
            $imageName = $this->fileUploader->upload($product->getImage());
        }

        $newProductEntity = new Product();
        $newProductEntity->setName($product->getName());
        $newProductEntity->setImage($imageName);
        $newProductEntity->setCategory($category);
        $newProductEntity->setUser($creator);

        $this->productRepository->save($newProductEntity);

        return $this->mapProductEntityToProductResponse($newProductEntity);
    }

    public function updateProduct(ModifyProductRequest $product)
    {
        $productEntity = $this->productRepository
            ->findByIdAndCreatorUsername($product->getId(), $product->getCreatorUsername());

        if(!$productEntity) {
            throw new NotFoundResourceException('Product not found');
        }

        if($product->getName()) {
            $productEntity->setName($product->getName());
        }

        if($product->getImage()) {
            $productEntity->setImage($this->fileUploader->upload($product->getImage()));
        }

        if($product->getCategoryId()) {
            $category = $this->categoryRepository->find($product->getCategoryId());
            if (!$category) {
                throw new NotFoundResourceException('Category not found');
            }

            $productEntity->setCategory($category);
        }

        $this->productRepository->save($productEntity);

        return $this->mapProductEntityToProductResponse($productEntity);
    }

    public function deleteProduct($creatorUsername, $productId)
    {
        $productEntity = $this->productRepository->findByIdAndCreatorUsername($productId, $creatorUsername);

        if(!$productEntity) {
            throw new NotFoundResourceException('Product not found');
        }

        $this->productRepository->delete($productEntity);
    }

    public function getProductById($productId)
    {
        $productEntity = $this->productRepository->find($productId);

        if(!$productEntity) {
            throw new NotFoundResourceException('Product not found');
        }

        return $this->mapProductEntityToProductResponse($productEntity);
    }

    private function mapProductEntitiesPaginatorToProductResponseArray($productsEntities)
    {
        $mappedProducts = [];
        foreach ($productsEntities as $product) {
            $productDto = $this->mapProductEntityToProductResponse($product);
            $mappedProducts[] = $productDto;
        }

        return $mappedProducts;
    }

    private function mapProductEntityToProductResponse(Product $productEntity) {
        $categoryDto = new CategoryResponse(
            $productEntity->getCategory()->getId(),
            $productEntity->getCategory()->getName(),
            $productEntity->getCategory()->getIcon()
        );
        return new ProductResponseDto(
            $productEntity->getId(),
            $productEntity->getName(),
            $productEntity->getImage(),
            $categoryDto
        );
    }
}