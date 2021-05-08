<?php


Class ElevatorController{
    public $status;
    public $floorAt;

    function __construct()
    {
        $this->status = "available";
        $this->floorAt = 0;
    }
}