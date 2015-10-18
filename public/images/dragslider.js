/*
 *	jQuery dragSlider Plugin
 *	How to use it : 
 * 
 *	<div id="slider" class="slider">
 * 		<div>
 *			<ul>
 *				<li><img src="" alt=""/></li>
 *				<li><img src="" alt=""/></li>
 *				<li><img src="" alt=""/></li>
 *			</ul>
 *		</div>
 *	</div>
 *
 *	<script type="text/javascript">
 *	$(function(){
 *		$('#slider').dragSlider({
 *			numericId:'controlsSlider1',// unique name of the control element
 *			width : 450,				// width of the slider
 *			height : 250,				// height of the slider
 *			dragEffect : true,			// if true enables the drag effect
 *			autoCenter : true,			// if true center the slider horizontally
 *			imageAutoFit : false,		// if true fit the image to the slider size
 *			speed : 200,				// animation's speed
 *			useArrow : false,			// if true use arrow to navigate
 *		});
 *	});
 *	</script>
 */
(function($) {

	$.fn.dragSlider = function(options){
	  
		// default configuration properties
		var defaults = {
			numericId : 'controls', 	// unique name of the control element
			width : 900,				// width of the slider
			height : 500,				// height of the slider
			dragEffect : true,			// if true enables the drag effect
			autoCenter : true,			// if true center the slider horizontally
			imageAutoFit : false,		// if true fit the image to the slider size
			speed : 200,				// animation's speed
			useArrow : false,			// if true use arrow to navigate
		}; 
		
		var options = $.extend(defaults, options);  
		var obj = $(this);
		var w = options.width;
		var h = options.height;
		var s = $("li", obj).length; // number of slides
		var clickable = true;
		var timeout;
		var t = 0;
		var html = '<ol id="'+ options.numericId +'" class="controls"></ol>';	// the control element
		
		$(obj).width(w); 
		$(obj).height(h);
		
		if(options.autoCenter)
			$(obj).css('margin', '0 auto'); 
			
		$("li", obj).width(w);
		$("li", obj).height(h);
		$("ul", obj).width(s*w);
		
		if(options.imageAutoFit){
			$("img", obj).width(w);
			$("img", obj).height(h);
		}
						
		$("div", obj).after(html);
										
		for(var i=0;i<s;i++){				// populate the control element
			$(document.createElement("li"))
				.attr('id',options.numericId + (i+1))
				.html('<a rel='+ i +' href=\"javascript:void(0);\"></a>')
				.appendTo($("#"+ options.numericId))
				.click(function(){							
					changeSlide($("a",$(this)).attr('rel'),true);
				}); 												
		};	
		
		function setCurrentSlide(i){
			i = parseInt(i)+1;
			$("li", "#" + options.numericId).removeClass("current");
			$("li#" + options.numericId + i).addClass("current");
		};
		
		function adjust(){
			clickable = true;
			setCurrentSlide(t);
		};
		
		function changeSlide(dir,clicked){
			if (clickable){
				clickable = false;
				var ot = t;
				t = parseInt(dir);
				var diff = Math.abs(ot-t);
				var speed = diff*options.speed;		
				p = (t*w*-1);
				$("ul",obj).animate(
					{ marginLeft: p }, 
					{ queue:false, duration:speed, complete:adjust }
				);											
				if(clicked) clearTimeout(timeout);
			};
		};
		
		if(options.dragEffect){
			$(obj).mousedown(function(event) {
				$(this).bind("mousemove");
				var x_origine = event.pageX;
				$(this).mousemove(function(event){
					var x_diff = x_origine - event.pageX;
					var leftMargin = (t*w + x_diff)*-1;
					if(leftMargin<0 && leftMargin>(s-1)*w*-1){
						$("ul",$(this)).css(
							{ marginLeft: leftMargin}
						);
					}				
				});
			});
			
			$(obj).mouseleave(function() {
				$(this).unbind("mousemove");
				var left = parseInt($("ul",obj).css("margin-left").replace("px",""));
				var t = parseInt(Math.round(left/w*-1));
				changeSlide(t,true);
			  });
			
			$(obj).mouseup(function(event) {
				$(this).unbind("mousemove");
				var left = parseInt($("ul",obj).css("margin-left").replace("px",""));
				var t = parseInt(Math.round(left/w*-1));
				changeSlide(t,true);
			});
		}
		
		if(options.useArrow){
			$(document).keydown(function(event) {
				if ( event.keyCode == 39 || event.keyCode == 37) {
				   event.preventDefault();
				}
				switch (event.keyCode) {
					case 37: if(t>0)changeSlide(t-1,true); break;
					case 39: if(t<s-1)changeSlide(t+1,true); break;
				}
			});
		}
		
		document.ondragstart = function () { return false; };// disable image dragging default action
		setCurrentSlide(0);
	};

})(jQuery);



