		<select class="select_mutation_dna chosen-300" name="select_mutation_dna" data-placeholder="Select Mutation - Nucleotide">
			<option value=""></option>
			<?php
				$sql = "SELECT DISTINCT nucleotide_location, nucleotide_original, nucleotide_substituted FROM paper_mutations WHERE id IN (SELECT mutation_id FROM view_gid_paper_mutations WHERE gene_id IN (SELECT gene_id FROM drug_gene WHERE id IN (SELECT drug_gene_id FROM paper_drug_gene WHERE id=?))) ORDER BY nucleotide_location";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $pdg_id);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['nucleotide_location'] . ':' . $x['nucleotide_original'] . ':' . $x['nucleotide_substituted'] . '">' . $x['nucleotide_location'] . ' : ' . $x['nucleotide_original'] . '->' . $x['nucleotide_substituted'] . '</option>' . "\n";
				}
			?>
		</select>