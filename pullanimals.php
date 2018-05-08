<?php

    define('WP_USE_THEMES', false);
    require('../../../wp-blog-header.php');
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['type'])) {
            $type = $_GET['type'];
            if($_GET['type']=="all") {         #Pull all animals located in dog rooms  
                header('Content-type: application/json');
                $speciesID = '0';
                echo_json($speciesID);
            } else {
                echo "Unknown type set";
            }
        } else {
            echo "No type set";
        }
    }

function test_for_empty_object($object) {
    if(count($object) == 0) {
        return false;
    } else {
        return true;
    }
}

function echo_json($speciesID) {
    
    $xml_temp_string = file_get_contents('http://ws.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=' . $speciesID . '&sex=A&ageGroup=ALL&location=' . $room_string . '&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
    $xml_temp = simplexml_load_string($xml_temp_string);
    $json_temp = json_encode($xml_temp);
    $json_temp_decode = json_decode($json_temp, true);
    $json_array[] = $json_temp_decode;

    #Cycle through each JSON object, and merge it together into one mega-JSON object
    $merged_array = array();
    foreach($json_array as $json) {
        $merged_array = array_merge($merged_array, $json["XmlNode"]);
        $merged_array = array_filter($merged_array, "test_for_empty_object");
    }
     
    #encode and return the mega-object
    echo json_encode($merged_array);
}
?>
