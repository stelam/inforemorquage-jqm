window.EditCarPage = Backbone.View.extend({

    initialize:function () {
    	_.bindAll(this,"validate");
    	_.bindAll(this,"processKey");
        this.template = _.template(tpl.get('edit-car'));
        this.imageURI = "";
        this.listenTo(app.eventBus, 'headerRightButton', this.validate);

        this.listenTo(app.eventBus, 'showkeyboard', this.onShowKeyboard);

        this.model.bind('invalid', this.displayErrors);
        this.model.bind('valid', this.saveEntry);

        this.isNewCar = false;
        this.flagNewCar();
    },

    events: function(){
    	return {
	    	'click .camera-control' : 'capturePhoto',
	    	'click #car-image' : 'capturePhoto',
	    	'click .browse-photo' : 'browsePhoto',
	    	'keyup': 'processKey'
	    }
    },

    render:function (eventName) {
    	
    	app.headerModel.set({
    		'css_classes' : 'none no-menu', 
    		'right_button_label' : 'Enregistrer', 
    		'right_button_icon' : 'check',
    		'title' : this.getTitle(),
    		'left_button_override' : null
    	});

        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    attributes: function(){
    	return {
    		'id': "edit-car-page"
    	};
    },

	processKey: function(e) { 
		if(e.which === 13){ // enter key
			if ($(':focus').attr("id") == "name"){
				// On utilise un fake focus sinon le clavier disparaît sous iOS
				if (typeof device == "undefined" || device.platform != "iOS")
					$("#registration_number").focus();
			}
			else if ($(':focus').attr("id") == "registration_number")
				this.validate();
		}
	},

    flagNewCar: function(){
    	if (typeof this.model.id == "undefined")
    		this.isNewCar = true;
    	else
    		this.isNewCar = false;
    },


	/***************
	* Lancer la caméra de l'appareil
	***************/
	capturePhoto: function(){
		navigator.camera.getPicture(_.bind(this.displayNewPhoto, this), this.onPhotoFail, { 
			quality: 50, 
	        destinationType: Camera.DestinationType.FILE_URI,
	        targetWidth: 250,
	        targetHeight: 250
	    }); 
	},

	/***************
	* Retourne le titre que devrait avoir la page
	***************/
	getTitle: function(){
		return (typeof this.model.id == "undefined") ? "Ajout d'un véhicule" : "Modification de " + this.model.get("name")
	},


	/***************
	* Naviguer à travers le système de fichiers pour
	* trouver une photo existante
	***************/
	browsePhoto: function() {

		// Retrieve image file location from specified source
		navigator.camera.getPicture(_.bind(this.displayNewPhoto, this), this.onPhotoFail, { 
			quality: 50,
			destinationType: navigator.camera.DestinationType.FILE_URI,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
	        targetWidth: 250,
	        targetHeight: 250
		});

	},


	/***************
	* Affiche une image nouvellement capturée ou choisie
	***************/
	displayNewPhoto: function(imageURI) {
		if (device.platform != "windows" && device.platform != "windows8"){
			this.$("#car-image").css("background-image", "url("+imageURI+")");
			this.model.set({"photoUrl" : imageURI});
		} else {

		    var src = (encodeURI(imageURI));
		    var $img = $("<img/>")
		    $img.attr("src", imageURI);
		    //$("body").prepend($img);
		    $("#car-image").css("background-image", "none").html("").append($img);
			this.model.set({"photoUrl" : imageURI});
		}
	},


	/***************
	* Affichage d'une erreur si la sélection de la photo a échoué
	***************/
	onPhotoFail: function(message) {
		console.log ('Failed because: ' + message);
	},



	/***************
	* Valider les informations entrées par l'utilisateur
	***************/
	validate: function(){
		this.$(".error").removeClass("error");

		this.model.set({
			name : this.$("#name").val(),
			registration_number: this.$("#registration_number").val()
		});


		if (this.model.isValid())
			this.saveEntry();

	},

	displayErrors: function(model){
		var message = "";

		// On remet les anciens attributs
		model.set(model.previousAttributes());

		for (var i = 0; i < model.validationError.length; i++){
			$("#" + model.validationError[i].field).addClass("error");
			message += model.validationError[i].msg + "<br/>";
		}

    	app.notificationModel.set({
    		"type" : "error",
    		"message" : message,
    		"title" : "Erreur :(",
    		"showButtons" : false
    	});
    	app.notificationModel.trigger('update');
	},

	/***************
	* Affiche les erreurs de validation
	***************/
	onValidationErrors: function(){
		// notifier l'erreur
    	app.notificationModel.set({
    		"type" : "error",
    		"message" : "Veuillez vérifier les champs erronnés.",
    		"title" : "Erreur :(",
    		"showButtons" : false
    	});
    	app.notificationModel.trigger('update');



	},

	/***************
	* L'utilisateur a confirmé l'ajout ou la modification
	* du véhicule. Enregistrement des informations
	***************/
	saveEntry: function(){
		var photoUrl = this.model.get("photoUrl");
		var thisCar = this.model;
		var view = this;
		var photoFileName = "";

		// Sauvegarde de la photo en mode persistance
		if (this.model.get("photoUrl") != "" && this.model.get("photoUrl").indexOf("car") < 0){
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
				window.resolveLocalFileSystemURL(photoUrl, function(entry) {
					var d = new Date();
					var n = d.getTime();
					var e = ".jpg";
					var fileName = n + e;
					
					fileSys.root.getDirectory('info-remorquage', {create: true}, function(dir) {
					
						entry.copyTo(dir, fileName, function(movedEntry) {
							console.log("File moved");
							photoUrl = dir.toNativeURL() + "/" + fileName;
							photoFileName = fileName;
							saveCarData();

						}, function(error) { 
							console.log('copyTo fail (' + error.code + '): ');
						});
					
					});
				});
			});
		}
		else{
			saveCarData();
		}





		// Sauvegarder les informations du véhicule en
		// localstorage
		function saveCarData(){
			thisCar.set({"name" : this.$("#name").val()});

			var sanitizedRegistrationNumber = this.$("#registration_number").val().replace(/[\. ,:-]+/g, "");
			app.cars.add(thisCar);
			thisCar.save({
				"registration_number" : sanitizedRegistrationNumber,
				"photoUrl" : photoUrl,
				"photoFileName" : photoFileName,
				"status" : 1
			});
		


			// Notifier l'utilisateur de la création et lui
			// demander s'il veut ajouter un autre véhicule
			if (view.isNewCar){
	        	app.notification.display({
	        		"type" : "success",
	        		"message" : "Aimeriez-vous ajouter un autre véhicule ?",
	        		"title" : "Votre véhicule a été ajouté.",
	        		"showButtons" : true,
	        		"callback" : app.router.navigateToAddCar
	        	});
	        } else{
	        	app.notification.display({
	        		"type" : "success",
	        		"message" : "Votre voiture a été modifiée.",
	        		"title" : "Modification de " + thisCar.get("name"),
	        		"showButtons" : false
	        	});
	        }

        	// Aller au Dashboard
        	app.router.navigate("dashboard", {trigger: true});
		}


	},


	onShowKeyboard: function(e) {
		var $focused = $(':focus');
		var pageScroll = ($('.ui-page-active').scrollTop());
        $('.ui-page-active').animate({
            scrollTop: pageScroll + $focused.offset().top
        }, 200);
	}







});
