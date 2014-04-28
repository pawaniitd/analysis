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