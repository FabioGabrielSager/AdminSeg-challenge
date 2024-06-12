<?php

namespace AppBundle\Controller;

use AppBundle\DTO\Product\CreateProductRequest;
use AppBundle\DTO\Product\ModifyProductRequest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ProductController extends Controller
{
    /**
     * @Route("/product", name="product_search", methods={"GET"})
     */
    public function searchProducts(Request $request) {
        $productName = $request->query->get('productName');
        $categoryId = $request->query->get('categoryId');
        $page = $request->query->get('page');
        $limit = $request->query->get('limit');

        if($page == null) $page = 1;
        if($limit == null) $limit = 10;

        $products = $this->container->get('product_service')->getProducts($productName, $categoryId, $page, $limit);

        $serializedProducts = $this->container->get('serializer')->serialize($products, 'json');

        return new JsonResponse($serializedProducts, 200, [], true);
    }

    /**
     * @Route("/product/{productId}", name="product_by_id", methods={"GET"})
     */
    public function getProductById($productId)
    {
        $product = $this->container->get('product_service')->getProductById($productId);
        return new JsonResponse(
            $this->container->get('serializer')->serialize($product, 'json'), 200, [], true
        );
    }

    /**
     * @Route("/secure/product/create", name="create_product", methods={"POST"})
     */
     public function createProduct(Request $request) {
         $newProductData = $request->request->all();
         $newProductImage = $request->files->get('image');
         $creatorUsername = $this->container->get('jwt_service')->getUsernameFromRequest($request);

         $newProduct = new CreateProductRequest($newProductImage, $newProductData['categoryId'],
                                                $newProductData['productName'], $creatorUsername);

         $product = $this->container->get('product_service')->createProduct($newProduct);

         $serializedProducts = $this->container->get('serializer')->serialize($product, 'json');

         return new JsonResponse($serializedProducts, 201, [], true);
     }

    /**
     * @Route("/secure/product/update", name="update_product", methods={"POST"})
     */
    public function updateProduct(Request $request) {
        $productData = $request->request->all();
        $productImage = $request->files->get('image');
        $creatorUsername = $this->container->get('jwt_service')->getUsernameFromRequest($request);

        $product = new ModifyProductRequest($productData['productId'], $productImage, $productData['categoryId'],
            $productData['productName'], $creatorUsername);

        $modifiedProduct = $this->container->get('product_service')->updateProduct($product);

        $serializedProducts = $this->container->get('serializer')->serialize($modifiedProduct, 'json');

        return new JsonResponse($serializedProducts, 200, [], true);
    }

    /**
     * @Route("/secure/product/delete/{id}", name="delete_product", methods={"DELETE"})
     */
    public function deleteProduct($id, Request $request) {
        $creatorUsername = $this->container->get('jwt_service')->getUsernameFromRequest($request);

        $this->container->get('product_service')->deleteProduct($creatorUsername, $id);

        return new JsonResponse(null, 204);
    }
}