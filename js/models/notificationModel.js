/**
 * @class NotificationModel
 *
 * Modèle pour les notifications de l'application
 *
 * @namespace window.NotificationModel
 * @extends Backbone.Model
 */
window.NotificationModel = Backbone.Model.extend({

    initialize:function () {
    },


    defaults: {
       /**
         * Le titre de notification. Peut avoir ces valeurs :
         * error
         * success
         * info (pas encore implémenté)
         * warning (pas encore implémenté)
         *
         * @type {String}
         */
        type: "success",


       /**
         * Le corps du message de la notification
         *
         * @type {String}
         */
        message: "",

       /**
         * Le contexte de la notification, dans le cas où
         * on aurait besoin de discriminer plusieurs notifications
         *
         * @type {String}
         */
        context: "",

       /**
         * On objet de data qu'on aurait besoin de passer aux observateurs
         *
         * @type {Object}
         */
        data: {},

       /**
         * Le titre affiché pour la notification
         *
         * @type {String}
         */
        title: "",

       /**
         * L'icône utilisé pour la notification
         *
         * @type {String}
         */
        icon: "",


       /**
         * Le temps d'affichage de la notification en millisecondes
         *
         * @type {Integer}
         */ 
        displayTime: 5000,

       /**
         * True : les boutons sont affichés
         * False : les boutons ne sont pas affichés
         *
         * @type {Boolean}
         */
        showButtons: false,

       /**
         * Le label pour le bouton de gauche
         *
         * @type {String}
         */
        leftButtonLabel : "oui",

       /**
         * Le label pour le bouton de droite
         *
         * @type {String}
         */
        rightButtonLabel : "non",


       /**
         * La méthode à appeler pour le callback lors de l'appuie du bouton de gauche
         *
         * @type {Function}
         */
        callBack : null

    },

    setIcon: function(){
        switch(this.get("type")) {
            case "success":
                this.set({icon : "check"});
                break;
            case "error":
                this.set({icon : "alert"});
                break;
            case "info":
                this.set({icon : "alert"});
                break;
            case "warning":
                this.set({icon : "alert"});
                break;
            default:
                this.set({icon : "check"});
        }
    },

    /*
    * Affiche le popup
    */
    display: function(options){

        this.reset();

        this.set(options);

        this.trigger("update");
    },


    /*
    * Réinitialise quelques propriétés génériques
    */
    reset: function(){
        this.set({
            "callback" : null,
            "displayTime" : 5000,
            "context" : null,
            "data" : {}
        })
    }




});

