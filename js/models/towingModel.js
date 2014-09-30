/**
 * @class TowingModel
 *
 * Modèle pour un véhicule
 * appartient à carModel
 *
 * @namespace window.TowingModel
 * @extends Backbone.Model
 */
window.TowingModel = Backbone.Model.extend({


    initialize:function () {
        this.immatriculation = "",

        this.pickupPlace = {
            street: {
                type: "",
                name: "",
                orientation: ""
            },
            districtId: ""
        },

        this.pickupDate = {
            year: "",
            month: "",
            day: "",
            timeHour: "",
            timeMinute: ""
        },

        this.destination = {
            addressNumber : "",
            street : {
                type: "",
                name: ""
            }
        }
    },


    /*
    * Modélisé selon ce xml : 
    * http://servicesenligne.ville.montreal.qc.ca/sel/info/remorquage/ServletRechercheXML?param1=ABC123
    */

    setFromXml: function(xml){
        this.set({
            "pickupPlace" : {
                street : {
                    type: $(xml).find("lieuEnlevement").find("type").text(),
                    name: $(xml).find("lieuEnlevement").find("nom").find("nom").text(),
                    orientation: $(xml).find("lieuEnlevement").find("orient").text()
                }
            }
        });

        this.set({
            "pickupDate" : {
                year: $(xml).find("dateRemorquage").find("annee").text(),
                month: $(xml).find("dateRemorquage").find("mois").text(),
                day: $(xml).find("dateRemorquage").find("jour").text(),
                timeHour: $(xml).find("dateRemorquage").find("heureHre").text(),
                timeMinute: $(xml).find("dateRemorquage").find("heureMin").text()
            }
        });

        this.set({
            "destination" : {
                addressNumber: $(xml).find("lieuRemorquage").find("noCivique").text(),
                street: {
                    type: $(xml).find("lieuRemorquage").find("type").text(),
                    name: $(xml).find("lieuRemorquage").find("nom").find("nom").text()
                }
            }

        });

    },


    dateString: function(){
        return this.pickupDate.year+this.pickupDate.month+this.pickupDate.day+this.pickupDate.timeHour+this.pickupDate.timeMinute;
    },


    dateObject: function(){
        return new Date(this.get("pickupDate").year + "-" + this.get("pickupDate").month + "-" + this.get("pickupDate").day);
    }

    

});



/***************
* Collection
***************/
window.TowingCollection = Backbone.Collection.extend({
    model:TowingModel,
    localStorage: new Store("towings"),

});

// Ajoute un nouveau towing, en vérifiant
// avant si le towing existe déjà dans la collection
TowingCollection.prototype.add = function(towing) {
    // Using isDupe routine from @Bill Eisenhauer's answer
    var isDupe = this.any(function(_towing) {

        if (_towing.get("immatriculation") === towing.get("immatriculation") 
            && JSON.stringify(_towing.get("pickupDate")) === JSON.stringify(towing.get("pickupDate"))){
            
            return true
        }
        
        return false;
    });


    // Up to you either return false or throw an exception or silently ignore
    // NOTE: DEFAULT functionality of adding duplicate to collection is to IGNORE and RETURN. Returning false here is unexpected. ALSO, this doesn't support the merge: true flag.
    // Return result of prototype.add to ensure default functionality of .add is maintained. 
    return isDupe ? false : Backbone.Collection.prototype.add.call(this, towing)
}