window.BottomNavView = Backbone.View.extend({
	className : "ui-page-theme-a footer-container",

    initialize:function () {
    	this.template = _.template(tpl.get('bottom-nav'));
	    _.bindAll(this, 'change_current_item');
	    app.appState.on('change:bottomNavItem', this.change_current_item);
    },

    render:function (eventName) {
        $(this.el).html(this.template());
	    if (app.appState.get('bottomNavItem') == "none"){
	    	$(this.el).addClass("hidden");

	    	//si la navigation est cachée, ajouter une classe "no-bottom-nav" au body
	    	$("body").addClass("no-bottom-nav");
	    }
	    else{
	    	$("body").removeClass("no-header");
	    }


        return this;
    },

	change_current_item: function() {

	    // Cacher la navigation si la vue courante désire la cacher
	    if (app.appState.get('bottomNavItem') == "none")
	    	$(this.el).addClass("hidden");
	    else{
	    	$(this.el).removeClass("hidden");
	    	this.$(".ui-btn-active").removeClass("ui-btn-active");
		    this.$('#' + app.appState.get('bottomNavItem')).addClass('ui-btn-active');
	    }
	}

});