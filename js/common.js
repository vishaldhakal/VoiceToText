$(document).ready(function(){
	$("#showNavButton").on("click", function(){
		$("#hideNavButton, #navBgOverlay").show();
		$("#nav").animate({ right: 0 }, "fast");
		$("#header, #main, #footer").animate({ right: 300 }, "fast");
	});
	$("#hideNavButton, #navBgOverlay").on("click", function(){
		$("#hideNavButton, #navBgOverlay").hide();
		$("#nav").animate({ right: -310 }, "fast");
		$("#header, #main, #footer").animate({ right: 0 }, "fast");
	});	
});


// For Mobile Menu
if($(window).width() < 1200){
	var divs=$("#nav ul li ul").hide();
	var h2s=$("#nav ul li button").click(function(){
		h2s.not(this).removeClass("active")
		$(this).toggleClass("active")			
		divs.not($(this).next()).slideUp()
		$(this).next().slideToggle()
		return false;
	});
}
$(window).resize(function(){
	if($(window).width() > 1199){
		$("#nav ul li ul").removeAttr("style");
	}
});


jQuery(function ($) {

    $("#nav ul li a").on("click", function(e){
		var link = $(this);		
		if (link.hasClass("active")) {
			link.removeClass("active");
		} else {
			link.addClass("active");
		}
	})
	.each(function() {
		var link = $(this);
		if (link.get(0).href === location.href) {
			link.addClass("active");
			return false;
		}
	});
	
	
    $("#nav ul li ul li a").on("click", function(e){
		var p_link = $(this);

		var item = p_link.parent("li").parent("ul").siblings("button");

		if (item.hasClass("active")) {
			item.removeClass("active");
		} else {
			item.addClass("active");
		}
	})
	.each(function() {
		var p_link = $(this);
		if (p_link.get(0).href === location.href) {
			p_link.addClass("active").parent("li").parent("ul").siblings("button").addClass("active");
			return false;
		}
	});
	
	
    $("#footer .menu ul li a").on("click", function(e){
		var f_link = $(this);		
		if (f_link.hasClass("active")) {
			f_link.removeClass("active");
		} else {
			f_link.addClass("active");
		}
	})
	.each(function() {
		var f_link = $(this);
		if (f_link.get(0).href === location.href) {
			f_link.addClass("active");
			return false;
		}
	});
	
	
    $("#mNav li a").on("click", function(e){
		var m_link = $(this);		
		if (m_link.hasClass("active")) {
			m_link.removeClass("active");
		} else {
			m_link.addClass("active");
		}
	})
	.each(function() {
		var m_link = $(this);
		if (m_link.get(0).href === location.href) {
			m_link.addClass("active");
			return false;
		}
	});
	
});


var countdown = 6;
function fnDownload(e){
	e.preventDefault();
	countdown = countdown - 1;
	if(countdown==5){
		e.target.innerText = 'Wait.. ' + countdown.toString() + ' Sec.';
	}
	if(countdown==5){
		countdown = 5;
		var myDownloadInterval = setInterval(function(){
		countdown = countdown - 1;
		if(countdown>=0)
		{
			//e.target.innerText = 'Download will start in ' + countdown.toString() + ' sec';
			e.target.innerText = 'Wait.. ' + countdown.toString() + ' Sec.';
		}
		if(countdown <=0)
		{
			clearInterval(myDownloadInterval);
			countdown = 6;
			e.target.innerText = 'Downloaded';
			e.target.setAttribute("class", "font-download-btn downloaded");
			var a = document.createElement("a");
			a.href = e.target.href;
			a.setAttribute('download','');
			a.click();
		}
		},1000);
	}
	else{
		alert('Another file is downloading! Please Wait...');
	}
}
/*var countdownfast = 3;
function fnDownloadFast(e){
	e.preventDefault();
	countdownfast = countdownfast - 1;
	if(countdownfast==2){
		e.target.innerText = 'Wait...';
	}
	if(countdownfast==2){
		countdownfast = 2;
		var myDownloadInterval = setInterval(function(){
		countdownfast = countdownfast - 1;
		if(countdownfast>=0)
		{
			e.target.innerText = 'Wait...';
		}
		if(countdownfast <=0)
		{
			clearInterval(myDownloadInterval);
			countdownfast = 3;
			e.target.innerText = 'Downloaded';
			e.target.setAttribute("class", "font-download-btn downloaded");
			var a = document.createElement("a");
			a.href = e.target.href;
			a.setAttribute('download','');
			a.click();
		}
		},1000);
	}
	else{
		alert('Another file is downloading! Please Wait...');
	}
}*/
var countdownfast = 4;
function fnDownloadFast(e){
	e.preventDefault();
	countdownfast = countdownfast - 1;
	if(countdownfast==3){
		e.target.innerText = 'Wait.. ' + countdownfast.toString() + ' Sec.';
	}
	if(countdownfast==3){
		countdownfast = 3;
		var myDownloadInterval = setInterval(function(){
		countdownfast = countdownfast - 1;
		if(countdownfast>=0)
		{
			//e.target.innerText = 'Download will start in ' + countdownfast.toString() + ' sec';
			e.target.innerText = 'Wait.. ' + countdownfast.toString() + ' Sec.';
		}
		if(countdownfast <=0)
		{
			clearInterval(myDownloadInterval);
			countdownfast = 4;
			e.target.innerText = 'Downloaded';
			e.target.setAttribute("class", "font-download-btn downloaded");
			var a = document.createElement("a");
			a.href = e.target.href;
			a.setAttribute('download','');
			a.click();
		}
		},1000);
	}
	else{
		alert('Another file is downloading! Please Wait...');
	}
}