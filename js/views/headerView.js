window.HeaderView = Backbone.View.extend({
	className : "ui-page-theme-a header-container",

    initialize:function () {
    	this.template = _.template(tpl.get('header'));
	    this.model.on('change', this.render, this);

        _.bindAll(this,"dispatchLeftButton");
    },

    events: function(){

        return {
        	'click button.ui-btn-right' : 'dispatchRightButton',
        	'click .ui-btn-left' : 'dispatchLeftButton',
            'click #menu-button' : 'bindMenuEvents'
        }
    },

    render: function (eventName) {
        //  trigger create for generating the jqm menu
        this.$el.html(this.template(this.model.toJSON())).trigger("create");

        //si le header est caché, ajouter une classe "no-header" au body
        if (this.model.get('css_classes').indexOf("hidden") > -1)
            $("body").addClass("no-header");
        else
            $("body").removeClass("no-header");

        return this;
    },

    dispatchRightButton: function(e){
    	app.eventBus.trigger('headerRightButton');
    },

    dispatchLeftButton: function(e){
        if (this.model.get("left_button_override") != null){
            var f = this.model.get("left_button_override");
            f();
        }
        else{
    	   window.history.back();
        }

    	app.eventBus.trigger('headerLeftButton');
    },

    dispatchRefreshBtn: function(){
        app.eventBus.trigger('dispatchRefreshBtn');  
    },

    /*
    * On bind les événements du pop up menu de jqm 
    * manuellement, parce que jqm génère le popup à l'extérieur
    * de la portée de this.$el
    */
    bindMenuEvents: function(){
        var view = this;
        if (!$("#popupMenu").hasClass("events-binded")){
            $popupMenu = $("#popupMenu");
            $popupMenu.find(".refresh-btn").on("click", view.dispatchRefreshBtn);

            $popupMenu.on("click", function(){
                $('.ui-popup').popup('close');
            })

            $popupMenu.addClass("events-binded");
        }
    }

});