<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$pmid = $_GET['pmid'];
	$expt_id = $_GET['expt_id'];
	$region_id = $_GET['region_id'];
	$gene_id = $_GET['gene_id'];
	
	$check_protein = true;
	$check_protein_val = "Y";
	
	//check if gene product is protein or RNA
	$sql = "SELECT type FROM h37rv_genes WHERE id=?";
	$q = $conn -> prepare($sql);
	$q->bindParam(1, $gene_id);
	$q->execute();
	
	$rslt = $q->fetch(PDO::FETCH_ASSOC);
	
	if (trim($rslt['type']) == "RNA") {
		$check_protein = false;
		$check_protein_val = "N";
	}
?>
<form class="indent form_injectable_mutation_details">
		
	<input name="q" type="hidden" value="paper_mutation"/>
	<input class="paper_experiment_id" name="paper_experiment_id" type="hidden" value="<?php echo $expt_id ?>"/>
	<input class="paper_region_id" name="paper_region_id" type="hidden" value="<?php echo $region_id ?>"/>
	<input class="protein_check" name="protein_check" type="hidden" value="<?php echo $check_protein_val ?>"/>
	
	<label for="paper_mutation_isolates">Isolates</label>
	<input class="paper_mutation_isolates" name="paper_mutation_isolates" type="number" />
	<label for="paper_mutation_percent-isolates">Percent Isolates</label>
	<input class="paper_mutation_percent-isolates" name="paper_mutation_percent-isolates" type="number" />
	<label for="paper_mutation_mic">MIC</label>
	<input class="paper_mutation_mic" name="paper_mutation_mic" type="number" step="0.01"/>
	
	<select class="paper_drug-gene_id chosen-200" name="paper_drug-gene_id" data-placeholder="Choose a Drug-Gene... " required>
		<option value=""></option>
		<?php
			try {
			$sql = "SELECT id, drug_name, gene_name, isolates FROM view_paper_drug_gene WHERE id IN (SELECT id FROM paper_drug_gene WHERE drug_gene_id IN (SELECT id FROM drug_gene WHERE gene_id=:gene)) AND pmid=:pmid";
			$q = $conn -> prepare($sql);
			$q->bindParam(':gene', $gene_id);
			$q->bindParam(':pmid', $pmid);
			$q->execute();
			$result = $q->fetchAll(PDO::FETCH_ASSOC);
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			foreach ($result as $x) {
				echo '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . ' [' . $x['isolates'] . ']' . '</option>' . "\n";
			}
		?>
	</select>
	
	
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
