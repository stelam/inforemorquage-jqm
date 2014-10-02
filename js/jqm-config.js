// désactiver le routing de jQuery Mobile
// parcequ'on utilise plutôt le routing system de Backbone
// Source : https://github.com/ccoenraets/backbone-directory/tree/master/jquerymobile
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = true;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;


    // Swiping config
	$.event.special.swipe.scrollSupressionThreshold = 11; // More than this horizontal displacement, and we will suppress scrolling.
	$.event.special.swipe.horizontalDistanceThreshold = 30; // Swipe horizontal displacement must be more than this.
	$.event.special.swipe.durationThreshold = 500;  // More time than this, and it isn't a swipe.
	$.event.special.swipe.verticalDistanceThreshold = 75;




});


// Remove page from DOM when it's being replaced
$(document).on("pagehide", "div[data-role=page]", function(event){
	$(event.target).remove();
});

