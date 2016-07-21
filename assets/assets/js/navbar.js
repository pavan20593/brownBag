$(document).ready(function($){
	var path = window.location.pathname.split("/").pop();

	if(path == '') {

		path="company_list.html";
	}

	var target = $('.nav li a[href="'+path+'"');
	target.addClass('active');

});