<?php
class Functions
{
    function ajaxToFunction($location)
    {
        $locationArray = explode('/', $location);
        $controller = $locationArray[1] . 'Controller';
        $function = $locationArray[2];
        include_once './controllers/' . $controller . '.php';
        $requestData = json_decode(file_get_contents('php://input'), true);
        $ajaxCall = new $controller();
        $result = $ajaxCall->$function($requestData);
        return $result;
    }
}
