<?php
$json = array('success' => 'false', 'message'=>'This value has to be &quot;hello&quot;');
if( isset($_REQUEST['validate']) ) {
    $json['success'] = $_REQUEST['validate'] == 'hello';
}

sleep(2);

echo json_encode($json);