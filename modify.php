<?php
	
	error_reporting(0);

	$file_pageNo = "files/pageNo.txt";
	$file_tags = "files/tags.json";
	$file_drug_gene = "files/drug-gene_options.html";

	include 'includes/connectDB.inc';
				
	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				
				
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
			if ($_GET['type'] == "wrong_paper") {
				$table = "wrong_paper";
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
			$initial_num = file_get_contents($file_pageNo);
			$initial_num = intval($initial_num);
			
			if ($initial_num > 0) {
				if ($num > $initial_num) {
					file_put_contents($file_pageNo, $num);
				}
			}
			else {
				file_put_contents($file_pageNo, $num);
			}
		}
		
		
		//To add gene to database - By executing Perl script
		if ($_GET['q'] == "add_gene") {
			$name = $_GET['gene_name'];
			echo shell_exec("perl programs/Bioperl/getGene_genbank.pl $name");
		}
		
		//To add drug to database
		if ($_GET['q'] == "add_drug") {
			$name = $_GET['drug_name'];
			$category = $_GET['drug_category'];
			$resistant = $_GET['drug_resistant'];
			
			empty($category) ? null : $category;
			empty($resistant) ? null : $resistant;
			
			$sql = "INSERT INTO drugs (name, category, resistant) VALUES (:n, :c, :r)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':n', $name);
			$q->bindParam(':c', $category);
			$q->bindParam(':r', $resistant);
			$q->execute();
		}
		
		//Load options for selection of drugs
		if ($_GET['q'] == "select_drug") {
			$sql = "SELECT id, name FROM drugs";

			$q = $conn -> prepare($sql);
			$q -> execute() or die("failed-execute");

			$result = $q->fetchAll(PDO::FETCH_ASSOC);

			$arr = array();
			foreach ($result as $x) {
				$arr[$x['id']] = trim($x['name']);
			}

			echo json_encode($arr);
		}
		
		//Load options for selection of genes
		if ($_GET['q'] == "select_gene") {
			$sql = "SELECT id, name FROM h37rv_genes";

			$q = $conn -> prepare($sql);
			$q -> execute() or die("failed-execute");

			$result = $q->fetchAll(PDO::FETCH_ASSOC);

			$arr = array();
			foreach ($result as $x) {
				$arr[$x['id']] = trim($x['name']);
			}

			echo json_encode($arr);
		}
		
		//To get list of existing tags
		if ($_GET['q'] == "tags") {
			$table = 'tags';
			$sql = "SELECT DISTINCT tag FROM $table";
			
			try {
				$q = $conn -> prepare($sql);
				$q -> execute() or die("failed-execute");
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			$result = $q->fetchAll(PDO::FETCH_COLUMN, 0);
			
			file_put_contents($file_tags, json_encode($result));
		}
		
		//To add drug-gene to database
		if ($_GET['q'] == "add_drug-gene") {
			$drug_id = $_GET['drug_name'];
			$gene_id = $_GET['gene_name'];
			
			$sql = "INSERT INTO drug_gene (drug_id, gene_id) VALUES (:did, :gid)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':did', $drug_id);
			$q->bindParam(':gid', $gene_id);
			$q->execute();
			
			$sql = "SELECT id FROM drug_gene WHERE drug_id=:did and gene_id=:gid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':did', $drug_id);
			$q->bindParam(':gid', $gene_id);
			$q->execute();
			$result = $q->fetch(PDO::FETCH_ASSOC);
			$dg_id = $result['id'];
			
			$sql = "SELECT * FROM view_drug_gene WHERE id=:dgid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':dgid', $dg_id);
			$q->execute();
			$x = $q->fetch(PDO::FETCH_ASSOC);
			
			$data = '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . '</option>' . "\n";
			file_put_contents ($file_drug_gene, $data, FILE_APPEND);	//Update the file with drug-gene options
		}
		
		
		//To upload list of existing tags
		if ($_GET['q'] == "tags_upload") {
			$id = $_GET['pmid'];
			$tags_list = $_GET['tags'];
			$tags = explode(',', $tags_list);
			
			$sql = "INSERT INTO tags (tag, pmid) VALUES (:tag_text, :pmid_value)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':tag_text', $tag);
			$q->bindParam(':pmid_value', $id);
			
			foreach ($tags as $tag) {
				$q->execute();
			}
			
			
			$array = array($id, $tags_list);
			echo json_encode($array);
		}
		
		
	//*********************************************************************************************
	//
	//	Script for Mutations data collection forms
	//
	//*********************************************************************************************
		
		//Form - paper_experiment
		if ($_GET['q'] == "paper_experiment") {
			$pmid = $_GET['paper_experiment_pmid'];
			$isolates = $_GET['paper_experiment_isolates'];
			$experiment = $_GET['paper_experiment_experiment'];
			
			$sql = "INSERT INTO paper_experiment (pmid, isolates, experiment) VALUES (:pmid, :isolates, :expt)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':pmid', $pmid);
			$q->bindParam(':isolates', $isolates);
			$q->bindParam(':expt', $experiment);
			$q->execute();
			
			$sql = "SELECT id FROM paper_experiment WHERE pmid=:pmid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':pmid', $pmid);
			$q->execute();
			$result = $q->fetch(PDO::FETCH_ASSOC);
			$expt_id = $result['id'];
			
			$out_text = '<p><span class="bold">Isolates :</span> ' . $isolates . ' and <span class="bold">Experiment :</span> ' . $experiment . '</p>' . "\n";
			
			$arr = array($expt_id, $out_text);	//create array to encode in json
			echo json_encode($arr);
		}
		
		//Form - paper_region
		if ($_GET['q'] == "paper_region") {
			$pmid = $_GET['paper_region_pmid'];
			$city = $_GET['paper_region_city'];
			$state = $_GET['paper_region_state'];
			$country = $_GET['paper_region_country'];
			$isolates = $_GET['paper_region_isolates'];
			
			empty($city) ? null : $city;
			empty($state) ? null : $state;
			empty($country) ? null : $country;
			empty($isolates) ? null : $category;
			
			$sql = "INSERT INTO paper_region (pmid, city, state, country, isolates) VALUES (:p, :ci, :s, :co, :i)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':p', $pmid);
			$q->bindParam(':ci', $city);
			$q->bindParam(':s', $state);
			$q->bindParam(':co', $country);
			$q->bindParam(':i', $isolates);
			$q->execute();
			
			$out_text = '<p>';
			if (!is_null($city)) {
				$out_text .= '<span class="bold">City :</span> ' . $city . ', ';
			}
			if (!is_null($state)) {
				$out_text .= '<span class="bold">State :</span> ' . $state . ', ';
			}
			if (!is_null($country)) {
				$out_text .= '<span class="bold">Country :</span> ' . $country . ', ';
			}
			$out_text .= '<span class="bold">Isolates :</span> ' . $isolates;
			$out_text .= '</p>';
			
			echo $out_text;
		}
		
		//Form - paper_drug-gene
		if ($_GET['q'] == "paper_drug-gene") {
			echo "<p>Hello drug-gene</p>";
		}
		
	}
?>