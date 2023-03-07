const express = require("express");
const path = require("path");
const app = express();
const PORT = 5600;
const db = require("./database/db-connector");
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     

app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');             
app.use(express.json());
app.use(express.urlencoded({extended: true}));  
app.use(express.static('public')); 


app.get("/", function(req, res) {
	res.render('index');
});

// SEEDS

app.get("/seeds", function(req, res) {
	let listSeeds = "SELECT Seeds.seed_id AS ID, Seeds.name AS Name, Seeds.price AS Price, Seeds.growth_days AS GrowthDays, Seeds.can_regrow AS CanItRegrow FROM Seeds;";
	let getCropName = "SELECT * FROM Crops;";

	db.pool.query(listSeeds, function(error, rows, fields){
		let seeds = rows;
		db.pool.query(getCropName, (error, rows, fields) => {
			let crops = rows;
			return res.render('seeds', {data: seeds, crops: crops});
		})
	})
});

app.post("/add-seed-form", function(req, res){
	let data = req.body;

	const relatedCropId = parseInt(data["related-crop"]);

	addSeed = `INSERT INTO Seeds (name, price, growth_days, can_regrow) VALUES ('${data['seed-name']}', '${data['seed-price']}', '${data['growth-days']}', '${data['can-regrow']}')`;
	updateRelatedCrop =  `UPDATE Crops SET Crops.seed_id = ? WHERE Crops.crop_id = ?;`

	db.pool.query(addSeed, function(error, rows, fields){
		if (error) {
			handleError(error);
		}
		else {
			insertedSeedId = rows.insertId;

			// if a related crop is selected during CREATE, update the related crop's FK seed_id
			if (relatedCropId != -999) {

				db.pool.query(updateRelatedCrop, [insertedSeedId, relatedCropId], function(error, rows, fields) {
					if (error) {
						handleError(error);
					}
				})
			}
			res.redirect('/seeds');
		}
	})
});

app.patch("/update-seed", function(req, res) {
	const data = req.body;

	const seedId = parseInt(data.seedId);
	const name = data.name;
	const price = parseInt(data.price);
	const growthDays = parseInt(data.growthDays);
	const canRegrow = parseInt(data.canRegrow);
	const relatedCropId = parseInt(data.relatedCropId);

	getCurrentRelatedCropId = `SELECT Crops.crop_id FROM Crops WHERE Crops.seed_id = ?;`
	updateSeed = `UPDATE Seeds SET name = ?, price = ?, growth_days = ?, can_regrow = ? WHERE seed_id = ?;`
	removeRelatedCrop = `DELETE FROM Crops WHERE Crops.crop_id = ?;`
	addRelatedCrop = `UPDATE Crops SET Crops.seed_id = ? WHERE Crops.crop_id = ?;`

	// check if the seed being updated already has a related crop
	db.pool.query(getCurrentRelatedCropId, [seedId], function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			const hasCurrentRelatedCrop = rows.length > 0 ? true : false;
			const currentRelatedCropId = hasCurrentRelatedCrop === true ? rows[0].crop_id : -999;

			// update the seed
			db.pool.query(updateSeed, [name, price, growthDays, canRegrow, seedId], function(error, rows, fields) {
				if (error) {
					handleError(error);
				
				// if there is no change to the seed's related crop on UPDATE, return
				} else if (currentRelatedCropId === relatedCropId) {
					res.body = JSON.stringify(data);
					res.sendStatus(200);
				
				// if a seed previously had a related crop and this was set to None on UPDATE, remove the relationship
				// NOTE: this will also delete the crop since Crops.seed_id cannot be null
				} else if (hasCurrentRelatedCrop === true && relatedCropId === -999) {
					db.pool.query(removeRelatedCrop, [currentRelatedCropId], function(error, rows, fields) {
						if (error) {
							handleError(error);
						} else {
							res.body = JSON.stringify(data);
							res.sendStatus(200);
						}
					})
				
				// if a seed had no related crop and this was set to some crop_id on UPDATE, add the relationship
				} else if (hasCurrentRelatedCrop === false && relatedCropId != -999) {
					db.pool.query(addRelatedCrop, [seedId, relatedCropId], function(error, rows, fields) {
						if (error) {
							handleError(error);
						} else {
							res.body = JSON.stringify(data);
							res.sendStatus(200);
						}
					})

				// if a seed previously had a related crop and this was set to a different crop_id on UPDATE, 
				// remove the previous relationship and create a new relationship with the new related crop
				// NOTE: this will also delete the previous related crop since Crops.seed_id cannot be null
				} else {
					db.pool.query(removeRelatedCrop, [currentRelatedCropId], function(error, rows, fields) {
						if (error) {
							handleError(error);
						} else {
							db.pool.query(addRelatedCrop, [seedId, relatedCropId], function(error, rows, fields) {
								if (error) {
									handleError(error);
								} else {
									res.body = JSON.stringify(data);
									res.sendStatus(200);
								}
							})
						}
					})
				}
			}
		)}
	})
});

app.delete("/delete-seed", function(req, res) {
	const data = req.body
	const seedId = parseInt(data.seedId);

	deleteSeed = `DELETE FROM Seeds WHERE seed_id = ?;`

	db.pool.query(deleteSeed, [seedId], function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.sendStatus(204);
		}
	})
});

// CROPS

app.get("/crops", function (req, res) {
	let listCrops = "SELECT Crops.crop_id AS ID, Crops.name AS Name, Crops.quantity AS Quantity, Crops.unit_price AS UnitPrice, Crops.year AS Year, Seeds.name AS Seed FROM Crops INNER JOIN Seeds ON Seeds.seed_id = Crops.seed_id;"
	let listSeeds = "SELECT Seeds.seed_id, Seeds.name FROM Seeds;"
	
	db.pool.query(listCrops, function(error, rows, fields) {
		let crops = rows;

		db.pool.query(listSeeds, (error, rows, fields) => {
			let seeds = rows;
			return res.render('crops', {data: crops, seeds: seeds});
		});
	})
});

app.post("/add-crop", function(req, res) {
	let data = req.body;

	let addCrop = `INSERT INTO Crops (name, quantity, unit_price, year, seed_id) VALUES ('${data['crop-name']}', '${data['crop-quantity']}', '${data['crop-unit-price']}', '${data['crop-year']}', '${data['related-seed']}');`;

	db.pool.query(addCrop, function(error, rows, fields){
		if (error) {
			handleError(error);
		}
		else {
			res.redirect('/crops');
		};
	});
});

// SEASONS

app.get("/seasons", function (req, res) {
	let listSeasons = "SELECT season_id AS id, name FROM Seasons;";

	db.pool.query(listSeasons, function(error, rows, fields){
		res.render('seasons', {data: rows});
	})
});

app.post("/add-season", function(req, res) {
	let data = req.body;

	addSeason = `INSERT INTO Seasons (season_id, name) VALUES ('${data['season-id']}', '${data['season-name']}');`;

	db.pool.query(addSeason, function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.redirect("/seasons");
		}
	})
});

// SALES

app.get("/sales", function (req, res) {
	let listSales = `SELECT Sales.sale_id AS ID, Customers.name AS Customer, Crops.name AS Crop, Sales.quantity AS Quantity, Sales.price AS Price, Sales.date AS Date, Sales.is_shipped AS ShippingStatus FROM Sales
					INNER JOIN Customers ON Sales.customer_id = Customers.customer_id
					LEFT JOIN Crops ON Sales.crop_id = Crops.crop_id;`;

	db.pool.query(listSales, function(error, rows, fields){
		if (error) {
			handleError(error);
		} else {
			res.render('sales', {data: rows});
		}
	})
});

// CUSTOMERS

app.get("/customers", function (req, res) {
	let listCustomers = 'SELECT customer_id AS ID, name AS Name, address AS Address, city AS City, state AS State, zipcode AS Zipcode, email AS Email FROM Customers;'

	db.pool.query(listCustomers, function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.render('customers', {data: rows});
		}
	})
});

app.post("/add-customer", function(req, res) {
	let data = req.body;

	if (data.email == undefined) {
		data.email = 'NULL';
	}

	let addCustomer = `INSERT INTO Customers (name, address, city, state, zipcode, email) VALUES ("${data['customer-name']}", "${data['customer-address']}", "${data['customer-city']}", "${data['customer-state']}", '${data['customer-zip']}', "${data['customer-email']}");`;

	db.pool.query(addCustomer, function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.redirect('/customers');
		}
	})
});

// CROPS_SEASONS

app.get("/crops-seasons", function (req, res) {
	let listCropsSeasons = 'SELECT Crops.name AS Crop, Seasons.name AS Season FROM Crops_Seasons INNER JOIN Crops ON Crops.crop_id = Crops_Seasons.crop_id INNER JOIN Seasons on Seasons.season_id = Crops_Seasons.season_id;'

	db.pool.query(listCropsSeasons, function(error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.render('crops-seasons', {data: rows});
		}
	})
});

// error handler
const handleError = (error) => {
	console.log(error);
	res.sendStatus(400);
}


// listener
app.listen(PORT, function () {
	console.log(`Server started on PORT ${PORT}...`);
});
