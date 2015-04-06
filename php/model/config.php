<?php
require_once(__DIR__ . "/database.php");
//stores the database object
session_start();
session_regenerate_id(true);

$path = "/awesomenauts/php/";

//$host stores host name of our server
$host = "localhost";
$username = "root";
$password = "root";
$database = "awesomenauts_db";
//runs if the session variable is not set 
if(!isset($_SESSION{"connection"})) {
	//creates new object that will be stored in connection
	$connection = new Database($host, $username, $password, $database);
	//checks if the session variable exists
	$_SESSION{"connection"} = $connection;
}
