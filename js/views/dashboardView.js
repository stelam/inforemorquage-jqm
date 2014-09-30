/**
 * @class DashboardView
 *
 * Vue pour le tableau de bord
 *
 * @namespace window.DashboardView
 * @extends Backbone.View
 */
window.DashboardView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('dashboard'));

        _.bindAll(this,"addNewCar");
        _.bindAll(this,"refreshCars");
        _.bindAll(this, "onBackButton");

        this.listenTo(app.eventBus, 'notificationLeftButton', this.addNewCar);
        this.listenTo(app.eventBus, 'dispatchRefreshBtn', this.refreshCars);
        this.listenTo(app.eventBus, 'appOnline', this.refreshCars);
        this.listenTo(app.eventBus, 'appResume', this.refreshCars);        

        this.childViews = [];
    },

    events: function(){
        document.addEventListener("backbutton", this.onBackButton, false);
    },

    render: function (eventName) {
        //this.$el.html(this.template(this.model.toJSON()));

        app.headerModel.set({
            'css_classes' : 'no-back no-right-button', 
            'right_button_label' : 'Ajouter un véhicule', 
            'right_button_icon' : 'plus',
            'title' : 'Véhicules',
            'left_button_override' : null
        });

        $(this.el).html(this.template());
        this.addAll();

        return this;
    },


    onBackButton: function(e) {
        if($(".ui-popup-active").length > 0){
            e.preventDefault();
            $('.ui-popup').popup('close');
            $("#custom-popup-overlay").removeClass("active");
        }
        else {
             window.history.back();
        }
    },

    addNewCar: function(event){
        if (event.context == "addNewCar")
            app.router.navigate("cars/add", {trigger: true});
    },

    addOne: function(car){
        //console.log(car);
        var carView = new CarView({model: car});
        this.$('#dashboard-car-list').append(carView.render().el);
        carView.delegateEvents();
        this.childViews.push(carView);
    },
    addAll: function(){
        this.$('#dashboard-car-list').html(''); // clean the todo list
        app.cars.each(this.addOne, this);
        this.refreshCars();
    },

    refreshCars: function(event){
        app.cars.updateCarsStatus();
    },

    beforeClose: function(){
        document.removeEventListener("backbutton", this.onBackButton, false);
        $(".ui-popup-container, .ui-screen-hidden").remove();
    }



});