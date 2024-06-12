<?php

namespace AppBundle\Controller;

use AppBundle\DTO\User\ChangePasswordRequest;
use AppBundle\DTO\User\UserDto;
use AppBundle\DTO\User\UserRegistrationRequest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class UserController extends Controller
{
    private $userService;
    private $serializer;
    private $jwtService;

    private function getUserService() {
        if($this->userService == null) {
            $this->userService = $this->container->get('user_service');
        }
        return $this->userService;
    }

    private function getSerializer() {
        if($this->serializer == null) {
            $this->serializer = $this->container->get('serializer');
        }

        return $this->serializer;
    }

    private function getJwtService() {
        if($this->jwtService == null) {
            $this->jwtService = $this->container->get('jwt_service');
        }
        return $this->jwtService;
    }

    /**
     * @Route("/logout", name="logout", methods={"POST"})
     */
    public function logout(Request $request)
    {
        $response = new JsonResponse(['message' => 'Logged out successfully']);
        $response->headers->clearCookie($this->getParameter('jwt_cookie_name'));

        return $response;
    }

    /**
     * @Route("/user/register", name="user_register", methods={"POST"})
     */
    public function register(Request $request)
    {
        $userData = $this->getSerializer()->deserialize($request->getContent(), UserRegistrationRequest::class, 'json');

        $user = $this->getUserService()->registerUser($userData);

        $responseContent = $this->getSerializer()->serialize($user, 'json');

        $response = new JsonResponse($responseContent, 201, [], true);
        $response->headers->setCookie(
            new Cookie($this->getParameter('jwt_cookie_name'),
                $user->getToken(), 0, '/',
                null, false,
                true, false,
                null)
        );

        return $response;
    }

    /**
     * @Route("/secure/user/", name="user_get", methods={"GET"})
     */
    public function getUserData(Request $request)
    {
        $user = $this->getUserService()->getUserData($this->getJwtService()->getUsernameFromRequest($request));

        return new JsonResponse($this->getSerializer()->serialize($user, 'json'), 200, [], true);
    }

    /**
     * @Route("/secure/user/modify", name="user_modify", methods={"PATCH"})
     */
    public function modifyUser(Request $request)
    {
        $userData = $this->getSerializer()->deserialize($request->getContent(), UserDto::class, 'json');

        $username = $this->getJwtService()->getUsernameFromRequest($request);

        $user = $this->getUserService()->modifyUserData($username, $userData);

        return new JsonResponse($this->getSerializer()->serialize($user, 'json'), 200, [], true);
    }

    /**
     * @Route("/secure/user/password/change", name="user_change_password", methods={"PATCH"})
     */
    public function changeUserPassword(Request $request)
    {
        $userData = $this->getSerializer()->deserialize($request->getContent(), ChangePasswordRequest::class, 'json');

        $userData->setUsername($this->getJwtService()->getUsernameFromRequest($request));

        $this->getUserService()->changePassword($userData);

        return new JsonResponse(null, 201);
    }

    /**
     * @Route("/secure/user/delete", name="user_delete", methods={"DELETE"})
     */
    public function deleteUser(Request $request)
    {
        $user = $this->getUserService()->deleteUser($this->getJwtService()->getUsernameFromRequest($request));

        return new JsonResponse(null, 204);
    }

    /**
     * @Route("/secure/user/products", name="user_products", methods={"GET"})
     */
    public function getUserRegisteredProducts(Request $request) {
        $username = $this->getJwtService()->getUsernameFromRequest($request);
        $productName = $request->query->get('productName');
        $categoryId = $request->query->get('categoryId');
        $page = $request->query->get('page');
        $limit = $request->query->get('limit');

        if($page == null) $page = 1;
        if($limit == null) $limit = 10;

        $products = $this->container->get('product_service')->getUserRegisteredProducts($username, $productName,
                                                                                            $categoryId, $page, $limit);

        $serializedProducts = $this->container->get('serializer')->serialize($products, 'json');

        return new JsonResponse($serializedProducts, 200, [], true);
    }

    /**
     * @Route("/secure/user/is-authenticated", name="is_authenticated", methods={"GET"})
     */
    public function isAuthenticated(Request $request)
    {
        return $this->json(['authenticated' => true]);
    }

    /**
     * @Route("/secure/user/is-admin", name="is_admin", methods={"GET"})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function isAdmin(Request $request)
    {
        return $this->json(['isAdmin' => true]);
    }
}