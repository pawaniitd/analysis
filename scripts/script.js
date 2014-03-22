
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
});	//end ready

//