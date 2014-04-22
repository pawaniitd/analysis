<?php
	
	//error_reporting(0);

	$file_pageNo = "files/pageNo.txt";
	$file_tags = "files/tags.json";
	$file_drug_gene = "files/drug-gene_options.html";

	include 'includes/connectDB.inc';
				
	$conn = connectDB();
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	
	
	//////FUNCTION////////////////
	//to get amino acid from codon
	function codonTOaa ($conn, $codon){
		$sql = "SELECT amino_acid_id FROM codons WHERE seq=:codon";
		$q = $conn -> prepare($sql);
		$q->bindParam(':codon', $codon);
		$q->execute();
		
		$result = $q->fetch(PDO::FETCH_ASSOC);
		
		return $result['amino_acid_id'];
	}
	///////////////////////////////		



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
			empty($isolates) ? null : $isolates;
			
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
			$pmid = $_GET['paper_drug-gene_pmid'];
			$drug_gene_id = $_GET['paper_drug-gene_id'];
			$isolates = $_GET['paper_drug-gene_isolates'];
			
			try {
			$sql = "INSERT INTO paper_drug_gene (pmid, drug_gene_id, isolates) VALUES (:p, :dg, :i)";
			$q = $conn -> prepare($sql);
			$q->bindParam(':p', $pmid);
			$q->bindParam(':dg', $drug_gene_id);
			$q->bindParam(':i', $isolates);
			$q->execute();
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			$out_text = '<p><span class="bold">Id :</span> ' . $drug_gene_id . ' and <span class="bold">Isolates :</span> ' . $isolates . '</p>';
			echo $out_text;
		}
		
		
		//Check if Amino Acid is present at given location
		if ($_GET['q'] == "mutation_check_aa") {
			$location = $_GET['location'];
			$pdg_id = $_GET['pdg_id'];
			$amino_acid = $_GET['amino_acid'];
			
			try {
				$sql = "SELECT protein_seq FROM h37rv_genes WHERE name IN (SELECT gene_name FROM view_paper_drug_gene WHERE id=:id)";
				$q = $conn -> prepare($sql);
				$q->bindParam(':id', $pdg_id);
				$q->execute();
				
				$result = $q->fetch(PDO::FETCH_ASSOC);
				
				$seq = $result['protein_seq'];
				
				$aa = substr($seq, ($location-1), 1);
				
				if ($amino_acid == $aa) {
					echo "yes";
				}
				else {
					echo "no";
				}
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
		}
		
		
		//Get amino acid from codon
		if ($_GET['q'] == "codon") {
			$codon = $_GET['codon'];
			echo codonTOaa ($conn, $codon);
		}
		
		
		//Individual mutation form processing 
		if ($_GET['q'] == "paper_mutation") {
		
			$check = true;
			$error = "";
			
			$expt_id = $_GET['paper_experiment_id'];	//Required
			$pdg_id = $_GET['paper_drug-gene_id'];	//Required
			$region_id = $_GET['paper_region_id'];
			
			$isolates = $_GET['paper_mutation_isolates'];
			$per_isolates = $_GET['paper_mutation_percent-isolates'];
			$mic = $_GET['paper_mutation_mic'];
			
			$aa_location = $_GET['paper_mutation_aa-location'];	
			$aa_original = $_GET['paper_mutation_aa-original'];
			$aa_substituted = $_GET['paper_mutation_aa-substituted'];
			
			$codon_original = $_GET['paper_mutation_codon-original'];
			$codon_substituted= $_GET['paper_mutation_codon-substituted'];
			
			$dna_location = $_GET['paper_mutation_nucleotide-location'];
			$dna_original = $_GET['paper_mutation_nucleotide-original'];
			$dna_substituted = $_GET['paper_mutation_nucleotide-substituted'];
			
			if (empty($expt_id)) {
				die("Experiment ID not filled");
			}
			
			if (empty($pdg_id)) {
				die("Paper Drug-Gene ID not filled");
			}
			
			//From valitation
			if (!empty($per_isolates) || !empty($isolates)) {
			
				//check isolates and percent isolates
				$sql = "SELECT isolates FROM paper_drug_gene WHERE id=:pdg";
				$q = $conn -> prepare($sql);
				$q->bindParam(':pdg', $pdg_id);
				$q->execute();
				$result = $q->fetch(PDO::FETCH_ASSOC);
				
				$tot_isolates = $result['isolates'];
				if (empty($isolates) && !empty($per_isolates)) {
					$isolates = round(($per_isolates*$tot_isolates)/100);	//VALUE
				}
				if (!empty($isolates) && empty($per_isolates)) {
					$per_isolates = round(($isolates*100)/$tot_isolates);	//VALUE
				}
				
				//amino acid deatials are entered
				if (!empty($aa_location) && empty($dna_location)) {
				
					//if original codon is not entered
					if (empty($codon_original)) {
						
						$dna_location = 3*($aa_location - 1);
	
						$sql = "SELECT seq FROM h37rv_genes WHERE name IN (SELECT gene_name FROM view_paper_drug_gene WHERE id=:id)";
						$q = $conn -> prepare($sql);
						$q->bindParam(':id', $pdg_id);
						$q->execute();
						
						$result = $q->fetch(PDO::FETCH_ASSOC);
						
						$seq = $result['seq'];
						
						$codon = substr($seq, $dna_location, 3);
						
						if ($aa_original == (codonTOaa ($conn, $codon))) {
							$codon_original = $codon;	//VALUE
						}
						else {
							$check = false;
							$error = "Incorrect codon for Original Amino Acid";
						}
						
					}
					
					//if substituted codon is not entered
					//	--> It will get the list of all codons for the amino acids and compare them to the original codon and look for single mutations
					if (empty($codon_substituted)) {
						$sql = "SELECT seq FROM codons WHERE amino_acid_id=:id";
						$q = $conn -> prepare($sql);
						$q->bindParam(':id', $aa_substituted);
						$q->execute();
		
						$result = $q->fetchAll(PDO::FETCH_ASSOC);
						
						$compare = false;
						
						foreach ($result as $x) {
							$y = $x['seq'];
							$count = 0;
							for($i=0;$i<strlen($codon_original);$i++) { 
								if ($codon_original[$i] == $y[$i]) {
									$count += 1;
								}
							}
							if ($count == 2) {
								$codon_substituted = $y;	//VALUE
								$compare = true;
								break;
							}
						}
						
						if(!$compare) {	//checks if codon_substituted with single mutation wrt original codon exists
							$check = false;
							$error = "Original codon and final codon do not have single mutation.";
						}
					}
					
					//Nucleotide
					if ($check) {
						for($i=0;$i<strlen($codon_original);$i++) {
							if ($codon_original[$i] != $codon_substituted[$i]) {
								$dna_location = ((($aa_location - 1)*3) + 1) + $i;	//VALUE
								$dna_original = $codon_original[$i];	//VALUE
								$dna_substituted = $codon_substituted[$i];	//VALUE
							}
						}
					}
				}
				
				// Only Nucleotide details are entered
				elseif (empty($aa_location) && !empty($dna_location)) {
				
					$within_codon = $dna_location % 3;
					if ($within_codon == 0) {
						$within_codon = 3;
					}
					$aa_loc = (($dna_location - $within_codon)/3) + 1;
					$codon_loc = ($dna_location - $within_codon) + 1;
					
					$sql = "SELECT seq, protein_seq FROM h37rv_genes WHERE name IN (SELECT gene_name FROM view_paper_drug_gene WHERE id=:id)";
					$q = $conn -> prepare($sql);
					$q->bindParam(':id', $pdg_id);
					$q->execute();
					
					$result = $q->fetch(PDO::FETCH_ASSOC);
		
					$seq = $result['seq'];
					$protein_seq = $result['protein_seq'];
					
					if ($seq[($dna_location-1)] == $dna_original) {
					
						$codon = substr($seq, ($codon_loc - 1), 3);
						$aa = $protein_seq[($aa_loc - 1)];
						
						if ($aa == (codonTOaa ($conn, $codon))) {
							$aa_location = $aa_loc;	//VALUE
							$aa_original = $aa;	//VALUE
							$codon_original = $codon;	//VALUE
							
							if (!empty ($dna_substituted)) {
							
								if ($dna_original == $dna_substituted) {
									$check = false;
									$error = "Same original and substituted nucleotides";
								}
							
								$codon_substituted = substr_replace($codon_original, $dna_substituted, ($within_codon - 1), 1);	//VALUE
								$aa_substituted = codonTOaa ($conn, $codon_substituted);	//VALUE
							}
							else {
								$check = false;
								$error = "Fill Substituted nucleotide";
							}
						}
						else {
							$check = false;
							$error = "Codon and Amino acid (Origional) do not match";
						}
					}
					else {
						$check = false;
						$error = "Incorrect nucleotide at the given location.";
					}
				}
				
				// Neither Nucleotide or AA details are entered
				elseif (empty($aa_location) && empty($dna_location)) {
					$check = false;
					$error = "Enter either Amino Acid details or Nucleotide details";
				}
			}
			//neither isolates or %isolates entered
			else {
				$check = false;
				$error = "Enter either Isolates or Percent Isolates";
			}
			
			if ($check) {
			
				if (empty($region_id)) {
					$region_id = null;
				}
				
				if (empty($mic)) {
					$mic = null;
				}
				
			
				$sql = "INSERT INTO paper_mutations (paper_experiment_id, paper_drug_gene_id, paper_region_id, isolates, percent_isolates, mic, aa_location, aa_original_id, aa_substituted_id, codon_original_id, codon_substituted_id, nucleotide_location, nucleotide_original, nucleotide_substituted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $expt_id);
				$q->bindParam(2, $pdg_id);
				$q->bindParam(3, $region_id);
				$q->bindParam(4, $isolates);
				$q->bindParam(5, $per_isolates);
				$q->bindParam(6, $mic);
				$q->bindParam(7, $aa_location);
				$q->bindParam(8, $aa_original);
				$q->bindParam(9, $aa_substituted);
				$q->bindParam(10, $codon_original);
				$q->bindParam(11, $codon_substituted);
				$q->bindParam(12, $dna_location);
				$q->bindParam(13, $dna_original);
				$q->bindParam(14, $dna_substituted);
				$q->execute();
			
				
				$array = array(true, $expt_id, $pdg_id, $region_id, $isolates, $per_isolates, $mic, $aa_location, $aa_original, $aa_substituted, $codon_original, $codon_substituted, $dna_location, $dna_original, $dna_substituted);
				
				echo json_encode($array);
			}
			else {
				$array = array(false, $error);
				echo json_encode($array);
			}
		}
		
		
		//Delete all paper information
		if ($_GET['q'] == "delete") {
			$pmid = $_GET['value'];
			$expt = '';
			
			$sql = "SELECT id FROM paper_experiment WHERE pmid=?";
			$q = $conn -> prepare($sql);
			$q->bindParam(1, $pmid);
			$q->execute();
			$result = $q->fetch(PDO::FETCH_ASSOC);
			
			if (($q->rowCount() > 0) || empty($result)) {
				$expt = null;
			}
			else {
				$expt = $result['id'];
			}
			
			
			$sql = "DELETE FROM paper_experiment WHERE pmid=?";
			$q = $conn -> prepare($sql);
			$q->bindParam(1, $pmid);
			$q->execute();
			$expt_count = $q->rowCount();
			
			$sql = "DELETE FROM paper_region WHERE pmid=?";
			$q = $conn -> prepare($sql);
			$q->bindParam(1, $pmid);
			$q->execute();
			$region_count = $q->rowCount();
			
			$sql = "DELETE FROM paper_drug_gene WHERE pmid=?";
			$q = $conn -> prepare($sql);
			$q->bindParam(1, $pmid);
			$q->execute();
			$dg_count = $q->rowCount();
			
			if (!empty($expt)) {
				$sql = "DELETE FROM paper_mutations WHERE paper_experiment_id=?";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $expt);
				$q->execute();
				$emut_count = $q->rowCount();
			}
		}
	}
?>