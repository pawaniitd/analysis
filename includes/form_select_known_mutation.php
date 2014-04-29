<?php
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	//$expt_id = $_GET['expt_id'];
	$pdg_id = $_GET['pdg_id'];
?>
<div class="select_known_mutation indent">
	<form class="form_select_known_mutation">
		<?php
			include 'select_amino_acid_mutation.php';
			include 'select_nucleotide_mutation.php';
		?>
	</form>
	<div class="known_mutation_details"></div>
	<button class="button_known_mutation_details add_new">Add Details</button>
</div>