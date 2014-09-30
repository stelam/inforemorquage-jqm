window.FirstUsePage = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('first-use'));
		this.listenTo(app.eventBus, 'headerRightButton', this.acknowledged);
    },

    render:function (eventName) {
        app.headerModel.set({'title' : 'Première utilisation', 
        	'css_classes': 'hidden', 
        	'right_button_icon' : 'carat-r', 
        	'right_button_label' : 'Continuer',
            'left_button_override' : null
    	});

        $(this.el).html(this.template()).addClass("welcome");
        return this;
    },

    events: function(){
        return {
            "swipeleft" : "acknowledged",
            "swiperight" : "acknowledged"
        };
    },

    acknowledged: function(){
    	app.router.navigate("cars/add", {trigger: true});
    },

	cleanUp: function(){
	    // COMPLETELY UNBIND THE VIEW
	    this.undelegateEvents();

	    this.$el.removeData().unbind(); 

	    // Remove view from DOM
	    this.remove();  
	    Backbone.View.prototype.remove.call(this);
	}


});