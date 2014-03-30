<?php


//error_reporting(0);

include '../includes/connectDB.inc';
				
$conn = connectDB();
//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (isset($_GET['q'])) {
	
	//Load data for Drugs - Category autocomplete
	if ($_GET['q'] == "drug_category") {
		$sql = "SELECT DISTINCT category FROM drugs";
		
		$q = $conn -> prepare($sql);
		$q -> execute() or die("failed-execute");
		
		$result = $q->fetchAll(PDO::FETCH_COLUMN, 0);
		
		echo json_encode($result);
	}
	
	//Load data for Drugs - Resistant autocomplete
	if ($_GET['q'] == "drug_resistant") {
		$sql = "SELECT DISTINCT resistant FROM drugs WHERE resistant IS NOT NULL";
		
		$q = $conn -> prepare($sql);
		$q -> execute() or die("failed-execute");
		
		$result = $q->fetchAll(PDO::FETCH_COLUMN, 0);
		
		echo json_encode($result);
	}
}

?>