/*  
/   Objet qui permet d'inclure des templates dans des fichiers séparés 
/   Source : https://github.com/ccoenraets/backbone-directory/tree/master/jquerymobile
*/


tpl = {

    // Hash of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {
        var that = this;
        var tplFolder = (typeof unitTesting == "undefined") ? 'tpl/' : '/tpl/';

        var loadTemplate = function (index) {
            var name = names[index];
            $.get(tplFolder + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};





