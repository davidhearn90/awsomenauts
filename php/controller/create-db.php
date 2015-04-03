<?php
//
	require_once(__DIR__ . "/../model/config.php");//requires a file requires a file onec
//__dir__ checks the directory for model
	

            //creates table in blog database
             $query = $_SESSION{"connection"}->query("CREATE TABLE posts ("
                ."id int(11) Not NULL AUTO_INCREMENT,"
             	."title varchar(255) NOT NULL,"
                ."post text NOT NULL,"
                ."DateTime datetime NOT NULL ,"
                ."PRIMARY KEY (id))");
            
              //creates users table in blog database
              $query = $_SESSION{"connection"}->query("CREATE TABLE users("

                . "id int(11) NOT NULL AUTO_INCREMENT,"

                . "username varchar(30) NOT NULL,"

                . "email varchar(50) NOT NULL,"

                . "password char(128) NOT NULL,"

                . "salt char(128) NOT NULL,"

                . "PRIMARY KEY (id))");

              //runs if there are no errors in the table
              

        	

        

