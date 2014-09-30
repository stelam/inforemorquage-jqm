

describe("AppRouter routes", function() {
    appRouter = new AppRouter();


    beforeEach(function(done) {
        this.routeSpy = sinon.spy();

        tpl.loadTemplates(app.templateList, function(){                                                

            try {
                Backbone.history.start({silent:true, pushState:true});
            } catch(e) {}

            appRouter.navigate("elsewhere");
            done();
        })
    });

    afterEach(function() { 
        appRouter.navigate("/tests/jasmine/SpecRunner.html");
    });


    it("fires the dashboard route with a blank hash", function(done) {
        var car = new CarModel();
        car.set({name: "Civic",registration_number: "1Z1Z1"});
        app.cars.add(car);
        car.save();

        appRouter.bind("route:dashboard", this.routeSpy);
        appRouter.navigate("", true);
        expect(this.routeSpy).toHaveBeenCalledOnce();
        expect(this.routeSpy).toHaveBeenCalledWith();
        done();
    });


    it("fires the 'first-use' route when there is no saved car", function(done) {
        app.cars = new CarCollection();
        app.cars.fetch();
        var length = app.cars.length; for (var i = length - 1; i >= 0; i--) {app.cars.at(i).destroy();}
        appRouter = new AppRouter();

        appRouter.bind('route:firstUse', this.routeSpy);
        appRouter.navigate("", true);
        expect(this.routeSpy).toHaveBeenCalledOnce();
        expect(this.routeSpy).toHaveBeenCalledWith();

        done();
    });



});
