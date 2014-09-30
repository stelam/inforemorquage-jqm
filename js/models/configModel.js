/**
 * @class ConfigModel
 *
 * Modèle qui gère les les configurations de l'utilisateur
 *
 * @namespace window.AppState
 * @extends Backbone.Model
 */
window.ConfigModel = Backbone.Model.extend({

    initialize:function () {
        
    },


    defaults: {
        currentLanguage : "french",
        towingTimeLookBack: 2,
        vibrateOnCarTowed: false

    },



    getCurrentLanguage: function(){
        return this.get("config").currentLanguage;
    }


	


});





/***************
* Collection
***************/
window.ConfigCollection = Backbone.Collection.extend({

    model:ConfigModel,
    localStorage: new Store("config")

});