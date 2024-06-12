<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class CategoryController extends Controller
{

    /**
     * @Route("/category", name="category_get_all", methods={"GET"})
     */
    public function getAllCategories() {
        $categories = $this->container->get('category_service')->getAllCategories();

        $serializedCategories = $this->container->get('serializer')->serialize($categories, 'json');

        return new JsonResponse($serializedCategories, 200, [], true);
    }

    /**
     * @Route("secure/category/create", name="category_create", methods={"POST"})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function createCategory(Request $request) {
        $categoryData = $request->request->all();
        $categoryIcon = $request->files->get('icon');

        $category = $this->container->get('category_service')->createCategory($categoryData['name'], $categoryIcon);

        return new JsonResponse($this->container->get('serializer')->serialize($category, 'json'), 200, [], true);
    }

    /**
     * @Route("secure/category/modify", name="category_modify", methods={"POST"})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function modifyCategory(Request $request) {
        $categoryData = $request->request->all();
        $categoryIcon = $request->files->get('icon');

        $category = $this->container->get('category_service')->modifyCategory($categoryData['id'], $categoryData['name'],
            $categoryIcon);

        return new JsonResponse($this->container->get('serializer')->serialize($category, 'json'), 200, [], true);
    }

    /**
     * @Route("secure/category/delete/{id}", name="category_delete", methods={"DELETE"})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function deleteCategory($id) {
        $this->container->get('category_service')->deleteCategory($id);

        return new JsonResponse(null, 204);
    }
}