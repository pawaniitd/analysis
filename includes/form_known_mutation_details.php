<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$pmid = $_GET['pmid'];
	$expt_id = $_GET['expt_id'];
	$pdg_id = $_GET['pdg_id'];
	$bool_region = $_GET['region'];
	
	$check_protein = true;
	$check_protein_val = "Y";
	
	//check if gene product is protein or RNA
	$sql = "SELECT type FROM view_gene_type_paper_drug_gene WHERE id=?";
	$q = $conn -> prepare($sql);
	$q->bindParam(1, $pdg_id);
	$q->execute();
	
	$rslt = $q->fetch(PDO::FETCH_ASSOC);
	
	if (trim($rslt['type']) == "RNA") {
		$check_protein = false;
		$check_protein_val = "N";
	}
?>
<form class="indent form_known_mutation_details">
		
	<input name="q" type="hidden" value="paper_mutation"/>
	<input class="paper_experiment_id" name="paper_experiment_id" type="hidden" value="<?php echo $expt_id ?>"/>
	<input class="paper_drug-gene_id" name="paper_drug-gene_id" type="hidden" value="<?php echo $pdg_id ?>"/>
	<input class="protein_check" name="protein_check" type="hidden" value="<?php echo $check_protein_val ?>"/>
	
	<label for="paper_mutation_isolates">Isolates</label>
	<input class="paper_mutation_isolates" name="paper_mutation_isolates" type="number" />
	<label for="paper_mutation_percent-isolates">Percent Isolates</label>
	<input class="paper_mutation_percent-isolates" name="paper_mutation_percent-isolates" type="number" />
	<label for="paper_mutation_mic">MIC</label>
	<input class="paper_mutation_mic" name="paper_mutation_mic" type="number" step="0.01"/>
	
	<?php
		if ($bool_region == "yes") {
			echo '<select class="paper_region_id chosen-200" name="paper_region_id" data-placeholder="Choose a Region..." required>' . "\n";
			echo '<option value=""></option>' . "\n";
			
			try {
			$sql = "SELECT id, city, state, country, isolates FROM paper_region WHERE pmid=:pmid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':pmid', $pmid);
			$q->execute();
			$result = $q->fetchAll(PDO::FETCH_ASSOC);
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			foreach ($result as $x) {
				$txt = '';
				if (!empty($x['city'])) {
					$txt .= trim($x['city']) . ', ';
				}
				if (!empty($x['state'])) {
					$txt .= trim($x['state']) . ', ';
				}
				if (!empty($x['country'])) {
					$txt .= trim($x['country']) . ', ';
				}
				echo '<option value="' . $x['id'] . '">' . $txt . ' [' . $x['isolates'] . ']' . '</option>' . "\n";
			}
			echo '</select>' . "\n";				
		}
	?>
	
	<input class="paper_mutation_aa-location" name="paper_mutation_aa-location" type="hidden" value="" />
	<input class="paper_mutation_aa-original" name="paper_mutation_aa-original" type="hidden" value="" />
	<input class="paper_mutation_aa-substituted" name="paper_mutation_aa-substituted" type="hidden" value="" />
	<input class="paper_mutation_codon-original" name="paper_mutation_codon-original" type="hidden" value="" />
	<input class="paper_mutation_codon-substituted" name="paper_mutation_codon-substituted" type="hidden" value="" />
	
	<input class="paper_mutation_nucleotide-location" name="paper_mutation_nucleotide-location" type="hidden" value="" />
	<input class="paper_mutation_nucleotide-original" name="paper_mutation_nucleotide-original" type="hidden" value="" />
	<input class="paper_mutation_nucleotide-substituted" name="paper_mutation_nucleotide-substituted" type="hidden" value="" />
	
	<button type="submit">Submit</button>
	<button type="button" class="cancel_button">Cancel</button>
</form>
