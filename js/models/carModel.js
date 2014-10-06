/**
 * @class CarModel
 *
 * Modèle pour un véhicule
 * définit aussi les relations avec ses remorquages (1:n)
 *
 * @namespace window.CarModel
 * @extends Backbone.Model
 */
window.CarModel = Backbone.Model.extend({

    initialize:function () {
        this.set('towings', new TowingCollection);
        _.bindAll(this,"towingInPeriod");
        _.bindAll(this,"getLastTowing");

        this.get("towings").fetch();
        
    },
    defaults: {
    	name: '',
    	registration_number: '',
    	photoUrl: '',
        status: '',
        statusString: 'Chargement...',
        loaded: false
    },


    validate: function (attrs) {
        var errors = [];
        /*
        * Validation du nom du véhicule
        */
        if (!attrs.name) {
            errors.push({
                field: 'name',
                msg: app.strings.get(app.config.get("currentLanguage")).error01
            });
        }


        /*
        * Validation du numéro d'immatriculation
        */
        if (!attrs.registration_number) {
            errors.push({
                field: 'registration_number',
                msg: app.strings.get(app.config.get("currentLanguage")).error02
            });
        } else{
            var regex = /^[\w\-\s]+$/; //alphanumérique avec espaces
            if (!attrs.registration_number.match(regex)){
                errors.push({
                    field: 'registration_number',
                    msg: app.strings.get(app.config.get("currentLanguage")).error03
                });
            }
            
            // de 3 à 8 caractères
            else if (attrs.registration_number.length < 3 || attrs.registration_number.length > 8){ 
                errors.push({
                    field: 'registration_number',
                    msg: app.strings.get(app.config.get("currentLanguage")).error04
                });
            }
        }

        
        if (errors.length > 0)
            return errors;
    },

    updateStatus: function(){
        var car = this;

        // On utilise un proxy si ce n'est pas sur mobile, pour contourner le CORS
        var serviceProxy = (app.appState.isMobile()) ? "" : app.appState.get("config").serviceProxy;

        $.ajax({
            type: "GET",
            url: "http://"+serviceProxy+"servicesenligne.ville.montreal.qc.ca/sel/info/remorquage/ServletRechercheXML?param1="+car.get("registration_number"),
            dataType: "xml",
            crossDomain: true,
            success: onDataReceived,
            error: onAjaxError
        });


        car.set({statusString : "Chargement...", loaded: false});
        car.trigger("update");


        function onDataReceived(xml){
            if ($(xml).find("statutReponse").text() == 1){
                car.setNoTowed();
            } 

            // Si la voiture est remorquée
            else {

                var towing = new TowingModel();
                towing.set({immatriculation : car.get("registration_number")});
                towing.setFromXml(xml);



                var towings = car.get("towings");

                if (towings.add(towing))
                    towing.save();


                if (car.towingInPeriod()){
                    car.setTowed();
                } else{
                    car.setNoTowed();
                }
            }
            car.trigger("update");


        }

        function onAjaxError(error){
            car.save({
                loaded: true,
                statusString: "Erreur de chargement",
                status: 1
            });
            app.notificationModel.set({
                "type" : "error",
                "message" : app.strings.get(app.config.get("currentLanguage")).error05,
                "title" : "Erreur :(",
                "showButtons" : false
            });
            app.notificationModel.trigger('update');
            car.trigger("update");
        }
    },

    parse: function(response) {
        return _.extend({}, response, {
            towings: new TowingCollection(response.towings)
        });
    },


    getTowingDestinationAddress: function(){
        var towing = this.getLastTowing();
        return towing.get("destination").addressNumber + " " + towing.get("destination").street.type + " " + towing.get("destination").street.name;
    },


    // on regarde si le remorquage s'est effectué dans la période
    // de temps voulu (selon la configuration settée par l'utilisateur)
    towingInPeriod: function(){
        var maxPastDate = new Date();
        maxPastDate = addMonths(maxPastDate, -app.config.get("towingTimeLookBack") - 1);

        return (this.getLastTowing().dateObject() > maxPastDate);

        function addMonths(date, months) {
            date.setMonth(date.getMonth() + months);
            return date;
        }
    },


    setNoTowed: function(){
        this.save({
            statusString: "Non remorqué",
            loaded: true,
            status: 1
        })
    },


    setTowed: function(){
        var statusString = "Remorqué le ";
        var towing = this.getLastTowing();
        statusString += towing.get("pickupDate").day;
        statusString += " " + app.strings.get(app.config.get("currentLanguage")).months[towing.get("pickupDate").month];
        statusString += " " + towing.get("pickupDate").year;
        this.save({
            statusString: statusString,
            loaded: true,
            status: 0
        })
    },


    getLastTowing: function(){
        var thisImmatriculationTowings = this.get("towings").where({immatriculation: this.get("registration_number")});

        return thisImmatriculationTowings[thisImmatriculationTowings.length -1];
    },


    serializeForTemplate: function() {
        var c = this.toJSON();
        c.towing = this.getLastTowing();
        return c;
    }


});




/***************
* Collection
***************/
window.CarCollection = Backbone.Collection.extend({

    model:CarModel,
    localStorage: new Store("cars"),

    initialize: function(){
        _.bindAll(this,"wipe");
        _.bindAll(this,"seed");
    },

    updateCarsStatus: function(){
        for(var i=0; i<this.length; i++) {
            var car = this.models[i];
            car.updateStatus();
        }
    },


    wipe: function(){
        var length = this.length; for (var i = length - 1; i >= 0; i--) { 
            var towings = app.cars.at(i).get("towings");

            var length2 = towings.length; for (var j = length2 - 1; j >= 0; j--){
                towings.at(j).destroy();
            }
            app.cars.at(i).destroy(); 
        }

        var ts = new TowingCollection(); ts.fetch(); var length = ts.length; for (var i = length - 1; i >= 0; i--) { ts.at(i).destroy(); }
    },



    seed: function(){
        var regs = [
            "326GVC",
            "M25BFZ",
            "191SAQ",
            "151FXJ",
            "S63AVB",
            "P01BLJ",
            "H36CSA",
            "Z13EZG",
            "715ZAV",
            "068LWZ",
            "W50AXJ",
            "263VQJ",
            "303XXA",
            "KFX935"
        ];

        var names = [
            "Suzuki Optimistic",
            "Chrysler Overwhelmed",
            "Mercury Undesirable",
            "Ferrari Economic",
            "Mitsubishi Snuggled",
            "GMC Unusual",
            "Suzuki Lackadaisical",
            "Nissan Absent-Minded",
            "GM Endearing",
            "Eagle Aberrant",
            "Hyundai Recondite"
        ]


        for (var i = 0; i < 5; i++) {
            var randomIndex = Math.floor(Math.random() * 13);
            var randomIndex2 = Math.floor(Math.random() * 10);
            var randomIndex3 = Math.floor(Math.random() * 10 + 1);
            var thisPhotoFileName = (randomIndex3 < 10) ? "car-0" + randomIndex3 + ".jpg" : "car-" + randomIndex3 + ".jpg";

            var car = new CarModel();
            car.set({name : names[randomIndex2]});
            this.add(car);
            car.save({
                registration_number : regs[randomIndex],
                photoUrl : "photos/" + thisPhotoFileName,
                photoFileName : thisPhotoFileName,
                status: 1,
                towings: new TowingCollection()
            })

        }



    }

});