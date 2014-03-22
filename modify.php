<?php
	
	error_reporting(0);

	$file_pageNo = "files/pageNo.txt";

	function connectDB () {
					$host = "localhost";
					$db_name = "eumentis_tb_papers";
					$user = "pawn";
					$pass = "ppppp";
					
					return new PDO("pgsql:host=localhost;dbname=$db_name", $user, $pass);
				}
				
				$conn = connectDB();
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if (isset($_GET['q'])) {
	
		//This loads the page no. to load at the start of application, based on the page last seen
		if ($_GET['q'] == "pageNo") {
		
			$number = file_get_contents($file_pageNo);
			if ($number === FALSE) {
				$number = 0;
			}
			echo $number;
			
		}
	
		//This is to get the list of papers already marked as relevant or non relevant
		if ($_GET['q'] == "initial_relevance") {
			$table = $_GET['value'];
			$sql = "SELECT * FROM $table";
			
			try {
				$q = $conn -> prepare($sql);
				$q -> execute() or die("failed-execute");
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			$result = $q->fetchAll(PDO::FETCH_COLUMN, 0);
			
			echo json_encode($result);
		}
	
		//This is to mark if the paper is relevant or not and add it to DB
		if ($_GET['q'] == "relevance") {
		
			$table = "";
			if ($_GET['type'] == "yes") {
				$table = "relevant";
			}
			if ($_GET['type'] == "no") {
				$table = "non_relevant";
			}
		
			$id = $_GET['value'];
			$sql = "INSERT INTO $table (pmid) VALUES (?)";
			
			try {
				$q = $conn -> prepare($sql);
				$q -> execute(array($id)) or die("failed-execute");
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			$num = $_GET['pageNo'];
			file_put_contents($file_pageNo, $num);
		}
		
		
	}
?>