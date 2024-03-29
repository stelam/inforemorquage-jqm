/**
 * @class ConfigView
 *
 * Vue pour les configurations-utilisateur de l'application
 *
 * @namespace window.ConfigView
 * @extends Backbone.View
 */
window.ConfigView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('config'));
        this.listenTo(app.eventBus, 'headerRightButton', this.saveConfig);
    },

    events: function(){
        return {
            "click #btn-generate-cars" : "generateCarsRequest",
            "click #btn-wipe-cars" : "wipeCarsRequest"
        }
    },

    render: function (eventName) {
        //this.$el.html(this.template(this.model.toJSON()));

        app.headerModel.set({
            'css_classes' : 'no-menu', 
            'right_button_label' : 'Sauvegarder', 
            'right_button_icon' : 'check',
            'title' : 'Configuration',
            'left_button_override' : null
        });

        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },


    saveConfig: function(){
        this.model.save({
            currentLanguage : $('input[name=language]:checked').val(),
            towingTimeLookBack: $("#towed-status-time").val(),
            vibrateOnCarTowed: $("#vibration").prop("checked")
        })

        app.notification.display({
            "type" : "success",
            "message" : "Vos paramètres ont été sauvegardés.",
            "title" : "Configuration",
            "showButtons" : false,
            "displayTime" : 4000
        });

        window.history.back();

    },

    generateCarsRequest: function(){
        app.cars.seed();
        app.notification.display({
            "type" : "success",
            "message" : "Cinq voitures ont été ajoutées.",
            "title" : "Ajout de véhicules",
            "showButtons" : false,
            "callback" : null
        });
    },

    wipeCarsRequest: function(){
        app.notification.display({
            "type" : "warning",
            "message" : "Êtes vous certain de vouloir effacer toutes les données des véhicules ?",
            "title" : "Suppression des véhicules",
            "showButtons" : true,
            "callback" : app.cars.wipe
        });
    }






});