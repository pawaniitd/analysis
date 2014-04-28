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