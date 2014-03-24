<!DOCTYPE html>

<html lang="en">

<head>
	
   	<meta charset="utf-8" />
    <title>Eumentis TB</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link rel="stylesheet" href="css/reset.css" type="text/css" media="screen, projection" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen, projection" />
	<link rel="stylesheet" href="css/jPages.css">
	
	<script src="scripts/jquery-1.10.2.min.js" type="text/javascript"> </script>
	<script src="scripts/script.js" type="text/javascript"> </script>
	<script src="scripts/jPages.js"></script>
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
					echo "\t\t\t</div>\n";	//end class=group
				}
			?>
		</div>
	</div>
</body>

</html>