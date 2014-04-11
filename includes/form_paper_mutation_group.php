<?php
	
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$pmid = $_GET['pmid'];
	$bool_region = $_GET['region'];
	$expt_id = $_GET['expt_id'];
?>

<form class="form_paper_mutation_group">
	<input type="hidden" name="paper_experiment_id" value="<?php echo $_GET['expt_id']?>" />
	<select id="select_paper_drug-gene_id" name="paper_drug-gene_id" data-placeholder="Choose a Drug-Gene... " required>
		<option value=""></option>
		<?php
			try {
			$sql = "SELECT id, drug_name, gene_name FROM view_paper_drug_gene WHERE pmid=:pmid";
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
				echo '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . '</option>' . "\n";
			}
		?>
	</select>
	<?php
		if ($bool_region == "yes") {
			echo '<select id="select_paper_region_id" name="paper_region_id" data-placeholder="Choose a Region..." required>' . "\n";
			echo '<option value=""></option>' . "\n";
			
			try {
			$sql = "SELECT id, city, state, country FROM paper_region WHERE pmid=:pmid";
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
				echo '<option value="' . $x['id'] . '">' . trim($x['city']) . ', ' . trim($x['state']) . ', ' . trim($x['country']) . '</option>' . "\n";
			}
			echo '</select>' . "\n";				
		}
	?>
</form>