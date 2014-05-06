
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

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Relevance
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Set relevance data for read papers (done earlier)
$(document).ready(function () {
	initial_relevance ("relevant");
	initial_relevance ("non_relevant");
	initial_relevance ("wrong_paper");
});	//end ready


// Assign relevance using the function
$(document).ready(function () {
	//relevant
	$(".yes > button").click(function () {
		relevance("yes", $(this));
	});	//end click
	
	//not relevant
	$(".no > button").click(function () {
		relevance("no", $(this));
		
		var pmid = $(this).parent().parent().parent().attr('id');
	/*FUTURE DEBUG
		$(this).parent().parent().siblings("div.paper").children("div.download").hide("fade");	//hide the download pdf link
		$(this).parent().parent().siblings("form.tags").hide("fade");	//hide the tags input field
		$("div#mutation_forms").hide("fade");	//hide all mutation forms
	*/
		
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
	
	//wrong paper
	$(".wrong_paper > button").click(function () {
		relevance("wrong_paper", $(this));
	});	//end click
});	//end ready
/*===========================================================================================================================================================*/

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
			
				$("#circularG").show("fade");	//Start the processing animation
				
				$.ajax({
					url: "modify.php",
					data: $("#add_gene > form").serialize(),
					type: "GET",
					dataType: "text",
					success: function(data) {
						if (data == "Success") {
							$("#add_gene input:text").val('');
							$("#circularG").hide("fade");	//To stop the processing animation
							$("#add_gene_button img").show("fade").delay(5000).hide("fade");	//To show tick mark for 5 sec upon success
						}
						else {
							alert(data);
							$("#circularG").hide("fade");	//To stop the processing animation
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

/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Drug
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 
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
/*===========================================================================================================================================================*/
 
/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Drug-Gene
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 
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
						if (data = "Success") {
							$("#add_drug-gene_button img").show("fade").delay(5000).hide("fade");	//To show tick mark for 5 sec upon success
						}
						else {
							alert("Drug-Gene already exists");
						}
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
/*===========================================================================================================================================================*/

/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Tags - Add tags input and load tags (JQuery UI autocomplete) - using jQuery-Tags-Input (https://github.com/xoxco/jQuery-Tags-Input)
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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
/*===========================================================================================================================================================*/

/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Pdf download button
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function () {
	$(".download a").click(function () {
		$pmid = $(this).parent().parent().parent().attr('id');
		
		//FUTURE DEBUG $pmid = $(this).parent().parent().hide("fade");	//hide paper details for filling the forms
	
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
/*===========================================================================================================================================================*/

/**************************************************************

	Script for the Mutations data collection forms
	
**************************************************************/

/*------------------------------------------------------------------------------------------------------------------------------------------------------------- 	Paper Experiment
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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

// Remove experiment details and refresh form
$(document).ready(function () {
	$(document).on("click", "p.experiment_info > button", function (event) {
		
		var id = $("#current_pmid").html();
	
		$.ajax({
			context: $(this).parent(),
			url: "modify.php",
			data: {
				q: "delete_experiment",
				pmid: id
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				if (data > 0) {
					$(this).load("includes/paper_mutation_reset.html #paper_experiment>form", function() {
						$(this).children("form").unwrap();
						$("#paper_experiment input.pmid").val(id);
					});
				}
				else {
					alert("Could not delete experiment");
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
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

// Remove added region
$(document).ready(function () {
	$(document).on("click", "p.region_info > button", function (event) {
		
		var id = $("#current_pmid").html();
		var city = $(this).siblings("span.region_city").html();
		var state = $(this).siblings("span.region_state").html();
		var country = $(this).siblings("span.region_country").html();
		var isolates = $(this).siblings("span.region_isolates").html();
	
		$.ajax({
			context: $(this).parent().parent(),
			url: "modify.php",
			data: {
				q: "delete_region",
				pmid: id,
				city: city,
				state: state,
				country: country,
				isolates: isolates
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				if (data > 0) {
					$(this).remove();
				}
				else {
					alert("Could not delete region");
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
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

// Submit the paper_drug-gene form
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

// Remove added paper drug-gene
$(document).ready(function () {
	$(document).on("click", "p.pdg_info > button", function (event) {
		
		var id = $("#current_pmid").html();
		var dg_id = $(this).siblings("span.pdg_dgid").html();
		var isolates = $(this).siblings("span.pdg_isolates").html();
	
		$.ajax({
			context: $(this).parent().parent(),
			url: "modify.php",
			data: {
				q: "delete_drug-gene",
				pmid: id,
				dgid: dg_id,
				isolates: isolates
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				if (data > 0) {
					$(this).remove();
				}
				else {
					alert("Could not delete paper drug-gene");
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready
/*===========================================================================================================================================================*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
	Paper Mutations 
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Modal - Choose mutation group or known mutation
$(document).ready(function () {

	$( "#mutation_group_choice" ).dialog({
		autoOpen: false,
		height: 100,
		width: 400,
		modal: true,
		dialogClass: "no-close",
		buttons: {
			"Mutation Group": function() {
				$.ajax({
					url: "includes/form_paper_mutation_group.php",
					type: "GET",
					data: {
						pmid: $("#current_pmid").html(),
						expt_id: $("div#paper_mutation").attr("data-experiment_id"),
						region: $("div#paper_mutation > button").attr("data-paper_region")
					},
					dataType: "html",
					success: function(data) {
						var num = $("div#paper_mutation div.paper_mutation_group").length;
						num += 1;
						$("div#paper_mutation > div.forms").append('<div class="paper_mutation_group indent" id="paper_mutation_group_' + num + '"><h2>Mutation Group</h2></div>');
						
						$("#paper_mutation_group_" + num).append('<button type="button" class="minimize_mut_group"><img src="images/minimize-16.png"></button>');
						$("#paper_mutation_group_" + num).append(data);
						
						//Activate chosen
						$("#paper_mutation_group_" + num + " form.form_paper_mutation_group select").chosen({	//Activate chosen on the select tag
							disable_search_threshold: 5,
							width: '250px'
						});
						
						
						$("#paper_mutation_group_" + num).append('<div></div>');
						
						$("#paper_mutation_group_" + num).append('<button type="button" class="add_mutation_button add_new">Add Mutation</button>');
						$("#paper_mutation_group_" + num).append('<button type="button" class="close_mut_group add_new">Close Group</button>');
					},
					error: function(xhr, status, errorThrown) {
						alert(errorThrown);
					}
				});	//end ajax

				$( this ).dialog( "close" );
			},
			"Known Mutations": function() {
				$.ajax({
					url: "includes/form_paper_mutation_known.php",
					type: "GET",
					data: {
						pmid: $("#current_pmid").html(),
						expt_id: $("div#paper_mutation").attr("data-experiment_id")
					},
					dataType: "html",
					success: function(data) {
						var num = $("div#paper_mutation div.paper_mutation_known").length;
						num += 1;
						$("div#paper_mutation > div.forms").append('<div class="paper_mutation_known indent" id="paper_mutation_known_' + num + '"><h2>Mutation Known</h2></div>');
						
						$("#paper_mutation_known_" + num).append('<button type="button" class="minimize_mut_group"><img src="images/minimize-16.png"></button>');
						$("#paper_mutation_known_" + num).append(data);
						
						//Activate chosen
						$("#paper_mutation_known_" + num + " form.form_paper_mutation_known select").chosen({	//Activate chosen on the select tag
							disable_search_threshold: 5,
							width: '250px'
						});
						
						
						$("#paper_mutation_known_" + num).append('<div class="known_mut_holder"></div>');
						
						$("#paper_mutation_known_" + num).append('<button type="button" class="button_add_known_mutation add_new">Add Known Mutation</button>');
						$("#paper_mutation_known_" + num).append('<button type="button" class="close_mut_group add_new">Close Group</button>');
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

// Add new mutation group button - to insert new mutation group upon pressing the Add New button
$(document).ready(function () {
	$(document).on("click", "div#paper_mutation > button", function () {
	
		var expt = $("div#paper_mutation > button").attr("data-paper_experiment");
		var reg = $("div#paper_mutation > button").attr("data-paper_region");
		var dg = $("div#paper_mutation > button").attr("data-paper_drug-gene");
		var id = $("#current_pmid").html();
		var exptID = $("div#paper_mutation").attr("data-experiment_id");
		
		if (expt == "yes") {
			if (dg == "yes") {
				$( "#mutation_group_choice" ).dialog( "open" );
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

// Minimize mutation group upon pressing the minimize button
$(document).ready(function () {
	$(document).on("click", "button.minimize_mut_group", function () {
		$(this).siblings("div").slideToggle();
		$(this).siblings("button").toggle("fade");
	});	//end click
});	//end ready

// Close mutation group upon pressing the Close Group button
$(document).ready(function () {
	$(document).on("click", "button.close_mut_group", function () {
		if ( !$.trim( $(this).siblings("div").html() ).length ) {
			$(this).parent().remove();
		}
		else {
			alert("Cannot remove group until all mutation forms are removed");
		}
	});	//end click
});	//end ready

// Add mutation button - to insert new mutation formupon pressing the button
$(document).ready(function () {
	$(document).on("click", "div#paper_mutation > div.forms .add_mutation_button" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		var local = $(this).parent().attr('id');
		
		var array = $("#" + local + "> form.form_paper_mutation_group").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		
		var check = true;
		
		if (dg_id) {
			
			if ($("#" + local + "> form.form_paper_mutation_group select.select_paper_region_id").length > 0) {	//If paper_region is added
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
					$(this).find("select.chosen-200").chosen({	//Activate chosen on the select tag
						disable_search_threshold: 5,
						width: '200px',
						inherit_select_classes: true
					});
					
					$(this).find("select.chosen-300").chosen({	//Activate chosen on the select tag
						disable_search_threshold: 5,
						width: '350px',
						inherit_select_classes: true
					});
					
					//Common MIC value input
					if (($(this).siblings("form.form_paper_mutation_group").children("input.common_mic")).length == 0 ) {
						var html_txt = '<label for="common_mic">MIC</label>';
						html_txt += '<input type="number" name="common_mic" class="common_mic" />';
						$(this).siblings("form.form_paper_mutation_group").append(html_txt);
					}
					
					if ( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() )  {
						$(this).find("input.paper_mutation_mic").val( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() );
					}
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
/*==========================================================================================================================================================*/

/*------------------------------------------------------------------------------------------------------------------------------------------------------------
	Known Mutation section
------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Add known mutation button - to insert new known mutation form upon pressing the button
$(document).ready(function () {
	$(document).on("click", "button.button_add_known_mutation" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		
		var array = $(this).siblings("form.form_paper_mutation_known").serializeArray();
		var expt_id = array[0].value;
		var pdg_id = array[1].value;
		
		var check = false;
		
		if (pdg_id) {	//to check if paper_drug_gene is selected
			check = true;
		}
		else {
			alert ("Select drug-gene");
		}
		
		if (check) {
			$.ajax({
				url: "includes/form_select_known_mutation.php",
				context: $(this).siblings("div.known_mut_holder"),
				data: {
					pdg_id: pdg_id
				},
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(this).append(data);
					
					$(this).find("select.chosen-300").chosen({	//Activate chosen on the select tag
						disable_search_threshold: 5,
						width: '350px',
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


// Add known mutation details button (button.button_known_mutation_details) - to insert new known mutation details form upon pressing the button
$(document).ready(function () {
	$(document).on("click", "button.button_known_mutation_details" , function () {	//Used '.on()' bcoz the elements added after DOM gets ready need to be attached to an event handler, thus to perform operations on such elements we need this.
		
		var arr = $(this).parent().parent().siblings("form.form_paper_mutation_known").serializeArray();
		var expt_id = arr[0].value;
		var pdg_id = arr[1].value;
		
		var array = $(this).siblings("form.form_select_known_mutation").serializeArray();
		var aa = array[0].value;
		var dna = array[1].value;
		
		var check = false;
		
		if (aa || dna) {	//to check if paper_drug_gene is selected
			check = true;
		}
		else {
			alert ("Select mutation (AA or nucleotide)");
		}
		
		if (check) {
			$.ajax({
				url: "includes/form_known_mutation_details.php",
				context: $(this).siblings("div.known_mutation_details"),
				data: {
					pmid: $("#current_pmid").html(),
					expt_id: expt_id,
					pdg_id: pdg_id,
					region: $("div#paper_mutation > button").attr("data-paper_region")
				},
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(this).append(data);
					
					//Activate chosen
					$(this).find("select.chosen-200").chosen({	//Activate chosen on the select tag
						disable_search_threshold: 5,
						width: '200px',
						inherit_select_classes: true
					});
					
					if (aa) {	//If amino acid mutation was selected
						var text = $(this).siblings("form.form_select_known_mutation").children("select.select_mutation_aa").val();
						var array = text.split(":");
						
						var loc = array[0];
						var ori = array[1];
						var sub = array[2];
						
						//set the location
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_aa-location").val(loc);
						
						//set original
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_aa-original").val(ori);
						
						//set substituted
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_aa-substituted").val(sub);
					}
					
					if (dna) {	//If amino acid mutation was selected
						var text = $(this).siblings("form.form_select_known_mutation").children("select.select_mutation_dna").val();
						var array = text.split(":");
						
						var loc = array[0];
						var ori = array[1];
						var sub = array[2];
						
						//set the location
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_nucleotide-location").val(loc);
						
						//set original
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_nucleotide-original").val(ori);
						
						//set substituted
						$(this).children("form.form_known_mutation_details").last().find("input.paper_mutation_nucleotide-substituted").val(sub);
					}
				},
				error: function(xhr, status, errorThrown) {
					alert(errorThrown);
				}
			});	//end ajax
		}
	});	//end click
});	//end ready
/*==========================================================================================================================================================*/

/*------------------------------------------------------------------------------------------------------------------------------------------------------------
	Mutation final form
------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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
				dataType: "json",
				success: function(data) {
					if (data[0] == "yes") {
						//set the original amino acid value and make it non editable
						var txt = $(this).children("option:selected").text();
						$(this).siblings("div.paper_mutation_aa-original").empty();
						var out = '<span class="bold">Original: </span><span>' + txt + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">'
						$(this).siblings("div.paper_mutation_aa-original").html(out);
						
						//set the original codon value and make it non editable
						$(this).siblings("input.paper_mutation_codon-original").val(data[1]);
						$(this).siblings("input.paper_mutation_codon-original").prop('readonly', true);
						$(this).siblings("input.paper_mutation_codon-original").css({
							"background-image": "url('images/tick1.png')",
							"background-repeat": "no-repeat",
							"background-position": "left center",
							"padding-left": "11px"
						});
						
					}
					else {
						if (check) {
							alert(data[1]);
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
	$(document).on("submit", "div#paper_mutation form" , function (event) {
		$.ajax({
			context: $(this),
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "json",
			success: function(data) {
				if (data[0] == true) {
					var ori_aa = $('select#reference_aa_list option[value="' + data[8] + '"]').text();
					var sub_aa = $('select#reference_aa_list option[value="' + data[9] + '"]').text();
					
					var txt = "<div class=\"mut_data\">\n";
					txt += '<span style="display: none;" class="mut_pdg_id">' + data[2] + '</span>' + "\n";
					txt += '<span style="display: none;" class="mut_region_id">' + data[3] + '</span>' + "\n";
					txt += '<span style="display: none;" class="mut_aa_ori">' + data[8] + '</span>' + "\n";
					txt += '<span style="display: none;" class="mut_aa_sub">' + data[9] + '</span>' + "\n";
					txt += "<h3>Isolates</h3>\n";
					txt += "<p>No. = <span class=\"mut_isolates\">" + data[4] + "</span>, Percent = " + data[5] + ", MIC = <span class=\"mut_mic\">" + data[6] + "</span></p>\n";
					txt += "<h3>Amino Acid</h3>\n";
					txt += "<p>Location = <span class=\"mut_aa_location\">" + data[7] + "</span>, Original = <span class=\"mut_aa_ori_name\">" + ori_aa + "</span>, Substituted = <span class=\"mut_aa_sub_name\">" + sub_aa + "</span></p>\n";
					txt += "<h3>Codon</h3>\n";
					txt += "<p>Original = " + data[10] + ", Substituted = " + data[11] + "</p>\n";
					txt += "<h3>Nucleotide</h3>\n";
					txt += "<p>Location = <span class=\"mut_dna_location\">" + data[12] + "</span>, Original = <span class=\"mut_dna_ori\">" + data[13] + "</span>, Substituted = <span class=\"mut_dna_sub\">" + data[14] + "</span></p>\n<button class=\"close_mut_form\" type=\"button\"><img src=\"images/cross-16.png\"></button>\n";
					
					if ($(this).parent("div.known_mutation_details").length == 0) {
						txt += '<button type="button" class="add_new add_aa_form">Add same AA - Original</button>' + "\n";
						txt += '<button type="button" class="add_new add_dna_form">Add same Nucleotide - Original</button>' + "\n";
						txt += '<button type="button" class="add_new add_aa_form_full">Add same AA</button>' + "\n";
						txt += '<button type="button" class="add_new add_dna_form_full">Add same Nucleotide</button>' + "\n";
					}
					txt += "</div>\n";
					
					$(this).replaceWith(txt);
					
				}
				else {
					// If multiple substituted codons are found - Open a modal with select box to choose codon and then add it to the form
					if (data[1] == 0) {
						var array_codon = data[2];
						var html = '<option value=""></option>';
						for (var i=0; i<array_codon.length; i++) {
							html += '<option value="' + array_codon[i] + '">' + array_codon[i] + '</option>';
						}
						$("#select_multi_codons").html(html);
						
						$("#select_multi_codons").chosen({	//Activate chosen on the select tag
							disable_search_threshold: 5,
							width: "100px"
						});	
						
						$("#select_multi_codons").trigger('chosen:updated');
						//load modal
						$( "#div_multi_codons" ).data('obj', $(this)).dialog( "open" );
						
					}
					else {
						alert (data[2]);
					}
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready

// Remove added paper mutations form
$(document).ready(function () {
	$(document).on("click", "button.close_mut_form", function (event) {
		
		var expt_id = $("div#paper_mutation").attr("data-experiment_id");
		var pdg_id = $(this).siblings("span.mut_pdg_id").html();
		var region_id = $(this).siblings("span.mut_region_id").html();
		
		var isolates = $(this).siblings("p").children("span.mut_isolates").html();
		var mic = $(this).siblings("p").children("span.mut_mic").html();
		
		var loc = $(this).siblings("p").children("span.mut_dna_location").html();
		var ori = $(this).siblings("p").children("span.mut_dna_ori").html();
		var sub = $(this).siblings("p").children("span.mut_dna_sub").html();
	
		$.ajax({
			context: $(this).parent(),
			url: "modify.php",
			data: {
				q: "delete_mutation",
				exptid: expt_id,
				pdgid: pdg_id,
				regionid: region_id,
				isolates: isolates,
				mic: mic,
				location: loc,
				original: ori,
				substituted: sub
			},
			type: "GET",
			dataType: "text",
			success: function(data) {
				if (data > 0) {
					$(this).slideUp( "slow", function() {
						$(this).remove();
					});
				}
				else {
					alert("Could not delete paper mutation");
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready

// Add similar AA form (only original)
$(document).ready(function () {
	$(document).on("click", "button.add_aa_form", function (event) {
		
		var loc = $(this).siblings("p").children("span.mut_aa_location").html();
		var ori = $(this).siblings("span.mut_aa_ori").html();
		var ori_name = $(this).siblings("p").children("span.mut_aa_ori_name").html();
		
		var array = $(this).parent().parent().siblings("form.form_paper_mutation_group").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		if (array.length == 3) {	//If paper_region is added
			region_id = array[2].value;
		}
		
		$.ajax({
			url: "includes/form_paper_mutation.php",
			context: $(this).parent().parent(),
			data: {
				expt_id: expt_id,
				dg_id: dg_id,
				region_id: region_id
			},
			type: "GET",
			dataType: "html",
			success: function(data) {
				$(this).append(data);
				
				$(this).children("form.block_input").last().find("select.select_mutation_aa").remove();
				$(this).children("form.block_input").last().find("select.select_mutation_dna").remove();
				
				//Activate chosen
				$(this).find("select").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: '200px',
					inherit_select_classes: true
				});
				
				$(this).children("form.block_input").last().find("input.paper_mutation_aa-location").val(loc);	//To enter the location of aa
				$(this).children("form.block_input").last().find("input.paper_mutation_aa-location").prop('readonly', true);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_aa-original").val(ori);	//To enter original aa
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-original").empty();
				var out = '<span class="bold">Original: </span><span>' + ori_name + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">'
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-original").html(out);
				
				//Check if central MIC is set, if yes then set the MIC value
				if ( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() )  {
					$(this).find("input.paper_mutation_mic").val( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() );
				}
				
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready

// Add similar AA form - full (with original and substituted)
$(document).ready(function () {
	$(document).on("click", "button.add_aa_form_full", function (event) {
		
		var loc = $(this).siblings("p").children("span.mut_aa_location").html();
		var ori = $(this).siblings("span.mut_aa_ori").html();
		var ori_name = $(this).siblings("p").children("span.mut_aa_ori_name").html();
		
		var sub = $(this).siblings("span.mut_aa_sub").html();
		var sub_name = $(this).siblings("p").children("span.mut_aa_sub_name").html();
		
		var array = $(this).parent().parent().siblings("form.form_paper_mutation_group").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		if (array.length == 3) {	//If paper_region is added
			region_id = array[2].value;
		}
		
		$.ajax({
			url: "includes/form_paper_mutation.php",
			context: $(this).parent().parent(),
			data: {
				expt_id: expt_id,
				dg_id: dg_id,
				region_id: region_id
			},
			type: "GET",
			dataType: "html",
			success: function(data) {
				$(this).append(data);
				
				$(this).children("form.block_input").last().find(".select_mutation_aa").remove();
				$(this).children("form.block_input").last().find(".select_mutation_dna").remove();
				
				//Activate chosen
				$(this).find("select").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: '200px',
					inherit_select_classes: true
				});
				
				$(this).children("form.block_input").last().find("input.paper_mutation_aa-location").val(loc);	//To enter the location of aa
				$(this).children("form.block_input").last().find("input.paper_mutation_aa-location").prop('readonly', true);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_aa-original").val(ori);	//To enter original aa
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-original").empty();
				var out = '<span class="bold">Original: </span><span>' + ori_name + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">'
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-original").html(out);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_aa-substituted").val(sub);	//To enter substituted aa
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-substituted").empty();
				var out = '<span class="bold">Substituted: </span><span>' + sub_name + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">'
				$(this).children("form.block_input").last().find("div.paper_mutation_aa-substituted").html(out);
				
				//Check if central MIC is set, if yes then set the MIC value
				if ( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() )  {
					$(this).find("input.paper_mutation_mic").val( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() );
				}
				
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready

// Add similar Nucleotide form (only Original)
$(document).ready(function () {
	$(document).on("click", "button.add_dna_form", function (event) {
		
		var loc = $(this).siblings("p").children("span.mut_dna_location").html();
		var ori = $(this).siblings("p").children("span.mut_dna_ori").html();
		
		var array = $(this).parent().parent().siblings("form.form_paper_mutation_group").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		if (array.length == 3) {	//If paper_region is added
			region_id = array[2].value;
		}
		
		$.ajax({
			url: "includes/form_paper_mutation.php",
			context: $(this).parent().parent(),
			data: {
				expt_id: expt_id,
				dg_id: dg_id,
				region_id: region_id
			},
			type: "GET",
			dataType: "html",
			success: function(data) {
				$(this).append(data);
				
				$(this).children("form.block_input").last().find(".select_mutation_aa").remove();
				$(this).children("form.block_input").last().find(".select_mutation_dna").remove();
				
				//Activate chosen
				$(this).find("select").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: '200px',
					inherit_select_classes: true
				});
				
				$(this).children("form.block_input").last().find("input.paper_mutation_nucleotide-location").val(loc);	//To enter the location of aa
				$(this).children("form.block_input").last().find("input.paper_mutation_nucleotide-location").prop('readonly', true);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_nucleotide-original").val(ori);	//To enter original aa
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-original").empty();
				var out = '<span class="bold">Original: </span><span>' + ori + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-original").html(out);
				
				//Check if central MIC is set, if yes then set the MIC value
				if ( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() )  {
					$(this).find("input.paper_mutation_mic").val( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() );
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready

// Add similar Nucleotide form full (Original + Substituted)
$(document).ready(function () {
	$(document).on("click", "button.add_dna_form_full", function (event) {
		
		var loc = $(this).siblings("p").children("span.mut_dna_location").html();
		var ori = $(this).siblings("p").children("span.mut_dna_ori").html();
		var sub = $(this).siblings("p").children("span.mut_dna_sub").html();
		
		var array = $(this).parent().parent().siblings("form.form_paper_mutation_group").serializeArray();
		var expt_id = array[0].value;
		var dg_id = array[1].value;
		var region_id = "";
		if (array.length == 3) {	//If paper_region is added
			region_id = array[2].value;
		}
		
		$.ajax({
			url: "includes/form_paper_mutation.php",
			context: $(this).parent().parent(),
			data: {
				expt_id: expt_id,
				dg_id: dg_id,
				region_id: region_id
			},
			type: "GET",
			dataType: "html",
			success: function(data) {
				$(this).append(data);
				
				$(this).children("form.block_input").last().find(".select_mutation_aa").remove();
				$(this).children("form.block_input").last().find(".select_mutation_dna").remove();
				
				//Activate chosen
				$(this).find("select").chosen({	//Activate chosen on the select tag
					disable_search_threshold: 5,
					width: '200px',
					inherit_select_classes: true
				});
				
				$(this).children("form.block_input").last().find("input.paper_mutation_nucleotide-location").val(loc);	//To enter the location of aa
				$(this).children("form.block_input").last().find("input.paper_mutation_nucleotide-location").prop('readonly', true);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_nucleotide-original").val(ori);	//To enter original aa
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-original").empty();
				var out = '<span class="bold">Original: </span><span>' + ori + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-original").html(out);
				
				$(this).children("form.block_input").last().find("select.paper_mutation_nucleotide-substituted").val(sub);	//To enter substituted aa
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-substituted").empty();
				var out = '<span class="bold">Substituted: </span><span>' + sub + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
				$(this).children("form.block_input").last().find("div.paper_mutation_nucleotide-substituted").html(out);
				
				//Check if central MIC is set, if yes then set the MIC value
				if ( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() )  {
					$(this).find("input.paper_mutation_mic").val( $(this).siblings("form.form_paper_mutation_group").children("input.common_mic").val() );
				}
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
	});	//end submit
});	//end ready

// On choosing mutation from select AA mutation selectbox
$(document).ready(function () {
	$(document).on("change", "form.block_input select.select_mutation_aa", function (event) {
		var text = $(this).val();
		var array = text.split(":");
		
		var details = $(this).children("option:selected").text();
		var array_details = details.split(":");
		var arr = array_details[1].split("->");
		
		var ori_text = arr[0];
		var sub_text = arr[1];
		
		var ori = array[1];
		var sub = array[2];
		
		//set the location
		$(this).parent().parent().find("input.paper_mutation_aa-location").val(array[0]);
		$(this).parent().parent().find("input.paper_mutation_aa-location").prop('readonly', true);
		
		//set original
		$(this).parent().parent().find("select.paper_mutation_aa-original").val(ori);
		$(this).parent().parent().find("div.paper_mutation_aa-original").empty();
		var out = '<span class="bold">Original: </span><span>' + ori_text + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
		$(this).parent().parent().find("div.paper_mutation_aa-original").html(out);
		
		//set substituted
		$(this).parent().parent().find("select.paper_mutation_aa-substituted").val(sub);
		$(this).parent().parent().find("div.paper_mutation_aa-substituted").empty();
		var out = '<span class="bold">Substituted: </span><span>' + sub_text + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
		$(this).parent().parent().find("div.paper_mutation_aa-substituted").html(out);
		
	});	//end submit
});	//end ready

// On choosing mutation from select Nucleotide mutation selectbox
$(document).ready(function () {
	$(document).on("change", "form.block_input select.select_mutation_dna", function (event) {
		var text = $(this).val();
		var array = text.split(":");
		
		//set the location
		$(this).parent().parent().find("input.paper_mutation_nucleotide-location").val(array[0]);
		$(this).parent().parent().find("input.paper_mutation_nucleotide-location").prop('readonly', true);
		
		//set original
		$(this).parent().parent().find("select.paper_mutation_nucleotide-original").val(array[1]);
		$(this).parent().parent().find("div.paper_mutation_nucleotide-original").empty();
		var out = '<span class="bold">Original: </span><span>' + array[1] + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
		$(this).parent().parent().find("div.paper_mutation_nucleotide-original").html(out);
		
		//set substituted
		$(this).parent().parent().find("select.paper_mutation_nucleotide-substituted").val(array[2]);
		$(this).parent().parent().find("div.paper_mutation_nucleotide-substituted").empty();
		var out = '<span class="bold">Substituted: </span><span>' + array[2] + ' </span><img src="images/tick1.png" alt="Left" height="8" width="10">';
		$(this).parent().parent().find("div.paper_mutation_nucleotide-substituted").html(out);
		
	});	//end submit
});	//end ready

// Modal - Multiple codons
$(document).ready(function () {

	$( "#div_multi_codons" ).dialog({
		autoOpen: false,
		height: 250,
		width: 300,
		modal: true,
		dialogClass: "no-close",
		buttons: {
			"Choose": function() {
				var codon = $("#select_multi_codons").val();
				
				if (codon) {
					$(this).data('obj').find("input.paper_mutation_codon-substituted").val(codon);
					$( this ).dialog( "close" );
				}
				else {
					alert("Please choose a codon");
				}
			},
			
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
    });
});	//end ready
/*===========================================================================================================================================================*/