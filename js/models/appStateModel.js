/**
 * @class AppState
 *
 * Modèle qui gère les états de l'application, notamment afin de réduire
 * le couplage entre certaines vues
 *
 * @namespace window.AppState
 * @extends Backbone.Model
 */
window.AppState = Backbone.Model.extend({

    initialize:function () {
        _.bindAll(this, 'onOffline');
        _.bindAll(this, 'onOnline');
        _.bindAll(this, 'onKeyboardShow');
        _.bindAll(this, 'onKeyboardHide');

        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);
        document.addEventListener("resume", this.onResume, false);

        document.addEventListener('hidekeyboard', this.onKeyboardHide, false);
        document.addEventListener('showkeyboard', this.onKeyboardShow, false);

        this.set({"online" : false});
        this.set({"offlineJobsChecked" : false})

    },


    defaults: {
        config : {
            serviceEmailAddress: "stelam@gmail.com",
            serviceProxy: "www.corsproxy.com/"
        },

        online: false
    },

    isMobile: function(){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return true;
		} 
		else {
			return false;
		}
    },


    onOffline: function(){
        // Envoyer l'événement seulement si il y a eu un changement de statut
        if (this.get("online") != false){
            this.set({"online" : false});
            app.eventBus.trigger('appOffline');
        }
    },


    onOnline: function(){
        // Envoyer l'événement seulement si il y a eu un changement de statut
        if (this.get("online") != true){
            this.set({"online" : true});
            app.eventBus.trigger('appOnline');
            this.checkOfflineJobs();
        }

    },

    onKeyboardShow: function(){
        app.eventBus.trigger('showkeyboard');
    },

    onKeyboardHide: function(){
        app.eventBus.trigger('hidekeyboard');
    },

    isOnline: function(){
        return this.get("online");
    },

    checkOfflineJobs: function(){
        // placé ici temporairement, faudrait faire une classe qui s'occupe 
        // exclusivement de lancer la file de jobs à faire 
        if (this.isOnline()){
            app.complaints.requestSendOfflineComplaint();
        }

    },

    getCurrentLanguage: function(){
        return this.get("config").currentLanguage;
    },


    onResume: function(){
        app.eventBus.trigger('appResume');
        this.checkOfflineJobs();
    }


});


