<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	//$expt_id = $_GET['expt_id'];
	$gene_id = $_GET['gene_id'];
?>
<div class="select_fq_mutation indent">
	<form class="form_select_fq_mutation">
		<select class="select_mutation_aa chosen-300" name="select_mutation_aa" data-placeholder="Select Mutation - AA">
			<option value=""></option>
			<?php
				$sql = "SELECT DISTINCT aa_location, aa_original_id, aa_substituted_id, codon_original_id, codon_substituted_id FROM paper_mutations WHERE id IN (SELECT mutation_id FROM view_gid_paper_mutations WHERE gene_id=?) ORDER BY aa_location";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $gene_id);
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
					
					echo '<option value="' . $x['aa_location'] . ':' . $x['aa_original_id'] . ':' . $x['aa_substituted_id'] . '">' . $x['aa_location'] . ':' . $original . ' {' . $x['codon_original_id'] . '}->' . $substituted . ' {' . $x['codon_substituted_id'] . '}</option>' . "\n";
				}
			?>
		</select>
		
		<select class="select_mutation_dna chosen-300" name="select_mutation_dna" data-placeholder="Select Mutation - Nucleotide">
			<option value=""></option>
			<?php
				$sql = "SELECT DISTINCT nucleotide_location, nucleotide_original, nucleotide_substituted FROM paper_mutations WHERE id IN (SELECT mutation_id FROM view_gid_paper_mutations WHERE gene_id=?) ORDER BY nucleotide_location";
				$q = $conn -> prepare($sql);
				$q->bindParam(1, $gene_id);
				$q -> execute();
				
				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				foreach ($result as $x) {
					echo '<option value="' . $x['nucleotide_location'] . ':' . $x['nucleotide_original'] . ':' . $x['nucleotide_substituted'] . '">' . $x['nucleotide_location'] . ' : ' . $x['nucleotide_original'] . '->' . $x['nucleotide_substituted'] . '</option>' . "\n";
				}
			?>
		</select>
	</form>
	<div class="fq_mutation_details"></div>
	<button class="button_fq_mutation_details add_new">Add Details</button>
</div>