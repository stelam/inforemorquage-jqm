/**
 * @class ComplaintModel
 *
 * Modèle pour les plaintes
 *
 * @namespace window.ComplaintModel
 * @extends Backbone.Model
 */
window.ComplaintModel = Backbone.Model.extend({
    defaults: {
        /**
         * Le titre de la complaintte
         *
         * @type {String}
         */
        title: 'Info-Remorquage',

        /**
         * Le message de la plainte
         *
         * @type {String}
         */
        message: '',

        /**
         * L'adresse email du destinateur de la plainte
         *
         * @type {String}
         */
        senderEmail: '',

        /**
         * Les photos attachées à la plainte
         *
         * @type {Array}
         */
        photos: []
        
    },

    initialize:function () {
        // Implémente les méthodes de sauvegarde de photos
        _.extend(this, PhotoMixins);  

        _.bindAll(this,"sendEmail");

        _.bindAll(this,"saveBrowsedPhoto");

    },


    validate: function(attrs){
        var errors = [];

        /*
        * Validation du nom du véhicule
        */
        if (!attrs.message) {
            errors.push({
                field: 'message',
                msg: app.strings.get(app.config.get("currentLanguage")).error07
            });
        }

        if (errors.length > 0)
            return errors;
    },

    sendEmail: function(){
        var registration_number = this.get("car").get("registration_number").toUpperCase();

        window.plugin.email.open({
            to:      [app.appState.get("config").serviceEmailAddress],
            subject: "Dommages causés par le remorquage du véhicule portant l'immatriculation [" + registration_number + "]",
            body:    this.get("message"),
            attachments: this.get("photos")
        }, this.onEmailSent);
    },


    /*
    * Prépare la plainte pour une sauvegarde
    * offline
    */
    prepareOffline: function(){
        var model = this;

        // Sauvegarde de la photo en persistence (s'il y en a une)
        if (this.get("photos").length > 0){
            this.savePhotoToPersistent(this.get("photos")[0], onPhotSaved);
        }
        else{
            model.trigger("readyForOfflineSave")
        }

        // Callback lorsque la photo est sauvegardée
        function onPhotSaved(dir, filename){
            model.set({"photos" : [dir.toNativeURL() + "/" + filename]});
            model.trigger("readyForOfflineSave");
        }
    },

    /*
    * Enregistre une copie de la photo sélectionnée en mémoire pour
    * pouvoir l'envoyer par email
    * 
    */
    saveBrowsedPhoto: function(imageURI){
        var model = this;
        this.savePhotoToPersistent(imageURI, onPhotSaved);

        // Callback lorsque la photo est sauvegardée
        function onPhotSaved(dir, filename){
            model.set({"photos" : [dir.toNativeURL() + "/" + filename]});
            model.trigger("browsedPhotoSaved");
        }
    },


    /*
    * Affichage d'un message une fois que le email a été envoyé
    * et retour à l'accueil
    *
    * On ne peut pas vraiment confirmer à l'utilisateur que le message a été envoyé, car
    * les callback du plugin de phonegap ne distingue pas un email envoyé d'un email annulé sur le callback
    */
    onEmailSent: function(emailClientResponse){
        app.notification.display({
            "type" : "success",
            "message" : "Nous vous répondrons dans les plus brefs délais après la réception de votre courriel.",
            "title" : "Merci",
            "showButtons" : false,
            "displayTime" : 3000
        });

        app.router.navigate("/", {trigger: true});
    },


    parse: function(response) {
        return _.extend({}, response, {
            car: new CarModel(response.car)
        });
    },




});




/***************
* Collection
***************/
window.ComplaintCollection = Backbone.Collection.extend({


    model:ComplaintModel,
    localStorage: new Store("complaintts"),

    initialize : function(){
        // Observe les moments où l'application regagne l'accès à l'internet
        //this.listenTo(app.eventBus, 'appOnline', this.requestSendOfflineComplaint);

        this.listenTo(app.eventBus, 'notificationLeftButton', this.onNotificationLeftButton);

        _.bindAll(this,"sendEmail");

    },


    /*
    * Avertit l'utilisateur qu'il y a une plainte
    * à être envoyée, et lui demande s'il veut lenvoyer
    * tout de suite (maintenant qu'il a accès à l'internet)
    */
    requestSendOfflineComplaint: function(){
        this.fetch();
        if (this.models.length > 0 && app.notification != null){
            app.notification.display({
                "type" : "info",
                "message" : "Votre plainte n'a pas pu être envoyée lors de la dernière tentative en raison de problèmes de connectivité. \n Aimeriez-vous l'envoyer maintenant ?",
                "title" : "Plainte pour dommage",
                "showButtons" : true,
                "displayTime" : 12000,
                "callback" : this.sendEmail
            });
        }
    },


    sendEmail: function(){
        if (app.appState.isOnline()) {
            this.models[0].sendEmail();
            this.empty();
        } else{
            this.requestSendOfflineComplaint();
        }
    },

    empty: function(){
        var length = this.length; for (var i = length - 1; i >= 0; i--) { this.at(i).destroy(); }
    }


});