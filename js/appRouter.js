
/***************
* Routes
***************/
var AppRouter = Backbone.Router.extend({

    routes:{
        "":"dashboard",
        "cars/add":"addCar",
        "cars/:id":"carDetails",
        "cars/:id/edit":"editCar",
        "cars/:id/complaint" : "complaint",
        "cars/:id/complaint/info" : "complaintInfo",
        "dashboard":"dashboard",
        "first-use":"firstUse",
        "dashboard/refresh": "dashboardRefresh",
        "app/configuration" : "config"
        
    },

    initialize:function () {

        this.firstPage = true;
        //this.searchResults = new EmployeeCollection();

        this.firstUseSeen = false;


        // sauvegarde de l'historique
        // car backbone ne le fait pas automatiquement
        this.history = [];
        this.listenTo(this, 'route', function (name, args) {
            this.history.push({
                name : name,
                args : args,
                fragment : Backbone.history.fragment
            });
        });

    },




    dashboard: function(id){
        // Vérifier s'il s'agit de la première utilisation de l'application
        // en regardant s'il y a moins d'une voiture d'enregistrée
        if (app.cars.length == 0){
            this.navigate("first-use", {trigger: true});
            return false;
        }


        this.changePage(new DashboardView({model: app.cars}), "car-list");
        //self.changePage(new DashboardView(), "car-list");

    },


    dashboardRefresh: function(){
        app.cars.updateCarsStatus();
        return false;
    },

    directReports:function (id) {
        var employee = new Employee({id:id});
        employee.reports.fetch();
        this.changePage(new DirectReportPage({model:employee.reports}), "none");
    },


    addCar:function (id) {
        var carModel = new CarModel();
        this.changePage(new EditCarPage({model: carModel}), "none");
    },

    editCar:function (id) {
        car = app.cars.get(id);
        var self = this;
        car.fetch({
            success:function (data) {
                self.changePage(new EditCarPage({model:data}), "none");
            }
        });
    },

    carDetails:function (id) {
        car = app.cars.get(id);
        var self = this;
        car.fetch({
            success:function (data) {
                self.changePage(new CarDetailsView({model:data}), "none");
            }
        });
    },

    complaint: function(id){
        car = app.cars.get(id);
        complaintModel = new ComplaintModel();
        complaintModel.set({car: car});

        this.changePage(new SendComplaintView({model: complaintModel}), "none")
    },

    complaintInfo: function(id){
        car = app.cars.get(id);

        this.changePage(new ComplaintInfoView({model: car}), "none")
    },

    firstUse:function (id) {
        this.firstUseSeen = true;
        this.changePage(new FirstUsePage(), "none");
    },

    config: function(){
        console.log(app.config);
        this.changePage(new ConfigView({model: app.config}), "none");
    },


    navigateToAddCar: function(){
        app.router.navigate("cars/add", {trigger: true});
    },

    changePage:function (page, bottomNavItem) {
        // Preventing ghost views
        if (this.currentView){
            this.currentView.close();
        }

        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));

        var transition = "slidefade";


        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }

        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
        //app.appState.set({ bottomNavItem: bottomNavItem,  });


        this.currentView = page;
        return page;

    }

});
