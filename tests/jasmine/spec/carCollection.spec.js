describe('Car collection', function() {

    
    describe("when instantiated with model literal", function() {
        beforeEach(function() {
            this.carModelStub = sinon.stub(window, "CarModel");
            this.model = new Backbone.Model({
                id: 5, 
                name: "Civic"
            });
            this.carModelStub.returns(this.model);
            this.carCollection = new CarCollection();
            this.carCollection.model = CarModel; // reset model relationship to use stub
            this.carCollection.add({
                id: 5, 
                title: "Civic"
            });
        });

        afterEach(function() {
            this.carModelStub.restore();
        });

        it("should add a model", function() {
            expect(this.carCollection.length).toEqual(1);
        });

        it("should find a model by id", function() {
            expect(this.carCollection.get(5).get("id")).toEqual(5);
        });
    });
});