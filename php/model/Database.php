<?php
//creates your own object so you can call these functions easier
class Database{
//private so other files can't access it
private $connection;
private $host;
private $username;
private $password;
private $database;
public $error;
//assigns information to the global variables
public function __construct($host, $username, $password, $database){
	$this->host = $host;
	$this->username = $username;
	$this->password = $password;
	$this->database = $database;

	$this->connection = new mysqli($host, $username, $password);//connects the databae variables
        //runs if there is a connection error
        if($this->connection->connect_error) {
            
            die("<p>Error: " .$connection->connect_error."</p>");
        }
        $exists = $this->connection->select_db($database);
        	//!exists runs if database does not exist
        if(!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database"); 

            //$query is like a question 
            
        }
        //only runs if you already have an existing database
}
//opens connection
public function openConnection(){
	$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
	 //runs if there is a connection error
	 if($this->connection->connect_error) {
            
            die("<p>Error: " .$this->connection->connect_error."</p>");
        }

}
//closes connection
public function closeConnection(){
	//checks weatther you open the connection or not
	//isset checks if the variable is set
	if(isset($this->connection)){
		$this->connection->close();
	};

}

public function query($string){
	$this->openConnection();
	//queries the database
	$query = $this->connection->query($string);
	//runs the opposite of whatever query is
	if(! $query){

		$this->error = $this->connection->error;
	};

	$this->closeConnection();
	//returns the results of the query
	return $query;

}
	
}