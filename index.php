<?php 

$auth_key = 'srx1fd0hqaa8hw78rv752eypne2t6bykvf0u8do2b2hvkkvrf7';
$species_id = '0';
$room_string = 'All';

$xml_temp_string = file_get_contents('http://ws.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . $auth_key . '&speciesID=' . $species_id . '&sex=A&ageGroup=ALL&location=' . $room_string . '&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');


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

$xml_temp_string;