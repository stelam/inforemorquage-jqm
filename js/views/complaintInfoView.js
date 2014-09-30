window.ComplaintInfoView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('complaint-info'));

        _.bindAll(this, "onComplaintBtn");

        this.model.bind('invalid', this.displayErrors);
    },
	render: function(){
        app.headerModel.set({
            'css_classes' : 'none no-menu no-right-button',  
            'title' : this.model.get("name") + " endommagé",
            'left_button_override' : null
        });

		this.$el.html(this.template(this.model.toJSON()));

        this.changeBehaviourOnEmailAvailable();

		return this; // enable chained calls
	},

    events: function(){

        return {
            'click #complaint-btn' : 'onComplaintBtn'
        }
    },



    attributes: function() {

    	return {
    		
    	};
    },

    onComplaintBtn: function(e){
        var btn = e;
        var carId = this.model.get("id");
        if (window.plugin && window.plugin.email){
            window.plugin.email.isServiceAvailable(
                function (isAvailable) {
                    if (isAvailable){
                        btn.preventDefault();
                        app.router.navigate("cars/" + carId + "/complaint", {trigger: true});
                    }

                }
                );
        }

        // for testing on desktop
        if (!app.appState.isMobile()){
            btn.preventDefault();
            app.router.navigate("cars/" + carId + "/complaint", {trigger: true});            
        }

    },

    changeBehaviourOnEmailAvailable: function(){
        this.$el.find("#complaint-btn").attr("href", "mailto:" + app.appState.get("config").serviceEmailAddress);
        var view = this;
        
        if (window.plugin && window.plugin.email){
            window.plugin.email.isServiceAvailable(
                function (isAvailable) {
                    if (isAvailable)
                        view.$el.find("#complaint-btn").attr("href", "");
                    else
                        view.$el.find("#complaint-btn").attr("href", "mailto:" + app.appState.get("config").serviceEmailAddress);
                }
            );
        }
    }
    

});


