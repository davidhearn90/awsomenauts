<?php
require_once(__DIR__ . "/../Model/config.php");
$array = array(
    'exp'=> '',
    'exp1'=> '',
    'exp2'=> '',
    'exp3'=> '',
    'exp4'=> '',
);
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING); 
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
//This is going to select our salt and password from out username
$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username'");
//Check to see if the password tht you logged in with is the same as the one you have stored in our database
if($query->num_rows == 1) {
    $row = $query->fetch_array();
    //echo in whether your log in will be successful or not
    if($row["password"] === crypt($password, $row["salt"])) {
        $_SESSION["authenticated"] = true;  
        $array["exp"] = $row["exp"];
        $array["exp1"] = $row["exp1"];
        $array["exp2"] = $row["exp2"];
        $array["exp3"] = $row["exp3"];
        $array["exp4"] = $row["exp4"];
                $_SESSION["name"] = $username;  
        echo json_encode($array);
    }
    else {
        echo "Logon failure: unknown user name or bad password.";
    }
}
else {
    echo "Logon failure: unknown user name or bad password.";
}
