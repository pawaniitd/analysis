<form>
	<input name="q" type="hidden" value="paper_drug-gene"/>
	<input class="pmid" name="paper_drug-gene_pmid" type="hidden" value=""/>
	<select id="select_paper_drug-gene" name="paper_drug-gene_id" data-placeholder="Choose a Drug-Gene..." required>
		<?php
			$filename = '../files/drug-gene_options.html';
			if (file_exists($filename)) {
				include $filename;
			}
			else {
				include 'connectDB.inc';
				$conn = connectDB();
				
				$sql = "SELECT * FROM view_drug_gene";
				$q = $conn -> prepare($sql);
				$q -> execute() or die("failed-execute");

				$result = $q->fetchAll(PDO::FETCH_ASSOC);
				
				$data = '<option value=""></option>' . "\n";
				file_put_contents ($filename, $data, FILE_APPEND);
				
				foreach ($result as $x) {
					$data = '<option value="' . $x['id'] . '">' . trim($x['drug_name']) . ' and ' . trim($x['gene_name']) . '</option>' . "\n";
					
					file_put_contents ($filename, $data, FILE_APPEND);
				}
				
				include $filename;
			}
		?>
	</select>
	<label for="paper_drug-gene_isolates">Isolates</label>
	<input id="paper_drug-gene_isolates" name="paper_drug-gene_isolates" type="number" required/>
	<label for="paper_drug-gene_sus_conc">Susceptibility: Conc.</label>
	<input id="paper_drug-gene_sus_conc" name="paper_drug-gene_sus_conc" type="number" step="0.1"/>
	<label for="paper_drug-gene_sus_expt">Susceptibility: Expt(s)</label>
	<input id="paper_drug-gene_sus_expt" name="paper_drug-gene_sus_expt" type="text"/>
	<button type="submit">Submit</button>
	<button type="button" class="cancel_button">Cancel</button>
</form>