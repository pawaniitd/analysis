<?php
	
	error_reporting(0);

	include 'includes/connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if (isset($_GET['q'])) {
		//Form - paper_drug-gene
		if ($_GET['q'] == "paper_mutation_group") {
			/*
			$pmid = $_GET['pmid'];
			$bool_region = $_GET['region'];
			$expt_id = $_GET['expt_id'];
			
			$out = '<form class="form_paper_mutation_group">' . "\n";
			$out .= "\t" . '<input type="hidden" name="paper_mutation_experiment_id" value="$expt_id" />' . "\n";
			
			//paper_drug-gene
			$out .= "\t" . '<select id="select_paper_drug-gene_id" name="paper_drug-gene_id" data-placeholder="Choose a Drug-Gene...">' . "\n";
			$out .= "\t\t" . '<option value=""></option>' . "\n";
			
			$sql = "SELECT id, drug_name, drug_gene FROM view_paper_drug_gene WHERE pmid=:pmid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':pmid', $pmid);
			$result = $q->fetchAll(PDO::FETCH_ASSOC);
			
			foreach ($result as $x) {
				$out .= "\t\t" . '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . '</option>' . "\n";
			}
			$out .= "\t" . '</select>' . "\n";
			
			//paper_region
			if ($bool_region == "yes") {
				$out .= "\t" . '<select id="select_paper_region_id" name="paper_region_id" data-placeholder="Choose a Region...">' . "\n";
				$out .= "\t\t" . '<option value=""></option>' . "\n";
				
				$sql = "SELECT id, city, state, country FROM paper_region WHERE pmid=:pmid";
				$q = $conn -> prepare($sql);
				$q->bindParam(':pmid', $pmid);
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				
				foreach ($result as $x) {
					$out .= "\t\t" . '<option value="' . $x['id'] . '">' . trim($x['city']) . ', ' . trim($x['state']) . ', ' . trim($x['country']) . '</option>' . "\n";
				}
				$out .= "\t" . '</select>' . "\n";				
			}
			
			
			$out = '</form>' . "\n";
			*/
			$out = '<p>Mut grp</p>';
			
			echo $out;
		}
	}
?>