
var pageNo = 0;
var start_page = 1;

//To assign a paper as relevant or non relevant (by sending data to modify.php to update the SQL tables)
function relevance (inp_type, obj) {

	var pmid = obj.parent().parent().parent().attr('id');

	$.ajax({
		url: "modify.php",
		data: {
			q: "relevance",
			type: inp_type,
			pageNo: pageNo,
			value: pmid
		},
		type: "GET",
		dataType: "text",
		success: function(data) {
			var text = "";
			if (inp_type == "yes") {
				text = "Relevant";
			}
			if (inp_type == "no") {
				text = "Not Relevant";
			}
			if (inp_type == "wrong_paper") {
				text = "Wrong Paper";
			}
			
			$("#" + pmid).find("div.buttons").html("<p>" + text + "</p>");
		},
		error: function(xhr, status, errorThrown) {
			alert(errorThrown);
		}
	});	//end ajax
}

//Function for initial relevant papers
function initial_relevance (inp_type) {

	var text = "Not Relevant";
	if (inp_type == "relevant") {
		text = "Relevant";
	}
	if (inp_type == "wrong_paper") {
		text = "Wrong Paper";
	}

	$.ajax({
		url: "modify.php",
		data: {
			q: "initial_relevance",
			value: inp_type
		},
		type: "GET",
		dataType: "json",
		success: function(data) {
			$.each( data, function( key, value ) {
				$("#" + value).find("div.buttons").html("<p>" + text + "</p>");
			});	//end each
		},
		error: function(xhr, status, errorThrown) {
			alert(errorThrown);
		}
	});	//end ajax
}

//Create list of options for select tag
function setOptions (data) {
	var txt = '<option value=""></option>';	//This is added for Chosen to work
	$.each( data, function( key, value ) {
		txt = txt + "<option value=\"" + key + "\">" + value + "</option>\n";
	});	//end each
	return txt;
}







//Set relevance data for read papers (done earlier)
$(document).ready(function () {
	initial_relevance ("relevant");
	initial_relevance ("non_relevant");
	initial_relevance ("wrong_paper");
});	//end ready

//This part looks for the page num to load at the start of web application and then loads JPages
$(document).ready(function () {
	$.ajax({
		async: false,
		url: "modify.php",
		data: {
			q: "pageNo"
		},
		type: "GET",
		dataType: "text",
		success: function(data) {
			start_page = start_page + parseInt(data);
			
			
		},
		error: function(xhr, status, errorThrown) {
			alert(errorThrown);
		}
	});	//end ajax
	
	//JPages Pagination of the list of papers obtained
	$("div.holder").jPages({
		containerID : "content",
		perPage : 1,
		startPage: start_page,
		previous : "div#left",
		next : "div#right",
		keyBrowse : true,
		midRange : 0,
		startRange : 0,
		endRange : 0,
		callback : function(pages, items) {
			$("#count").html(pages.current + " of " + pages.count);
			pageNo = pages.current;
			
			$.ajax({
				url: "includes/paper_mutation_reset.html",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#mutation_forms").hide("fade");
					$("#mutation_forms").html(data);
				},
				error: function(xhr, status, errorThrown) {
					alert(errorThrown);
				}
			});	//end ajax
			
		}
	});	//end jPages
});	//end ready

// Assign relevance using the function
$(document).ready(function () {
	$(".yes > button").click(function () {
		relevance("yes", $(this));
	});	//end click
	
	$(".no > button").click(function () {
		relevance("no", $(this));
		
		var pmid = $(this).parent().parent().parent().attr('id');
		
		$.ajax({
			url: "modify.php",
			data: {
				q: "delete",
				value: pmid
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				alert("Deleted");
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
		
	});	//end click
	
	$(".wrong_paper > button").click(function () {
		relevance("wrong_paper", $(this));
	});	//end click
});	//end ready

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Add gene
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Script to add gene to the database - JQuery UI Dialog Form
$(document).ready(function () {

	$( "#add_gene" ).dialog({
		autoOpen: false,
		height: 180,
		width: 250,
		modal: true,
		dialogClass: "no-close",
		buttons: {
			"Add": function() {
				$.ajax({
					url: "modify.php",
					data: $("#add_gene > form").serialize(),
					type: "GET",
					dataType: "text",
					success: function(data) {
						if (data == "Success") {
							$("#add_gene input:text").val('');
							$("#add_gene_button img").show("fade").delay(5000).hide("fade");	//To show tick mark for 5 sec upon success
						}
						else {
							alert(data);
						}
					},
					error: function(xhr, status, errorThrown) {
						alert(errorThrown);
					}
				});	//end ajax
				
				$("#add_gene > form").children("input:text").val('');

				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
    });
});	//end ready


// Add gene modal dialogue open
$(document).ready(function () {
	$( "#add_gene_button" ).click(function() {
		$( "#add_gene" ).dialog( "open" );
	});
});	//end ready
/*===========================================================================================================================================================*/

/*
 *	Feature - Add Drug	------------------------------------------------------------------------
 */
 
//Script to add drug to the database - JQuery UI Dialog Form
$(document).ready(function () {

	$( "#add_drug" ).dialog({
		autoOpen: false,
		height: 300,
		width: 250,
		modal: true,
		dialogClass: "no-close",
		buttons: {
			"Add": function() {
				$.ajax({
					url: "modify.php",
					data: $("#add_drug > form").serialize(),
					type: "GET",
					dataType: "text",
					success: function(data) {
						$("#add_drug input:text").val('');
						$("#add_drug_button img").show("fade").delay(5000).hide("fade");	//To show tick mark for 5 sec upon success
					},
					error: function(xhr, status, errorThrown) {
						alert(errorThrown);
					}
				});	//end ajax

				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
    });
});	//end ready

// Add drug modal dialogue open
$(document).ready(function () {
	$( "#add_drug_button" ).click(function() {
	
		//Set autocomplete for Category
		$( "#add_drug_category" ).autocomplete({
			source: "php/autocomplete_data.php?q=drug_category"
		});
		
		//Set autocomplete for Resistant type
		$( "#add_drug_resistant" ).autocomplete({
			source: "php/autocomplete_data.php?q=drug_resistant"
		});
		
		$( "#add_drug" ).dialog( "open" );
	});
});	//end ready
 
/*--------------------------------------------------------------------------------------------*/

/*	************************************
 *	Feature - Add Drug-Gene	
	************************************/
 
//Script to add drug-gene to the database - JQuery UI Dialog Form
$(document).ready(function () {

	$( "#add_drug-gene" ).dialog({
		autoOpen: false,
		height: 300,
		width: 300,
		modal: true,
		dialogClass: "no-close",
		buttons: {
			"Add": function() {
				$.ajax({
					url: "modify.php",
					data: $("#add_drug-gene > form").serialize(),
					type: "GET",
					dataType: "text",
					success: function(data) {
						$("#add_drug-gene_button img").show("fade").delay(5000).hide("fade");	//To show tick mark for 5 sec upon success
					},
					error: function(xhr, status, errorThrown) {
						alert(errorThrown);
					}
				});	//end ajax

				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
    });
});	//end ready

// Add drug-gene modal dialogue open
$(document).ready(function () {
	$( "#add_drug-gene_button" ).click(function() {
	
		$("#select_drug_name").val('').trigger("chosen:updated");
		$("#select_gene_name").val('').trigger("chosen:updated");
	
		//Load option list for Drug names
		$.ajax({
			url: "modify.php",
			data: {
				q: "select_drug"
			},
			type: "GET",
			dataType: "json",
			success: function(data) {
				var txt = setOptions(data);
				$("#select_drug_name").html(txt);
				$("#select_drug_name").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: "95%"
				});	
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
		
		//Load option list for Gene names
		$.ajax({
			url: "modify.php",
			data: {
				q: "select_gene"
			},
			type: "GET",
			dataType: "json",
			success: function(data) {
				var txt = setOptions(data);
				$("#select_gene_name").html(txt);
				$("#select_gene_name").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: "95%"
				});
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
		
		$( "#add_drug-gene" ).dialog( "open" );
		
	});
});	//end ready
 
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/


/* Tags -----------------------------------------------------------------------------------------------------------------------------------------------------
Add tags input and load tags (JQuery UI autocomplete) - using jQuery-Tags-Input (https://github.com/xoxco/jQuery-Tags-Input)*/

// Update the tags.json file on program load
$(document).ready(function () {
	$.ajax({
		url: "modify.php",
		data: {
			q: "tags"
		},
		type: "GET",
		dataType: "text",
		success: function(data) {
		},
		error: function(xhr, status, errorThrown) {
			alert(errorThrown);
		}
	});	//end ajax
	
});	//end ready

//Add tags to the database - Submit form via JQuery and not HTML
$(document).ready(function () {
	$(".tags").submit(function( event ) {
	
		$.ajax({
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "json",
			success: function(data) {
				$("div#" + data[0] + " .tags").html("<p style=\"font-size: 1.2em;\">Tags : " + data[1] + "</p>");
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
		
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/


$(document).ready(function () {
	$(".download a").click(function () {
		$pmid = $(this).parent().parent().parent().attr('id');
	
		//Tags
		$("div#" + $pmid + " .tags").show("fade");
		$("div#" + $pmid + " .tags .input_tags").tagsInput({
			autocomplete_url:'files/tags.json',
			height: '20px',
			width: '70%'
		});
		
		//Mutations forms
		$("#mutation_forms").show("fade");
		
		//Assign pmid to mutation forms
		$("#current_pmid").html($pmid);
		$("input.pmid").val($pmid);
	});	//end click
});	//end ready


/**************************************************************

	Script for the Mutations data collection forms
	
**************************************************************/

/* Paper Experiment -----------------------------------------------------------------------------------------------------------------------------------------*/

// Submit form
$(document).ready(function () {
	$(document).on("submit", "div#paper_experiment > form", function (event) {
		$.ajax({
			context: $(this),
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "json",
			success: function(data) {
				$(this).remove();
				$("div#paper_experiment").append(data[1]);	//Add the results to webpage
				
				$("div#paper_mutation > button").attr("data-paper_experiment", "yes");	//Confirm that experiment has been added
				$("#paper_mutation").attr("data-experiment_id", data[0]);	//Set the experiment id value for mutation forms to use
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready

/*===========================================================================================================================================================*/


/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Paper Region 
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Add new region button - to insert new form upon pressing the Add New button
$(document).ready(function () {
	$(document).on("click", "div#paper_region > button", function () {
		$.ajax({
			url: "includes/form_paper_region.html",
			type: "GET",
			dataType: "html",
			success: function(data) {
				$("div#paper_region > div.forms").append(data);	//add form
				
				$("input.pmid").val($("#current_pmid").html());	//assign pmid to input value
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end click
});	//end ready

// Delete form upon clicking the Cancel button 
$(document).ready(function () {
	$(document).on("click", "div#paper_region > div.forms .cancel_button" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		$(this).parent().remove();
	});	//end click
});	//end ready

// Submit the paper_region form
$(document).ready(function () {
	$(document).on("submit", "div#paper_region > div.forms form" , function (event) {
		$.ajax({
			context: $(this),
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "text",
			success: function(data) {
				$(this).html(data);
				$("div#paper_mutation > button").attr("data-paper_region", "yes");
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready

/*===========================================================================================================================================================*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Paper Drug-Gene
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Add new drug-gene button - to insert new form upon pressing the Add New button
$(document).ready(function () {
	$(document).on("click", "div#paper_drug-gene > button", function () {
		$.ajax({
			url: "includes/form_paper_drug-gene.php",
			type: "GET",
			dataType: "html",
			success: function(data) {
				$("div#paper_drug-gene > div.forms").append(data);
				
				//Activate chosen
				$("div#paper_drug-gene > div.forms select").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: '200px'
				});
				
				$("input.pmid").val($("#current_pmid").html());	//assign pmid to input value
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end click
});	//end ready

// Delete form upon clicking the Cancel button 
$(document).ready(function () {
	$(document).on("click", "div#paper_drug-gene > div.forms .cancel_button" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		$(this).parent().remove();
	});	//end click
});	//end ready

// Submit the paper_region form
$(document).ready(function () {
	$(document).on("submit", "div#paper_drug-gene > div.forms form" , function (event) {
		$.ajax({
			context: $(this),
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "text",
			success: function(data) {
				$(this).html(data);
				$("div#paper_mutation > button").attr("data-paper_drug-gene", "yes");
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready

/*===========================================================================================================================================================*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Paper Mutations 
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Add new button - to insert new mutation group upon pressing the Add New button
$(document).ready(function () {
	$(document).on("click", "div#paper_mutation > button", function () {
	
		var expt = $("div#paper_mutation > button").attr("data-paper_experiment");
		var reg = $("div#paper_mutation > button").attr("data-paper_region");
		var dg = $("div#paper_mutation > button").attr("data-paper_drug-gene");
		var id = $("#current_pmid").html();
		var exptID = $("div#paper_mutation").attr("data-experiment_id");
		
		if (expt == "yes") {
			if (dg == "yes") {
				$.ajax({
					url: "includes/form_paper_mutation_group.php",
					type: "GET",
					data: {
						pmid: id,
						expt_id: exptID,
						region: reg
					},
					dataType: "html",
					success: function(data) {
						var num = $("div#paper_mutation > div.forms div").length;
						num += 1;
						$("div#paper_mutation > div.forms").append('<div class="paper_mutation_group indent" id="paper_mutation_group_' + num + '"><h2>Mutation Group</h2></div>');
						
						$("#paper_mutation_group_" + num).append(data);
						//Activate chosen
						$(".form_paper_mutation_group select").chosen({	//Activate chosen on the select tag
							disable_search_threshold: 5,
							width: '200px'
						});
						
						
						$("#paper_mutation_group_" + num).append('<div></div>');
						
						$("#paper_mutation_group_" + num).append('<button type="button" class="add_mutation_button add_new">Add Mutation</button>');
					},
					error: function(xhr, status, errorThrown) {
						alert(errorThrown);
					}
				});	//end ajax
			}
			else {
				alert("Please add drug-gene data first");
			}
		}
		else {
			alert("Please add experiment data first");
		}
	});	//end click
});	//end ready

// Add mutation button - to insert new mutation formupon pressing the button
$(document).ready(function () {
	$(document).on("click", "div#paper_mutation > div.forms .add_mutation_button" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		var local = $(this).parent().attr('id');
		
		var array = $("#" + local + "> form").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		
		var check = true;
		
		if (dg_id) {
			if (array.length == 3) {	//If paper_region is added
				region_id = array[2].value;
				if (region_id) {
					check = true;
				}
				else {
					alert ("Select region");
				}
			}
			else {	//paper_region does not exist
				check = true;
			}
		}
		else {
			alert ("Select drug-gene");
			check = false;
		}
		
		if (check) {
			$.ajax({
				url: "includes/form_paper_mutation.php",
				context: $("#" + local + "> div"),
				data: {
					expt_id: expt_id,
					dg_id: dg_id,
					region_id: region_id
				},
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(this).append(data);
					
					//Activate chosen
					$(this).find("select").chosen({	//Activate chosen on the select tag
						disable_search_threshold: 5,
						width: '200px',
						inherit_select_classes: true
					});
				},
				error: function(xhr, status, errorThrown) {
					alert(errorThrown);
				}
			});	//end ajax
		}
	});	//end click
});	//end ready

// Delete form upon clicking the Cancel button 
$(document).ready(function () {
	$(document).on("click", "div#paper_mutation > div.forms .cancel_button" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		$(this).parent().remove();
	});	//end click
});	//end ready

/*===========================================================================================================================================================*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Mutation final form
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Check if the amino acid (original) selected actually exists at that location
$(document).ready(function () {
	var check = true;	//this check is to make sure that the alert is triggerred only upon manually changing option (not automatically)

	$(document).on("change", "select.paper_mutation_aa-original" , function () {
		var location = $(this).siblings("input.paper_mutation_aa-location").val();
		
		if (location) {	//check if location is set
			//main
			var aa = $(this).val();
			var pdgID = $(this).parent().siblings("input.paper_drug-gene_id").val();
			
			$.ajax({
				url: "modify.php",
				context: $(this),
				data: {
					q: "mutation_check_aa",
					location: location,
					pdg_id: pdgID,
					amino_acid: aa
				},
				type: "GET",
				dataType: "text",
				success: function(data) {
					if (data == "yes") {
						var txt = $(this).children("option:selected").text();
						$(this).siblings("div.paper_mutation_aa-original").empty();
						var out = '<span class="bold">Original: </span><span>' + txt + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">'
						$(this).siblings("div.paper_mutation_aa-original").html(out);
					}
					else {
						if (check) {
							alert("Amino Acid in that location did not match!");
						}
						check = false;
						$('select.paper_mutation_aa-original').val('').trigger('chosen:updated');
					}
				},
				error: function(xhr, status, errorThrown) {
					alert(errorThrown);
				}
			});	//end ajax
		}
		else {	//do this if location is not set
			if (check) {
				alert("Please enter the 'Amino Acid Location' first");
			}
			check = false;
			$('select.paper_mutation_aa-original').val('').trigger('chosen:updated');
		}
		check = true;
	});	//end click
});	//end ready


//Check if codon entered is correct codon for the amino acid entered
function check_codon (obj, select_class, type) {
	var aa = obj.siblings("select." + select_class).val();
	
	if (aa) {	//If amino acid is selected
		var codon = obj.val();
		$.ajax({
			url: "modify.php",
			context: obj,
			data: {
				q: "codon",
				codon: codon
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				if (aa == data) {
					obj.prop('readonly', true);
					obj.css({
						"background-image": "url('images/tick1.png')",
						"background-repeat": "no-repeat",
						"background-position": "left center",
						"padding-left": "11px"
					});
				}
				else {
					obj.val('');
					alert("Incorrect " + type + " Codon");
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});
	}
	else {
		alert("Select " + type + " amino acid!");
		obj.val('');
	}
}
$(document).ready(function () {
	$(document).on("change", "input.paper_mutation_codon-original" , function () {
		check_codon($(this), 'paper_mutation_aa-original', 'Original');
	});	//end click
	
	$(document).on("change", "input.paper_mutation_codon-substituted" , function () {
		check_codon($(this), 'paper_mutation_aa-substituted', 'Substituted');
	});	//end click
});	//end ready


// Submit the mutation form
$(document).ready(function () {
	$(document).on("submit", "div.paper_mutation_group form" , function (event) {
		$.ajax({
			context: $(this),
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "json",
			success: function(data) {
				if (data[0] == true) {
					var ori_aa = $(this).find('select.paper_mutation_aa-original option[value="' + data[8] + '"]').text();
					var sub_aa = $(this).find('select.paper_mutation_aa-original option[value="' + data[9] + '"]').text();
					
					var txt = "<div class=\"mut_data\">\n<h3>Isolates</h3>\n";
					txt += "<p>No. = " + data[4] + ", Percent = " + data[5] + ", MIC = " + data[6] + "</p>\n";
					txt += "<h3>Amino Acid</h3>\n";
					txt += "<p>Location = " + data[7] + ", Original = " + ori_aa + ", Substituted = " + sub_aa + "</p>\n";
					txt += "<h3>Codon</h3>\n";
					txt += "<p>Original = " + data[10] + ", Substituted = " + data[11] + "</p>\n";
					txt += "<h3>Nucleotide</h3>\n";
					txt += "<p>Location = " + data[12] + ", Original = " + data[13] + ", Substituted = " + data[14] + "</p>\n</div>\n";
					
					$(this).replaceWith(txt);
					
				}
				else {
					alert (data[1]);
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready
/*===========================================================================================================================================================*/