<!DOCTYPE html>

<html lang="en">

<head>
	
   	<meta charset="utf-8" />
    <title>Eumentis TB</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link rel="stylesheet" href="css/reset.css" type="text/css" media="screen, projection" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen, projection" />
	
	<link rel="stylesheet" href="css/jPages.css">
	<link rel="stylesheet" type="text/css" href="css/jquery.tagsinput.css" />
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="css/chosen.min.css" />
	
	<!--[if gte IE 9]>
		<style type="text/css">
			.gradient {
				filter: none;
			}
		</style>
	<![endif]-->
	
	<script src="scripts/jquery-1.10.2.min.js" type="text/javascript"> </script>
	<script src="scripts/jquery-ui.js" type="text/javascript"></script>
	<script src="scripts/jPages.js" type="text/javascript"></script>
	<script src="scripts/jquery.tagsinput.js" type="text/javascript"></script>
	<script src="scripts/chosen.jquery.min.js" type="text/javascript"></script>
	
	<script src="scripts/script.js" type="text/javascript"> </script>
</head>
    
<body>
	<div id="main">
		<div id="left">
			<a href="#" style="display: block;"><img src="files/left1.png" alt="Left" height="60" width="100"></a>
		</div>
		
		<div id="count"></div>
			
		<div id="right">
			<a href="#" style="display: block;"><img src="files/right1.png" alt="Right" height="60" width="100"></a>
		</div>
		<div class="holder"></div>
		<div id="content">
			<?php
				include 'includes/connectDB.inc';
				
				$conn = connectDB();
				
				$id = "";
				
				$sql = "SELECT * FROM metadata WHERE pmid IN (SELECT * FROM working)";
				$q = $conn -> query($sql) or die("failed");
				while($r = $q->fetch(PDO::FETCH_ASSOC)){
					echo "\t\t\t<div id=\"" . $r['pmid'] . "\" class=\"group\">\n";
						echo "\t\t\t\t<div class=\"paper\">\n";
							echo "\t\t\t\t\t<div class=\"metadata\">\n";
								
								echo "\t\t\t\t\t\t<h2 class=\"title\">" . $r['title'] . "</h2>\n";
								echo "\t\t\t\t\t\t<div class=\"pubmed_id\">" . $r['pmid'] . "</div>\n";
								echo "\t\t\t\t\t\t<div class=\"year\">" . $r['pub_year'] . "</div>\n";
								echo "\t\t\t\t\t\t<div class=\"authors\">" . $r['authors'] . "</div>\n";
								echo "\t\t\t\t\t\t<div class=\"journal\">" . $r['journal'] . "</div>\n";
								echo "\t\t\t\t\t\t<div class=\"abstract\">" . $r['abstract'] . "</div>\n";
							echo "\t\t\t\t\t</div>";	//end class==metadata
							
							echo "\t\t\t\t\t<div class=\"download\">\n";	//start class=download
								echo "\t\t\t\t\t\t<a href=\"../analysis_files/PDF/" . $r['pmid'] . ".pdf\" target=\"_blank\">Download</a>\n";
							echo "\t\t\t\t\t</div>\n";	//end class=download
						echo "\t\t\t\t</div>\n";	//end class=paper
						
						echo "\t\t\t\t<div class=\"buttons\">\n";
							echo "\t\t\t\t\t<div class=\"yes\"><button class=\"green_button\">Relevant</button></div>\n";
							echo "\t\t\t\t\t<div class=\"no\"><button class=\"red_button\">Non-Relevant</button></div>\n";
							echo "\t\t\t\t\t<div class=\"wrong_paper\"><button class=\"red_button\">Wrong Paper</button></div>\n";
						echo "\t\t\t\t</div>\n";	//end class=buttons
						
						echo "\t\t\t\t<div class=\"ribbon gradient\"></div>\n";
						
						include 'includes/form_tags.html';
						
					echo "\t\t\t</div>\n";	//end class=group
				}
			?>
		</div>
		
		<div id="add_buttons">
			<div id="add_gene_button">
				<a href="#">Add Gene</a>
				<img src="files/tick1.png" alt="Left" height="8" width="10" style="display: none;">
			</div>
			<div id="add_drug_button">
				<a href="#">Add Drug</a>
				<img src="files/tick1.png" alt="Left" height="8" width="10" style="display: none;">
			</div>
			<div id="add_drug-gene_button">
				<a href="#">Add Drug-Gene</a>
				<img src="files/tick1.png" alt="Left" height="8" width="10" style="display: none;">
			</div>
		</div>
		
		<div id="add_gene" title="Add new gene to database">
			<form>
				<fieldset>
					<input type="hidden" name="q" value="add_gene" />
					<label for="inp_add_gene">Name : </label>
					<input id="inp_add_gene" type="text" name="gene_name" />
				</fieldset>
			</form>
		</div>
		
		<div id="add_drug" title="Add new drug to database">
			<form>
				<fieldset>
					<input type="hidden" name="q" value="add_drug" />
					<label for="add_drug_name">Name : </label>
					<input id="add_drug_name" type="text" name="drug_name" />
					<br />
					<br />
					<label for="add_drug_category">Category : </label>
					<input id="add_drug_category" type="text" name="drug_category" />
					<br />
					<br />
					<label for="add_drug_resistant">Resistant Type : </label>
					<input id="add_drug_resistant" type="text" name="drug_resistant" />
				</fieldset>	
			</form>
		</div>
		
		<div id="add_drug-gene" title="Add new drug-gene to database">
			<form>
				<fieldset>
					<input type="hidden" name="q" value="add_drug-gene" />
					<select id="select_drug_name" name="drug_name" data-placeholder="Choose a Drug...">
						
					</select>
					<br />
					<br />
					<select id="select_gene_name" name="gene_name" data-placeholder="Choose a Gene...">
						
					</select>
				</fieldset>	
			</form>
		</div>
		
		
		
	</div>
</body>

</html>