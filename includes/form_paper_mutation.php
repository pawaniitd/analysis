<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$expt_id = $_GET['expt_id'];
	$pdg_id = $_GET['dg_id'];
	$region_id = $_GET['region_id'];
?>

<form class="indent block_input">
	
	<div style="display: flex;">
		<select class="select_mutation_aa chosen-300" name="select_mutation_aa" data-placeholder="Select Mutation - AA">
			<option value=""></option>
			<?php
				$sql = "SELECT DISTINCT aa_location, aa_original_id, aa_substituted_id FROM paper_mutations WHERE id IN (SELECT mutation_id FROM view_dgid_paper_mutations WHERE drug_gene_id IN (SELECT drug_gene_id FROM paper_drug_gene WHERE id=?)) ORDER BY aa_location";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $pdg_id);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					$sql = "SELECT * FROM amino_acids WHERE id=?";
					$q = $conn -> prepare($sql);
					
					$q->bindParam(1, $x['aa_original_id']);
					$q->execute();
					$res = $q->fetch(PDO::FETCH_ASSOC);
					$original = trim($res['name']) . ' (' . trim($res['three_letter']) . ') [' . $res['id'] . ']';
					
					$q->bindParam(1, $x['aa_substituted_id']);
					$q->execute();
					$res = $q->fetch(PDO::FETCH_ASSOC);
					$substituted = trim($res['name']) . ' (' . trim($res['three_letter']) . ') [' . $res['id'] . ']';
					
					echo '<option value="' . $x['aa_location'] . ':' . $x['aa_original_id'] . ':' . $x['aa_substituted_id'] . '">' . $x['aa_location'] . ':' . $original . '->' . $substituted . '</option>' . "\n";
				}
			?>
		</select>
		
		<select class="select_mutation_dna chosen-300" name="select_mutation_dna" data-placeholder="Select Mutation - Nucleotide">
			<option value=""></option>
			<?php
				$sql = "SELECT DISTINCT nucleotide_location, nucleotide_original, nucleotide_substituted FROM paper_mutations WHERE id IN (SELECT mutation_id FROM view_dgid_paper_mutations WHERE drug_gene_id IN (SELECT drug_gene_id FROM paper_drug_gene WHERE id=?)) ORDER BY nucleotide_location";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $pdg_id);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['nucleotide_location'] . ':' . $x['nucleotide_original'] . ':' . $x['nucleotide_substituted'] . '">' . $x['nucleotide_location'] . ' : ' . $x['nucleotide_original'] . '->' . $x['nucleotide_substituted'] . '</option>' . "\n";
				}
			?>
		</select>		
	</div>
	
	<input name="q" type="hidden" value="paper_mutation"/>
	<input class="paper_experiment_id" name="paper_experiment_id" type="hidden" value="<?php echo $expt_id ?>"/>
	<input class="paper_drug-gene_id" name="paper_drug-gene_id" type="hidden" value="<?php echo $pdg_id ?>"/>
	<input class="paper_region_id" name="paper_region_id" type="hidden" value="<?php echo $region_id ?>"/>
	
	<fieldset>
		<legend>Isolates</legend>
		
		<label for="paper_mutation_isolates">Isolates</label>
		<input class="paper_mutation_isolates" name="paper_mutation_isolates" type="number" />
		<label for="paper_mutation_percent-isolates">Percent Isolates</label>
		<input class="paper_mutation_percent-isolates" name="paper_mutation_percent-isolates" type="number" />
		<label for="paper_mutation_mic">MIC</label>
		<input class="paper_mutation_mic" name="paper_mutation_mic" type="number" />
	</fieldset>
	<fieldset>
		<legend>Amino Acid</legend>
		<label for="paper_mutation_aa-location">Location</label>
		<input class="paper_mutation_aa-location" name="paper_mutation_aa-location" type="number" />
		<select class="paper_mutation_aa-original chosen-200" name="paper_mutation_aa-original" data-placeholder="Original Amino Acid...">
			<option value=""></option>
			<?php
				$sql = "SELECT * FROM amino_acids";
				$q = $conn -> prepare($sql);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['id'] . '">' . trim($x['name']) . ' (' . trim($x['three_letter']) . ') [' . $x['id'] . ']</option>' . "\n";
				}
			?>
		</select>
		<select class="paper_mutation_aa-substituted chosen-200" name="paper_mutation_aa-substituted" data-placeholder="Substituted Amino Acid...">
			<option value=""></option>
			<?php
				$sql = "SELECT * FROM amino_acids";
				$q = $conn -> prepare($sql);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['id'] . '">' . trim($x['name']) . ' (' . trim($x['three_letter']) . ') [' . $x['id'] . ']</option>' . "\n";
				}
			?>
		</select>
		<label for="paper_mutation_codon-original">Codon - Original</label>
		<input class="paper_mutation_codon-original" name="paper_mutation_codon-original" type="text" />
		<label for="paper_mutation_codon-substituted">Codon - Substituted</label>
		<input class="paper_mutation_codon-substituted" name="paper_mutation_codon-substituted" type="text" />
	</fieldset>
	<fieldset>
		<legend>DNA - Nucleotide</legend>
		<label for="paper_mutation_nucleotide-location">Location</label>
		<input class="paper_mutation_nucleotide-location" name="paper_mutation_nucleotide-location" type="number" />
		<select class="paper_mutation_nucleotide-original chosen-200" name="paper_mutation_nucleotide-original" data-placeholder="Original Nucleotide...">
			<option value=""></option>
			<option value="A">A</option>
			<option value="C">C</option>
			<option value="G">G</option>
			<option value="T">T</option>
		</select>
		<select class="paper_mutation_nucleotide-substituted chosen-200" name="paper_mutation_nucleotide-substituted" data-placeholder="Substituted Nucleotide...">
			<option value=""></option>
			<option value="A">A</option>
			<option value="C">C</option>
			<option value="G">G</option>
			<option value="T">T</option>
		</select>
	</fieldset>
	<button type="submit">Submit</button>
	<button type="button" class="cancel_button">Cancel</button>
</form>