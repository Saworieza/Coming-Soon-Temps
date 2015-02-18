var url = $.url();

var item = url.param('t');
var category = url.param('o');
var category_global = url.param('o');
var demo = url.param('d');

var isiPad = navigator.userAgent.match(/iPad/i) != null;


// if (!url.param('o') || !url.param('t') || !url.param('d'))
// {
// 	category = 'wordpress';
// 	category_global = 'wordpress';
// 	item = 'ripple';
// 	demo = '';
// }

$(document).ready(function() {

	var height_purchase = 41;
	var images_purchase = 60;
	var current_purchase = 0;

	$('.bar-opened .purchase a').hoverIntent({
		sensitivity: 1,
		over : function (){
			$(this).children('i').clearQueue();
				for (var i=1; i<images_purchase; i++) {
					current_purchase = height_purchase*i*(-1);
					$(this).children('i').delay(50).animate( {'background-position': 'center ' + current_purchase + 'px'}, {duration: 0});
				}
		},
		out : function (){
			$(this).children('i').clearQueue();
			$(this).children('i').delay(50).animate( {'background-position': '50% 0px'}, {duration: 0});
		}
		
	});

	var height_view = 35;
	var images_view = 48;
	var current_view = 0;

	$('.bar-opened .view-more a').hoverIntent({
		sensitivity: 1,
		over : function (){
			$(this).children('i').clearQueue();
				for (var i=1; i<images_view; i++) {
					current_view = height_view*i*(-1);
					$(this).children('i').delay(40).animate({'background-position': '50% ' + current_view +'px'}, {duration: 0});
				}
		},
		out : function (){
			$(this).children('i').clearQueue();
			$(this).children('i').delay(50).animate({'background-position': '50% 0px'}, {duration: 0});
		}
		
	});


	$.getJSON('ajax.php', { category: category, item: item, demo: demo }, function(data) {
		$('.bar-opened .purchase a, .bar-closed .purchase a').attr('href', data.purchase);
		if (data.price>0) { $('.bar-opened .purchase a span').text(data.price + '$'); }
		$('.bar-opened .view-more a').attr('data-category', category).attr('data-item', item);
		$('.bar .icn-side.close a').attr('href', data.view);
		$('#iframe_content').attr('src', data.view);

		$( ".nav-themes ul li" ).each(function( index ) {
			category_theme = $(this).children('a').attr('data-category'); 
			$(this).children('span').text('(' + data.count[category_theme] + ')');
		});

		if (isiPad) {
			window.location.href = data.view;
		}

		ga_set_links();
	});

	$(document).resize(function () {
		set_height(0);
		set_width(68);
		ie();
	}).resize(); 

	$("aside.sidebar:not(.freeze)").hoverIntent({
		sensitivity: 1,
    	over: sidebar_hover,
    	out: sidebar_out
	});

	//sidebar_hover();

	$(".bar-opened .devices a").click(function() {
		
		$('#iframe').attr('class', 'view-' + $(this).attr('rel'));
		$(".bar-opened .devices a.active").removeClass('active');
	
		$(this).addClass("active");
		
		return false;
	});

	$(".bar-opened .view-more a").click(function() {
		
		category = $(this).attr('data-category');
		item = $(this).attr('data-item');

		get_themes(category);
		get_theme(category, item);
		
		$('.sidebar').addClass('freeze');
		$("aside.sidebar").animate({'width' : 800}, function(){
			$('.bar').fadeOut('fast', function() {
				$('.themes, .mask').fadeIn('fast');
			});
		});
		
		return false;
	});

	$(document).on("click", ".themes-list ul li a", function(){
		category = $(this).attr('data-category');
		item = $(this).attr('data-item');

		get_theme(category, item);

		return false;
	});

	// $(document).on("click", ".theme-detail li.view a", function(){
	// 	href = $(this).attr('href');
	// 	$('#iframe_content').attr('src', href);
	// 	$('.themes .icn-side.close a').trigger('click');
	// 	return false;
	// });

	

	$(".nav-themes li a").click(function() {

		$(".nav-themes li").removeClass('active');
		$(this).parent('li').addClass('active');

		category = $(this).attr('data-category');

		get_themes(category);

		return false;
	});

	$('.themes .icn-side.close a').click(function() {

		$('.themes').addClass('animated fadeOutDown').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
			close_theme_detail();
			$('.mask').fadeOut('fast');
		});

		if(!Modernizr.csstransitions)
		{
			close_theme_detail();
		}
  			
		return false;

	});

	$(document).on("click", ".mask", function(){
		$('.themes .icn-side.close a').trigger('click');
		return false;
	});

	

	ie();

});

function set_height(height)
{
	$('#iframe, .sidebar').css({ 'height': (($(window).height()) - height) + 'px' });
}

function set_width(width)
{
	$('#iframe').css({ 'width': (($(window).width()) - width) + 'px' });
}

function sidebar_hover()
{
	if ( !$("aside.sidebar").hasClass('freeze') )
	{
		$("aside.sidebar").animate({'width' : 220});
		$("aside.sidebar").addClass('open');
		$('.bar-closed .icn-side a:not(.close)').addClass('animated fadeOutLeft delay0 fast');
		$('.bar-opened .icn-side a:not(.close)').removeClass('fadeOutRight').addClass('animated fadeInLeft delay1');
	}
	
}

function sidebar_out()
{
	if ( !$("aside.sidebar").hasClass('freeze') )
	{
		$("aside.sidebar").removeClass('open');
		$('.bar-opened .icn-side a:not(.close)').removeClass('delay1').addClass('fadeOutRight');
		$("aside.sidebar").delay(150).animate({'width' : 68});
		$('.bar-closed .icn-side a:not(.close)').removeClass('delay0 fadeOutLeft fast').addClass('fadeInRight delay1');
	}
}

function get_theme(category, item)
{
	$('.macbook').removeClass('fadeInRight').addClass('animated fadeOutRight fast');
	$('.theme-detail').removeClass('fadeInDown').addClass('animated fadeOutDown fast');

	$.getJSON('ajax.php', { category: category, item: item }, function(data) {

		$('.themes-list ul li').removeClass('active');
		$('.themes-list ul li a[data-category="' + category + '"][data-item="' + item + '"]').parent('li').addClass('active');

		$('.macbook img').attr('src', data.image);
		if (data.buyers>0) { $('.theme-detail li.buyers').html('<span>'+ data.buyers + '</span><br>buyers'  ); }
		if (data.price>0) { $('.theme-detail li.price').html('<span>' + data.price + '</span>$'); }
		$('.theme-detail li.purchase a, .macbook a').attr('href', data.purchase);
		$('.theme-detail li.view a').attr('href', '/?t=' + item + '&o=' + category).attr('data-category', category).attr('data-item', item);

		$('.macbook, .theme-detail').fadeIn('fast');
		$('.macbook').removeClass('fadeOutRight').addClass('fadeInRight');
		$('.theme-detail').removeClass('fadeOutDown').addClass('fadeInDown');

		ga_set_links();

	});
}

function get_themes(_category)
{
	html = '';

	$('.nav-themes li').removeClass('active');
	$('.nav-themes li a[data-category="' + _category + '"]').parent('li').addClass('active');

	$.getJSON('ajax.php', { themes: true, category: _category }, function(data) {

		$.each(data.themes, function(index, value) {

			active = '';
			if (index == item && category_global==_category)
			{
				//active = ' class="active" '; 
			}

			html += '<li ' + active + '><a href="#" data-item="' + index + '" data-category="' + _category + '">' + ucwords(index) + '</a></li>';
		});

		if ( $('.themes-list').hasClass('animated') )
		{
			$('.themes-list').addClass('animated fadeOutLeft fast').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
				$('.themes-list').removeClass('fadeOutLeft').addClass('fadeInLeft');
				$('.themes-list h4').html(data.title);
				$('.themes-list ul').html(html);
			});

			if(!Modernizr.csstransitions)
			{
				$('.themes-list').removeClass('fadeOutLeft').addClass('fadeInLeft');
				$('.themes-list h4').html(data.title);
				$('.themes-list ul').html(html);
			}
		}
		else
		{
			$('.themes-list').addClass('animated fadeInLeft');
			$('.themes-list h4').html(data.title);
			$('.themes-list ul').html(html);
		}

	});

}

function ie ()
{
	if ( !Modernizr.mq('only all') )
	{
		var doc_width = $(document).width();
		var doc_height = $(document).height();
		
		if ( doc_width <= 480 )
		{
			$('.sidebar').hide();
		}
		else
		{
			$('.sidebar').show();
		}

		if ( doc_height <= 650 )
		{
			$('.bar-opened .view-more').css({'top' : '30%'});
			$('.bar-opened .purchase').css({'bottom' : '30%'});
		}
		else
		{
			$('.bar-opened .view-more').css({'top' : '35%'});
			$('.bar-opened .purchase').css({'bottom' : '35%'});
		}

		if ( doc_height <= 850 )
		{
			$('.bar-opened .logo, .themes .logo').css({'left' : '116px', 'top' : '50px'});
			$('.nav-themes').css({'left' : 'auto', 'top' : '50px'});
			$('.theme-info').css({'top' : '120px'});
			$('.freeze .icn-side.close').css({'top' : '20px'});
		}
		else
		{
			$('.bar-opened .logo, .themes .logo').css({'left' : '50%', 'top' : '5%'});
			$('.nav-themes').css({'left' : '0', 'top' : '25%'});
			$('.theme-info').css({'top' : '40%'});
			$('.freeze .icn-side.close').css({'top' : '2%'});
		}

	}
}

function close_theme_detail()
{
	$("aside.sidebar").addClass('closing');
	$('.sidebar').removeClass('freeze');
	$('.themes').hide();
	sidebar_out();
	$('.bar').fadeIn('fast', function(){

		$("aside.sidebar").animate({'width' : 68}, function(){
			$("aside.sidebar").removeClass('closing');
			$('.themes').removeClass('animated fadeOutDown');
		});

	});
}

/* Helpers */

function ucwords (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Waldo Malqui Silva
  // +   bugfixed by: Onno Marsman
  // +   improved by: Robin
  // +      input by: James (http://www.james-bell.co.uk/)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: ucwords('kevin van  zonneveld');
  // *     returns 1: 'Kevin Van  Zonneveld'
  // *     example 2: ucwords('HELLO WORLD');
  // *     returns 2: 'HELLO WORLD'
  return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
    return $1.toUpperCase();
  });
}