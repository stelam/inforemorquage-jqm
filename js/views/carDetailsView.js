window.CarDetailsView = Backbone.View.extend({

    initialize:function () {
        _.bindAll(this, "renderMap");
        _.bindAll(this, "toggleFullscreen");
        _.bindAll(this, "createDirectionsManager");
        _.bindAll(this, "createDirections");
        _.bindAll(this, "createRoute");
        _.bindAll(this, "backButtonMap");
        this.template = _.template(tpl.get('car-details'));

        this.defaultMapHeight = 0;

        this.map  = null;
        this.directionsManager;
        this.directionsErrorEventObj;
        this.directionsUpdatedEventObj;
        this.currentPosition = null;
    },
	render: function(){
        app.headerModel.set({
            'css_classes' : 'none no-menu no-right-button menu-contextual',  
            'right_button_icon' : 'check',
            'title' : "Remorquage " + this.model.get("name"),
            'left_button_override' : null,
            'data' : {carId: this.model.get("id")}
        });

		this.$el.html(this.template(this.model.toJSON())).trigger("create");

		return this; // enable chained calls
	},

    events: function(){

        document.addEventListener("backbutton", this.backButtonMap, false);

        return {
            'click #map-btn' : 'renderMap',
            'click #map-fullscreen-toggle' : 'toggleFullscreen',
            'click #btn-map-bus' : 'createRoute',
            'click #btn-map-walking' : 'createRoute',
            'click #btn-map-car' : 'createRoute',
            'click .toggle-itinerary' : 'toggleItinerary'

        }
    },

    // Définition custom du comportement du bouton "back"
    // quand la map est en fullscreen et // ou quand le panel est ouvert
    backButtonMap: function(e){
        if($(".ui-popup-active").length > 0){
            e.preventDefault();
            $('.ui-popup').popup('close');
            $("#custom-popup-overlay").removeClass("active");
        }
        else if ($("body").hasClass("ui-panel-page-container")){
            e.preventDefault();
            this.closeItinerary();
        }
        else if($("body").hasClass("fullscreen-map")){
            e.preventDefault();
            this.toggleFullscreen();
        }
        else {
             window.history.back();
        }
    },

    attributes: function() {

    },

    createDirectionsManager: function(){
        var displayMessage;
        if (typeof this.directionsManager == "undefined") {
            this.directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.map);
            displayMessage = 'Directions Module loaded\n';
            displayMessage += 'Directions Manager loaded';
        }
        this.directionsManager.resetDirections();
        this.directionsErrorEventObj = Microsoft.Maps.Events.addHandler(this.directionsManager, 'directionsError', function(arg) { console.log(arg.message) });
        this.directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(this.directionsManager, 'directionsUpdated', function() { $("#directions").removeClass("loading"); });   
    },

    createDirections: function(){
        if (!this.directionsManager){
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: this.createRoute });
        }
        else{
            this.createRoute();
        }
    },

    createRoute: function(e){
        $("#directions").addClass("loading");    

        if (typeof this.directionsManager == "undefined") { this.createDirectionsManager(); }
        this.directionsManager.resetDirections();

        // Defining the route mode
        if (typeof e == "undefined"){
            this.directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
        } else if ($(e.currentTarget).data("transportation") == "bus"){
            this.directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.transit });
        } else if ($(e.currentTarget).data("transportation") == "car"){
            this.directionsManager.setRequestOptions({ 
                routeOptimization: Microsoft.Maps.Directions.RouteOptimization.shortestDistance,
                routeMode: Microsoft.Maps.Directions.RouteMode.driving 
            });
        } else {
            // walking by default
            this.directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
        }

        // set to kilometers
        this.directionsManager.setRequestOptions({ 
            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.kilometers, 
        });


        var originWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude) });
        this.directionsManager.addWaypoint(originWaypoint);

        var destinationWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: this.model.getTowingDestinationAddress() +", Montréal" });
        this.directionsManager.addWaypoint(destinationWaypoint);

        // Set the element in which the itinerary will be rendered
        this.directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('directionsItinerary') });
        this.directionsManager.calculateDirections();

        if (!$("body").hasClass("fullscreen-map"))
            this.defaultMapHeight = $("#map").outerHeight();

        

    },


    renderMap: function(){
        if (typeof this.directionsManager != "undefined"){
            $('.ui-page-active').animate({
                scrollTop: $("#directions").offset().top - 60
            }, 200);

            return true;
        }

        var view = this;

        var currentPosition = null;

        Microsoft.Maps.Globals.defaultTileSize = 128;

        navigator.geolocation.getCurrentPosition(setCurrentPosition, this.onGeolocationFail, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

        $("#directions").show(400, function(){
            $('.ui-page-active').animate({
                scrollTop: $("#directions").offset().top - 60
            }, 200);
        });

        
        function setCurrentPosition(position){
            view.map = new Microsoft.Maps.Map(document.getElementById('map'), {
                credentials: 'AnphN55HyePqcTNLsB-K9dd2uiKUSmNmijZycDDIJqMVXQsMS_hwLc5FLZPFZ38X',
                center: new  Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude),
                zoom: 6
            });
            $("#directions").addClass("loading");
            view.currentPosition = position;
            view.createDirections();
        }


    },


    onGeolocationFail: function(){
        app.notificationModel.set({
            "type" : "error",
            "message" : app.strings.get(app.config.get("currentLanguage")).error06,
            "title" : app.strings.get(app.config.get("currentLanguage")).title06,
            "showButtons" : false,
            "context" : "geolocation",
            "data" : {},
            "displayTime" : 10000
        });


        $("#directions").hide(200);


        app.notificationModel.trigger("update");
    },



    toggleFullscreen: function(e){
        if ($("body").hasClass("fullscreen-map")){
            $("#map").css("height", this.defaultMapHeight);
        }
        else{
            this.defaultMapHeight = $("#map").outerHeight();
            $("#map").css("height", $.mobile.getScreenHeight());
        }

        $("#map-fullscreen-toggle").toggleClass("ui-icon-expand").toggleClass("ui-icon-compress");
        $("body").toggleClass("fullscreen-map");
        $("#directions").toggleClass("fullscreen-map");


        $('.ui-page-active').animate({
            scrollTop: $("#directions").offset().top - 60
        }, 0);
    },






    closeItinerary: function(){
        $( "#itinerary-panel" ).panel("close");
    },

    toggleItinerary: function(){
        $( "#itinerary-panel" ).one( "panelbeforeopen", function( event, ui ) {
            $("#itinerary-panel").css("height", $("body").height())
        } );

        $( "#itinerary-panel" ).one( "click", function( event, ui ) {
            $( "#itinerary-panel" ).panel("close");
        } );

        $( "#itinerary-panel" ).panel("open");

    },

    beforeClose: function(){
        document.removeEventListener("backbutton", this.backButtonMap, false);
    }




});