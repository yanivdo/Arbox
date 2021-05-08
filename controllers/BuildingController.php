<?php
include_once './controllers/ElevatorController.php';
session_start();
class BuildingController
{
    public $grid;
    public $floors;
    public $elevators;
    public $queue;
    function __construct()
    {
        $this->queue = [];
        $this->floors = 10;
        $this->elevators = 5;
        for ($i = 0; $i < $this->elevators; $i++) {
            $this->grid[$i]['floorAt'] = 0;
            $this->grid[$i]['status'] = "available";
        }
    }

    function callElevetorQueue($floor)
    {
        $result = [];
        array_push($this->queue, $floor);
        $result = $this->checkElevatorQueue();
        return $result;
    }

    function checkElevatorQueue(){
        foreach ($this->queue as $pos => $singleQueue) {
            $result = $this->findMinimumDistance($pos, $singleQueue);
        }
        return $result;
    }

    function findMinimumDistance($queuePos, $floor)
    {

        //unset($_SESSION['grid']);
        $elevator = -1;
        $smallestDistance = $this->floors + 1;
        $result = ['msg' => 'full queue', 'elevator' => -1, 'distance' => -1];
        if ($floor < 0 || $floor > $this->floors) {
            return ['msg' => 'error', 'elevator' => -1, 'distance' => -1];
        }
        if(isset($_SESSION['grid'])){
            $this->grid = $_SESSION['grid'];
        }
        foreach ($this->grid as $elevatorNum => $elevatorPos) {
            if ((abs($elevatorPos['floorAt'] - $floor) < $smallestDistance) && $elevatorPos['status'] == 'available') {
                $elevator = $elevatorNum;
                $smallestDistance = abs($elevatorPos['floorAt'] - $floor);
            }
        }
        if ($elevator != -1) {
            unset($this->queue[$queuePos]);
            $this->queue = array_values($this->queue);
            $this->grid[$elevator]['floorAt'] = $floor;
            $this->grid[$elevator]['status'] = "occupied";
            $_SESSION['grid'] = $this->grid;
            $result = ['msg' => 'success', 'elevator' => $elevator, 'distance' => $smallestDistance];
        }
        return $result;
    }

    function elevatorCallApi($floorData){
        $floor = $floorData['floor'];
        $result = $this->callElevetorQueue($floor);
        return $result;
    }

    function updateElevatorStatus($elevator){
        $_SESSION['grid'][$elevator['elevatorNum']]['status'] = "available";
        return $_SESSION['grid'];
    }

    function elevatorsPlaces(){
        unset($_SESSION['grid']);
        $elevatorsFloors = [];
        if(isset($_SESSION['grid'])){
            $this->grid = $_SESSION['grid'];
        }
        foreach($this->grid as $singleElevator){
            $elevatorsFloors[] =  $singleElevator['floorAt'];
        }
        return $elevatorsFloors;
    }
}
