window.SendComplaintView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('send-complaint'));
        this.model.bind('readyForOfflineSave', this.saveEntryForOffline, this);
        this.model.bind('browsedPhotoSaved', this.onBrowsedPhotoSaved, this);
        this.listenTo(app.eventBus, 'headerRightButton', this.validate);
        this.listenTo(app.eventBus, 'headerLeftButton', this.backButtonWarning);


        this.model.bind('invalid', this.displayErrors);

        _.bindAll(this,"backButtonWarning");
        _.bindAll(this,"onBrowsedPhotoSaved");
    },
	render: function(){
        app.headerModel.set({
            'css_classes' : 'none no-menu',  
            'right_button_icon' : 'mail',
            'right_button_label' : 'Envoyer',
            'title' : this.model.get("car").get("name") + " endommagé",
            'left_button_override' : this.backButtonWarning
        });

		this.$el.html(this.template(this.model.toJSON()));
		return this; // enable chained calls
	},

    events: function(){
        document.addEventListener("backbutton", this.backButtonWarning, false);

        return {
            'click .camera-control' : 'capturePhoto',
            'click .browse-photo' : 'browsePhoto'
        }
    },



    attributes: function() {

    	return {
    		
    	};
    },

    /*
    * Avertit l'utilisateur que son message ne sera
    * pas enregistré s'il revient en arrière
    */
    backButtonWarning: function(e){

        app.notification.display({
            "type" : "warning",
            "message" : "Votre message ne sera pas sauvegardé.",
            "title" : "Êtes-vous certain(e) de vouloir revenir en arrière ?",
            "showButtons" : true,
            "displayTime" : 7000,
            "callback" :  this.discard
        });
    },


    discard: function(){
        window.history.back();
    },


    /***************
    * Lancer la caméra de l'appareil
    ***************/
    capturePhoto: function(){
        navigator.camera.getPicture(_.bind(this.displayNewPhoto, this), this.onPhotoFail, { 
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 500,
            targetHeight: 500
        }); 
    },


    /***************
    * Naviguer à travers le système de fichiers pour
    * trouver une photo existante
    ***************/
    browsePhoto: function() {

        // Retrieve image file location from specified source
        navigator.camera.getPicture(_.bind(this.model.saveBrowsedPhoto, this), this.onPhotoFail, { 
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 500,
            targetHeight: 500
        });

    },

    /***************
    * Est appelée lorsque la photo browsée est sauvegardée
    ***************/
    onBrowsedPhotoSaved: function(){
        this.displayNewPhoto(this.model.get("photos")[0]);
    },

    /***************
    * Affichage d'une erreur si la sélection de la photo a échoué
    ***************/
    onPhotoFail: function(message) {
        console.log ('Failed because: ' + message);
    },


    /***************
    * Affiche une image nouvellement capturée ou choisie
    ***************/
    displayNewPhoto: function(imageURI) {
        var damagePhotos = [imageURI];
        this.$("#damage-image").attr("src", imageURI);
        this.model.set({"photos" : damagePhotos});
        this.$("#damage-image-container").removeClass("no-image")
    },


    /***************
    * Valider les informations entrées par l'utilisateur
    ***************/
    validate: function(){
        this.$(".error").removeClass("error");

        this.model.set({
            message : this.$("#message").val()
        });

        if (this.model.isValid())
            this.prepareComplaint();

    },


    displayErrors: function(model){
        var message = "";

        for (var i = 0; i < model.validationError.length; i++){
            $("#" + model.validationError[i].field).addClass("error");
            message += model.validationError[i].msg + "<br/>";
        }

        app.notification.display({
            "type" : "error",
            "message" : message,
            "title" : "Erreur :(",
            "showButtons" : false
        });
    },

    /***************
    * Prépare la plainte pour l'envoi par email
    * vérifie aussi que la fonctionnalité d'envoi d'email est bien disponible
    ***************/
    prepareComplaint: function(){

        if (app.appState.isOnline()) {
            this.model.sendEmail();
            //this.model.prepareOffline();
        }

        // Si l'appareil n'a pas accès à l'internet
        // on enregistre le message en mémoire
        // afin de recommencer l'essai une fois que
        // l'appareil aura regagner l'accès à l'internet
        else {
            this.model.prepareOffline();
        }
    },




    /***************
    * Cette méthode est appellée en callback
    * par le ComplaintModel une fois que ce dernier
    * devient prêt à être sauvegardé en mode offline
    ***************/
    saveEntryForOffline: function(){
        app.complaints.add(this.model);
        this.model.save();


        app.notificationModel.set({
            "type" : "info",
            "message" : "Votre appareil n'a présentement pas accès à l'internet. Votre message a été sauvegardé et l'application tentera d'envoyer le message à nouveau la prochaine fois qu'elle aura accès à l'internet.",
            "title" : "Pas d'accès à l'internet",
            "showButtons" : false,
            "displayTime" : 12000
        });
        app.notificationModel.trigger('update');
        window.history.back(-2);
    },


    beforeClose: function(){
        document.removeEventListener("backbutton", this.backButtonWarning);
    }

    

});


