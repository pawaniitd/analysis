<?php
	
	//error_reporting(0);

	include 'connectDB.inc';

	$conn = connectDB();
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$pmid = $_GET['pmid'];
	$expt_id = $_GET['expt_id'];
	$bool_region = $_GET['region'];
?>

<form class="form_paper_mutation_injectable">
	<input type="hidden" name="paper_experiment_id" value="<?php echo $_GET['expt_id']?>" />
	<select class="select_gene_id" name="paper_gene_id" data-placeholder="Choose a Gene... " required>
		<option value=""></option>
		<?php
			try {
			$sql = "SELECT id, name FROM h37rv_genes WHERE id IN (SELECT DISTINCT gene_id FROM drug_gene WHERE drug_id IN (SELECT id FROM drugs WHERE category='Injectable'))";
			$q = $conn -> prepare($sql);
			$q->execute();
			$result = $q->fetchAll(PDO::FETCH_ASSOC);
			}
			catch (PDOException $e) {
				//Do your error handling here
				echo $e->getMessage();
			}
			
			foreach ($result as $x) {
				echo '<option value="' . $x['id'] . '">' . trim($x['name']) . '</option>' . "\n";
			}
		?>
	</select>
	<!-- Region -->
	<?php
		if ($bool_region == "yes") {
			echo '<select class="paper_region_id chosen-200" name="paper_region_id" data-placeholder="Choose a Region..." required>' . "\n";
			echo '<option value=""></option>' . "\n";
			
			try {
			$sql = "SELECT id, city, state, country, isolates FROM paper_region WHERE pmid=:pmid";
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
				$txt = '';
				if (!empty($x['city'])) {
					$txt .= trim($x['city']) . ', ';
				}
				if (!empty($x['state'])) {
					$txt .= trim($x['state']) . ', ';
				}
				if (!empty($x['country'])) {
					$txt .= trim($x['country']) . ', ';
				}
				echo '<option value="' . $x['id'] . '">' . $txt . ' [' . $x['isolates'] . ']' . '</option>' . "\n";
			}
			echo '</select>' . "\n";				
		}
	?>
</form>