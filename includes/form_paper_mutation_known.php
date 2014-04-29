<?php
	
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$pmid = $_GET['pmid'];
	$expt_id = $_GET['expt_id'];
?>

<form class="form_paper_mutation_known">
	<input type="hidden" name="paper_experiment_id" value="<?php echo $_GET['expt_id']?>" />
	<select class="select_paper_drug-gene_id" name="paper_drug-gene_id" data-placeholder="Choose a Drug-Gene... " required>
		<option value=""></option>
		<?php
			try {
			$sql = "SELECT id, drug_name, gene_name, isolates FROM view_paper_drug_gene WHERE pmid=:pmid";
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
				echo '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . ' [' . $x['isolates'] . ']' . '</option>' . "\n";
			}
		?>
	</select>
</form>