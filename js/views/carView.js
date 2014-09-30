window.CarView = Backbone.View.extend({
	tagName: 'li',
    initialize:function () {
        _.bindAll(this,"requestDeleteCar");
        _.bindAll(this,"requestUpdateCar");
        _.bindAll(this,"requestEditCar");
        _.bindAll(this,"deleteCar");
        _.bindAll(this,"requestCarDetails");
        //_.bindAll(this,"onNotificationLeftButton");
        //_.bindAll(this,"onNotificationBeforeRender");
        this.template = _.template(tpl.get('car'));

        this.listenTo(this.model, 'update', this.render);
        //this.model.on('remove', this.render, this);

        this.listenTo(app.eventBus, 'notificationLeftButton', this.onNotificationLeftButton);
        this.listenTo(app.eventBus, 'notificationBeforeRender', this.onNotificationBeforeRender);

    },
	render: function(){
        // remove all the old popup containers
        $("#popupMenu-"+this.model.id+"-popup").remove();
        $("#popupMenu-"+this.model.id+"-screen").remove();

		this.$el.html(this.template(this.model.toJSON())).trigger("create");
		return this; // enable chained calls
	},

    events: function(){


		if (app.appState.isMobile()) {
			return{
				'touchend' : 'onClick',
                'touchstart' : 'onTouchStart'
			}
		}
		else{
			return{
				'click' : 'onClick',
                'click .delete-car-btn' : 'deleteCar'
			}	
		}
    },



    attributes: function() {
    	return {
    		/*'data-role': 'collapsible',*/
    		'data-inset': 'false',
            'data-icon': 'false',
    		'data-collapsed-icon': 'carat-d',
    		'data-iconpos': 'right',
    		'id': "car-" + this.model.id,
    		'class': 'car-item scale-down-on-active'

    	};
    },


    onClick: function(event){
        // Création d'un overlay custom qui prend toute la hauteur
        // de la vue, car l'overlay par défaut de jquery mobile ne prend pas la hauteur complète.
        var modelId = this.model.id;
        var car = this.model;
        $("#popupMenu-"+modelId).on("popupafteropen", function( event, ui ) {
            if ($("#custom-popup-overlay").length == 0){
                $popupOverlay = $("<div id='custom-popup-overlay' class='active' />");
                $(".ui-page-active").append($popupOverlay);
                $popupOverlay.css({"height" : $("#dashboard-car-list").outerHeight()})
                $popupOverlay.on("click", function(){
                    $(this).removeClass("active");
                    $('.ui-popup').popup('close');
                })
            }
            else{
                $("#custom-popup-overlay").addClass("active");
            }
        });


        // On ferme les popups on scroll, sinon, si la page
        // est longue, des popups qui sont hors de la vue après défilement
        // peuvent se comporter de façon imprévisible
        $(".ui-page-active").one('scroll', function() {
           $('.ui-popup').popup('close');
           $("#custom-popup-overlay").removeClass("active");
        }); 

        if (app.appState.isMobile())
            this.$el.addClass("touchend").removeClass("touchstart");

        // Étant donné que jQuery Mobile place le container du popup
        // en dehors de this.$el, il faut gérer les événements manuellement
        // manuellement
        if (!$("#popupMenu-"+modelId+"-popup").hasClass("events-added")){
            $popup = $("#popupMenu-"+modelId+"-popup");
            //$popup.find()
            view = this;
            $popup.addClass("events-added");
            $popup.find(".delete-car-btn").on("click", view.requestDeleteCar);
            $popup.find(".refresh-car-btn").on("click", view.requestUpdateCar);
            $popup.find(".edit-car-btn").on("click", view.requestEditCar);
            $popup.find(".info-car-btn").on("click", view.requestCarDetails);

            // Fermeture du popup quand on clique sur une des options
            $popup.on("click", function(){
                $('.ui-popup').popup('close');
            })

        }

    },



    onTouchStart: function(event){
        this.$el.addClass("touchstart").removeClass("touchend");
        $(".ui-page-active").one('scroll', function() {
           $(".touchstart").removeClass("touchstart");
        }); 
    },

    requestDeleteCar: function(){
        app.notification.display({
            "type" : "warning",
            "message" : app.strings.get(app.config.get("currentLanguage")).info01,
            "title" : this.model.get("name"),
            "showButtons" : true,
            "context" : "deleteCar",
            "data" : {
                carId : this.model.get("id")
            },
            callback: this.deleteCar
        });
        app.notificationModel.trigger("update");
    },

    deleteCar: function(){
        this.model.destroy();
        app.notificationModel.set({
            "type" : "success",
            "message" : app.strings.get(app.config.get("currentLanguage")).info02,
            "title" : this.model.get("name"),
            "showButtons" : false,
            "context" : "carDeleted"
        });
        this.$el.addClass("fade-out fade-out-height");
        this.close();
    },

    deleteCarById: function(carId){
        /*console.log(app.cars);
        carToDestroy = app.cars.get(carId);
        if (carToDestroy){
            carToDestroy.destroy()

            app.notificationModel.set({
                "type" : "success",
                "message" : app.strings.get(app.config.get("currentLanguage")).info02,
                "title" : this.model.get("name"),
                "showButtons" : false,
                "context" : "carDeleted",
                "data" : {
                    carId : carId
                }
            });
            this.$el.addClass("fade-out fade-out-height");
            this.close();
        }else{
            console.log(app.cars);
        }*/
    },

    requestUpdateCar: function(){
        this.model.updateStatus();
    },

    requestEditCar: function(){
        app.router.navigate("cars/" + this.model.id + "/edit", {trigger: true});
    },

    requestCarDetails: function(){
        app.router.navigate("cars/" + this.model.id, {trigger: true});
    },

    onNotificationLeftButton: function(event){
        if (event.context == "deleteCar" && event.data.carId == this.model.get("id")){
            this.deleteCarById(event.data.carId);
        }
    },

    onNotificationBeforeRender: function(event){
        if (event.context == "carDeleted" && event.data.carId == this.model.get("id")){
            this.render();
        }
    }

});
