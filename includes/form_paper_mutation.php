<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>

<form>
	<input name="q" type="hidden" value="paper_mutation"/>
	<input name="paper_experiment_id" type="hidden" value=""/>
	<input name="paper_drug-gene_id" type="hidden" value=""/>
	<?php
		if (isset($_GET['region'])) {
			if ($_GET['region'] == "yes") {
				echo '<input name="paper_region_id" type="hidden" value=""/>';
			}
		}
	?>
	<label for="paper_mutation_isolates">Isolates</label>
	<input id="paper_mutation_isolates" name="paper_mutation_isolates" type="number" />
	<label for="paper_mutation_percent-isolates">Percent Isolates</label>
	<input id="paper_mutation_percent-isolates" name="paper_mutation_percent-isolates" type="number" />
	<fieldset>
		<legend>Amino Acid</legend>
		<label for="paper_mutation_aa-location">Location</label>
		<input id="paper_mutation_percent-aa-location" name="paper_mutation_percent-aa-location" type="number" />
		<select id="paper_mutation_aa-original" name="paper_mutation_aa-original" data-placeholder="Original Amino Acid...">
			<option value=""></option>
			<?php
				$sql = "SELECT * FROM amino_acids";
				$q = $conn -> prepare($sql);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['id'] . '">' . trim($x['name']) . ' (' . trim($x['three_letter']) . ')</option>' . "\n";
				}
			?>
		</select>
		<select id="paper_mutation_aa-substituted" name="paper_mutation_aa-substituted" data-placeholder="Substituted Amino Acid...">
			<option value=""></option>
			<?php
				$sql = "SELECT * FROM amino_acids";
				$q = $conn -> prepare($sql);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['id'] . '">' . trim($x['name']) . ' (' . trim($x['three_letter']) . ')</option>' . "\n";
				}
			?>
		</select>
		<label for="paper_mutation_codon-original">Codon - Original</label>
		<input id="paper_mutation_codon-original" name="paper_mutation_codon-original" type="text" />
		<label for="paper_mutation_codon-substituted">Codon - Substituted</label>
		<input id="paper_mutation_codon-substituted" name="paper_mutation_codon-substituted" type="text" />
	</fieldset>
	<fieldset>
		<legend>DNA - Nucleotide</legend>
		<label for="paper_mutation_nucleotide-location">Location</label>
		<input id="paper_mutation_nucleotide-location" name="paper_mutation_nucleotide-location" type="number" />
		<label for="paper_mutation_nucleotide-original">Original</label>
		<input id="paper_mutation_nucleotide-original" name="paper_mutation_nucleotide-original" type="text" />
		<label for="paper_mutation_nucleotide-substituted">Substituted</label>
		<input id="paper_mutation_nucleotide-substituted" name="paper_mutation_nucleotide-substituted" type="text" />
	</fieldset>
	<button type="submit">Submit</button>
	<button type="button" class="cancel_button">Cancel</button>
</form>