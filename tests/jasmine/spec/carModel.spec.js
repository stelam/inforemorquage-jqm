describe('Car model', function() {

	describe('when instantiated', function() {


		// Also verifies that the model exists and
		// extends Backbone.Model
		it('should exhibit attributes', function() {
			var carModel = new CarModel({
				name: 'Chevrolet Chevette',
				registration_number: 'ABC123'
			});
			expect(carModel.get('name')).toEqual('Chevrolet Chevette');
		});


	});

	describe('when saved', function() {

		beforeEach(function() {
			// Create a dummy car collection
			CarCollection = Backbone.Collection.extend({
			    model:CarModel,
			    localStorage: new Store("cars")
			});

			// Create dummy car model
			this.carModel = new CarModel({
				name: "Chevrolet Chevette",
				registration_number: "H1Z 2Z1"
			});

			// Delete existing cars in persistent storage			
			this.cars = new CarCollection();
			this.cars.fetch();
			var length = this.cars.length; for (var i = length - 1; i >= 0; i--) { this.cars.at(i).destroy(); }

			this.cars.add(this.carModel);

			// Sinon spies
			this.eventSpy = sinon.spy();
		});


		it("should be saved in a new localStorage entry", function() {
			this.carModel.save();

			var fetchedCars = new CarCollection();
			fetchedCars.fetch();

			expect(fetchedCars.at(0).get("name")).toEqual('Chevrolet Chevette');
		});


		it("should not save when the name is empty", function() {
			this.carModel.bind("invalid", this.eventSpy);
			this.carModel.save({"name": ""});

			expect(this.eventSpy).toHaveBeenCalledOnce();
			expect(this.eventSpy).toHaveBeenCalledWith(
				this.carModel,
				[{
					field: "name", 
					msg: app.strings.get(currentLanguage).error01
				}]
			);
		});


		it("should not save when the registration number is empty", function() {
			this.carModel.bind("invalid", this.eventSpy);
			this.carModel.save({"registration_number": ""});

			expect(this.eventSpy).toHaveBeenCalledOnce();
			expect(this.eventSpy).toHaveBeenCalledWith(
				this.carModel,
				[{
					field: "registration_number", 
					msg: app.strings.get(currentLanguage).error02
				}]
			);
		});


		it("should not save when the registration number is not alphanumerical (with spaces)", function() {
			this.carModel.bind("invalid", this.eventSpy);
			this.carModel.save({"registration_number": "@notan"});

			expect(this.eventSpy).toHaveBeenCalledOnce();
			expect(this.eventSpy).toHaveBeenCalledWith(
				this.carModel,
				[{
					field: "registration_number", 
					msg: app.strings.get(currentLanguage).error03
				}]
			);
		});


		it("should not save when the registration number is too long", function() {
			this.carModel.bind("invalid", this.eventSpy);
			this.carModel.save({"registration_number": "this registration number is way too long"});

			expect(this.eventSpy).toHaveBeenCalledOnce();
			expect(this.eventSpy).toHaveBeenCalledWith(
				this.carModel,
				[{
					field: "registration_number", 
					msg: app.strings.get(currentLanguage).error04
				}]
			);
		});


		it("should not save when the registration number is too short", function() {
			this.carModel.bind("invalid", this.eventSpy);
			this.carModel.save({"registration_number": "1"});

			expect(this.eventSpy).toHaveBeenCalledOnce();
			expect(this.eventSpy).toHaveBeenCalledWith(
				this.carModel,
				[{
					field: "registration_number", 
					msg: app.strings.get(currentLanguage).error04
				}]
			);
		});


	});

});