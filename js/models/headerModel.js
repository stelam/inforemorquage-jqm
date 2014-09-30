/**
 * @class HeaderModel
 *
 * Modèle pour le header des pages
 *
 * @namespace window.HeaderModel
 * @extends Backbone.Model
 */
window.HeaderModel = Backbone.Model.extend({
    defaults: {
        /**
         * Le titre affiché dans le header
         *
         * @type {String}
         */
        title: 'Info-Remorquage',

        /**
         * Des classes css à ajouter pour le container du header
         * Ajouter à "hidden" si on veut cacher le header
         * dans un contexte donné.
         *
         * @type {String}
         */
        css_classes: '',

        /**
         * Le label du bouton situé à droite du header
         *
         * @type {String}
         */
        right_button_label: 'Continuer',

        /**
         * L'icône à utiliser pour le bouton de droite
         * http://api.jquerymobile.com/icons/
         *
         * @type {String}
         */
        right_button_icon: 'check',


        /**
         * L'icône à utiliser pour le bouton de gauche (back)
         * http://api.jquerymobile.com/icons/
         *
         * @type {String}
         */
        left_button_icon: 'carat-l',


        /**
         * Si on veut exécuter une méthode autre que back
         *
         * @type {Function}
         */
        left_button_override: null,

        /**
         * Du data qu'on voudrait passer au header
         *
         * @type {Object}
         */
        data: {}
        
    },

    initialize:function () {
        
    }

});

