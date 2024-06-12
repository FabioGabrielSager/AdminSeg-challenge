<?php

namespace AppBundle\DTO\Common;

class PaginatedResponseBase
{
    /**
     * @var int
     * */
    protected $page;

    /**
     * @var int
     * */
    protected $limit;

    /**
     * @var int
     * */
    protected $totalMatches;

    /**
     * @return int
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * @param int $page
     */
    public function setPage($page)
    {
        $this->page = $page;
    }

    /**
     * @return int
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @param int $limit
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;
    }

    /**
     * @return int
     */
    public function getTotalMatches()
    {
        return $this->totalMatches;
    }

    /**
     * @param int $totalMatches
     */
    public function setTotalMatches($totalMatches)
    {
        $this->totalMatches = $totalMatches;
    }
}