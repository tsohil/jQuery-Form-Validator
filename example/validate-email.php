<?php
$json = array();

if(count($_POST) == 0)
    $json['message'] = 'No data posted';

elseif(empty($_POST['validate']))
    $json['message'] = 'Validate argument was empty';

else {
    if($_POST['validate'] == 'john.doe@website.com')
        $json['message'] = 'E-mail address already registered';
    else
        $json['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($json);