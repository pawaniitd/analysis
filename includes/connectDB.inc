<?php

	function connectDB() {
		$host = "localhost";
		$db_name = "eumentis_tb_papers";
		$user = "pawn";
		$pass = "ppppp";
	
		return new PDO("pgsql:host=localhost;dbname=$db_name", $user, $pass);
	}