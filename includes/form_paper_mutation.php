<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$expt_id = $_GET['expt_id'];
	$dg_id = $_GET['dg_id'];
	$region_id = $_GET['region_id'];
?>

<form class="indent block_input">
	<input name="q" type="hidden" value="paper_mutation"/>
	<input class="paper_experiment_id" name="paper_experiment_id" type="hidden" value="<?php echo $expt_id ?>"/>
	<input class="paper_drug-gene_id" name="paper_drug-gene_id" type="hidden" value="<?php echo $dg_id ?>"/>
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
		<select class="paper_mutation_aa-original" name="paper_mutation_aa-original" data-placeholder="Original Amino Acid...">
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
		<select class="paper_mutation_aa-substituted" name="paper_mutation_aa-substituted" data-placeholder="Substituted Amino Acid...">
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
		<select class="paper_mutation_nucleotide-original" name="paper_mutation_nucleotide-original" data-placeholder="Original Nucleotide...">
			<option value=""></option>
			<option value="A">A</option>
			<option value="C">C</option>
			<option value="G">G</option>
			<option value="T">T</option>
		</select>
		<select class="paper_mutation_nucleotide-substituted" name="paper_mutation_nucleotide-substituted" data-placeholder="Substituted Nucleotide...">
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