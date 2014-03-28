
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
	});	//end click
	
	$(".wrong_paper > button").click(function () {
		relevance("wrong_paper", $(this));
	});	//end click
});	//end ready

//Script to add gene to the database - Submit form via JQuery and not HTML
$(document).ready(function () {
	$("#add_gene > form").submit(function( event ) {
	
		$(this).children("input:text").val('');
		
		$.ajax({
			url: "modify.php",
			data: $(this).serialize(),
			type: "GET",
			dataType: "text",
			success: function(data) {
				$( "#add_gene > form" ).toggle( "slide");
			},
			error: function(xhr, status, errorThrown) {
				alert(errorThrown);
			}
		});	//end ajax
		
		event.preventDefault();	//This prevents form submittion via html default
	});	//end submit
});	//end ready


// Add gene animation - using JQuery UI
$(document).ready(function () {
	$( "#add_gene_link" ).click(function() {
	  $( "#add_gene > form" ).toggle( "slide");
	});
});	//end ready


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

// Add tags input and load tags (JQuery UI autocomplete) - using jQuery-Tags-Input (https://github.com/xoxco/jQuery-Tags-Input)
$(document).ready(function () {
	$(".download a").click(function () {
		$pmid = $(this).parent().parent().parent().attr('id');
	
	
		$("div#" + $pmid + " .tags").show("fade");
		
		$("div#" + $pmid + " .tags .input_tags").tagsInput({
			autocomplete_url:'files/tags.json',
			height: '20px',
			width: '70%'
		});
	
	});	//end click
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