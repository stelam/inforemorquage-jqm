window.NotificationView = Backbone.View.extend({
	className : "ui-page-theme-a popup-animation notification-container hidden",

    initialize:function () {
        _.bindAll(this, 'hide');
        _.bindAll(this, 'display');
    	this.template = _.template(tpl.get('notification'));
        this.listenTo(this.model, 'update', this.show);
        this.listenTo(this, 'hidden', this.onHidden);

        this.timer = "";
        this.callback = null;

        _.bindAll(this, 'show');
        _.bindAll(this, 'onHidden');
    },

    events:{
    	'click .delete' : 'hide',
        'click aside' : 'hide',
        'click .right-button' : 'hide',
        'click .left-button' : 'dispatchLeftButton'
    },

    render: function (eventName) {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    show: function(){
        this.setIcon();
        this.$el.removeClass("hidden").removeClass("bounce-out-animation");
        this.render();

        //cacher la notification après un certain temps
        clearTimeout(this.timer);
        this.timer = setTimeout(_.bind(this.hide, this), this.model.get("displayTime"));

        this.dispatchBeforeRender();
    },

    setIcon: function(){
        this.model.setIcon();
    },

    hide: function(){
        var view = this;
        this.$el.addClass("bounce-out-animation");
        var el = this.$el;
        // Cacher la notification lorsque la transition est terminée

        var transitionDelayTimer = setTimeout(function(){hideEl()}, 500);

        function hideEl() {
            el.addClass("hidden").removeClass("bounce-out-animation");
            clearTimeout(transitionDelayTimer);
            clearTimeout(this.timer);
            view.trigger("hidden");
        }
    },

    dispatchLeftButton: function(e){
        this.hide();
        app.eventBus.trigger('notificationLeftButton', {context: this.model.get("context"), data: this.model.get("data")});
        //this.callBack(e);

        if (this.callback != null){
            this.callback();
            this.callback = null;
        }
    },

    dispatchBeforeRender: function(e){
        app.eventBus.trigger('notificationBeforeRender', {context: this.model.get("context"), data: this.model.get("data")});  
        //this.callBack(e);
    },

    display: function(options){
        this.model.display(options);
        if (options.callback != null){
            this.callback = options.callback;
        } else{
            this.callback = null;
        }
    },


    onHidden: function(){

    }






});