/**
 * @class HeaderModel
 *
 * Modèle pour le header des pages
 *
 * @namespace window.HeaderModel
 * @extends Backbone.Model
 */
window.AppStringsModel = Backbone.Model.extend({
    defaults: {
        french:{
            error01:"Le véhicule doit comporter un nom.",
            error02:"Le numéro de plaque d'immatriculation ne peut être vide.",
            error03:"Le numéro de plaque d'immatriculation est invalide.",
            error04:"Le numéro de plaque d'immatriculation doit comporter entre 3 et 8 caractères.",
            error05:"Le statut de votre véhicule n'a pas pu être retrouvé. Veuillez vérifier votre accès à l'Internet.",
            error06:"Une erreur est survenue lors de la gélocalisation. Veuillez vous assurer que cette fonctionnalité est activée sur votre appareil.",
            error07:"Le corps du message ne peut pas être vide",

            title06:"Erreur de géolocalisation",

            info01:"Êtes-vous certain de vouloir supprimer ce véhicule?",
            info02:"Le véhicule a été supprimé avec succès.",

            months: {
                "01" : "Janvier",
                "02" : "Février",
                "03" : "Mars",
                "04" : "Avril",
                "05" : "Mai",
                "06" : "Juin",
                "07" : "Juillet",
                "08" : "Août",
                "09" : "Septembre",
                "10" : "Octobre",
                "11" : "Novembre",
                "12" : "Décembre"
            }


        },
        english:{
            error01:"The car must have a name.",
            error02:"Le numéro de plaque d'immatriculation ne peut être vide.",
            error03:"Le numéro de plaque d'immatriculation est invalide.",


            months: {
                "01" : "January",
                "02" : "February",
                "03" : "March",
                "03" : "April",
                "04" : "May",
                "05" : "June",
                "06" : "July",
                "07" : "August",
                "08" : "September",
                "09" : "October",
                "11" : "November",
                "12" : "December"
            }
        }
    },

    initialize:function () {
        
    }

});

