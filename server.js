// This module is adapted from the NodeJS Starter App Code

const express = require("express");
const path = require("path");
const app = express();
const PORT = 5600;
const db = require("./database/db-connector");
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');

app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// This endpoint is original work
app.get("/", function (req, res) {
	res.render('index');
});

// SEEDS

app.get("/seeds", function (req, res) {
	let listSeeds = "SELECT Seeds.seed_id AS ID, Seeds.name AS Name, Seeds.price AS Price, Seeds.growth_days AS GrowthDays, Seeds.can_regrow AS CanItRegrow FROM Seeds;";
	let getCropName = "SELECT * FROM Crops;";

	db.pool.query(listSeeds, function (error, rows, fields) {
		if (error) {
			handleError(error)

		} else {
			let seeds = rows;

			db.pool.query(getCropName, (error, rows, fields) => {
				if (error) {
					handleError(error)

				} else {
					let crops = rows;
					return res.render('seeds', { data: seeds, crops: crops });
				}
			})
		}
	})
});

app.post("/add-seed-form", function (req, res) {
	let data = req.body;

	const relatedCropId = parseInt(data["related-crop"]);

	addSeed = `INSERT INTO Seeds (name, price, growth_days, can_regrow) VALUES ('${data['seed-name']}', '${data['seed-price']}', '${data['growth-days']}', '${data['can-regrow']}')`;
	updateRelatedCrop = `UPDATE Crops SET Crops.seed_id = ? WHERE Crops.crop_id = ?;`

	db.pool.query(addSeed, function (error, rows, fields) {
		if (error) {
			handleError(error);
		}
		else {
			insertedSeedId = rows.insertId;

			// if a related crop is selected during CREATE, update the related crop's FK seed_id
			// this logic is original work
			if (relatedCropId != -999) {

				db.pool.query(updateRelatedCrop, [insertedSeedId, relatedCropId], function (error, rows, fields) {
					if (error) {
						handleError(error);
					}
				})
			}
			res.redirect('/seeds');
		}
	})
});

app.patch("/update-seed", function (req, res) {
	const data = req.body;

	const seedId = parseInt(data.seedId);
	const name = data.name;
	const price = parseInt(data.price);
	const growthDays = parseInt(data.growthDays);
	const canRegrow = parseInt(data.canRegrow);
	const relatedCropId = parseInt(data.relatedCropId);

	let getCurrentRelatedCropId = `SELECT Crops.crop_id FROM Crops WHERE Crops.seed_id = ?;`
	let updateSeed = `UPDATE Seeds SET name = ?, price = ?, growth_days = ?, can_regrow = ? WHERE seed_id = ?;`
	let removeRelatedCrop = `DELETE FROM Crops WHERE Crops.crop_id = ?;`
	let addRelatedCrop = `UPDATE Crops SET Crops.seed_id = ? WHERE Crops.crop_id = ?;`

	// check if the seed being updated already has a related crop
	// this UPDATE logic is original work
	db.pool.query(getCurrentRelatedCropId, [seedId], function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {

			const hasCurrentRelatedCrop = rows.length > 0 ? true : false;
			const currentRelatedCropId = hasCurrentRelatedCrop === true ? rows[0].crop_id : -999;

			// update the seed
			db.pool.query(updateSeed, [name, price, growthDays, canRegrow, seedId], function (error, rows, fields) {
				if (error) {
					handleError(error);

				// if there is no change to the seed's related crop on UPDATE, return
				} else if (currentRelatedCropId === relatedCropId) {
					res.body = JSON.stringify(data);
					res.sendStatus(200);

				// if a seed previously had a related crop and this was set to None on UPDATE, remove the relationship
				// NOTE: this will also delete the crop since Crops.seed_id cannot be null
				} else if (hasCurrentRelatedCrop === true && relatedCropId === -999) {
					db.pool.query(removeRelatedCrop, [currentRelatedCropId], function (error, rows, fields) {
						if (error) {
							handleError(error);
						} else {
							res.body = JSON.stringify(data);
							res.sendStatus(200);
						}
					})

				// if a seed had no related crop and this was set to some crop_id on UPDATE, add the relationship
				} else if (hasCurrentRelatedCrop === false && relatedCropId != -999) {
					db.pool.query(addRelatedCrop, [seedId, relatedCropId], function (error, rows, fields) {
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
					db.pool.query(removeRelatedCrop, [currentRelatedCropId], function (error, rows, fields) {
						if (error) {
							handleError(error);
						} else {
							db.pool.query(addRelatedCrop, [seedId, relatedCropId], function (error, rows, fields) {
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
			)
		}
	})
});

app.delete("/delete-seed", function (req, res) {
	const data = req.body;
	const seedId = parseInt(data.seedId);

	deleteSeed = `DELETE FROM Seeds WHERE seed_id = ?;`

	db.pool.query(deleteSeed, [seedId], function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.sendStatus(204);
		}
	})
});

// CROPS

app.get("/crops", function (req, res) {
	let listCrops = "SELECT Crops.crop_id AS ID, Crops.name AS Name, Crops.quantity AS Quantity, Crops.unit_price AS UnitPrice, Crops.year AS Year, Seeds.name AS Seed FROM Crops INNER JOIN Seeds ON Seeds.seed_id = Crops.seed_id;";
	let listSeeds = "SELECT Seeds.seed_id, Seeds.name FROM Seeds;";
	let listSeasons = "SELECT Seasons.season_id, Seasons.name FROM Seasons;";

	db.pool.query(listCrops, function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			let crops = rows;

			db.pool.query(listSeeds, (error, rows, fields) => {
				if (error) {
					handleError(error);
				} else {
					let seeds = rows;

					db.pool.query(listSeasons, (error, rows, fields) => {
						if (error) {
							handleError(error);
						} else {
							let seasons = rows;

							return res.render('crops', { data: crops, seeds: seeds, seasons: seasons });
						}
					})
				}
			});
		}
	})
});

app.post("/add-crop", function (req, res) {
	let data = req.body;

	const hasRelatedSeason = data["related-season"] == undefined ? false : true;

	let addCrop = `INSERT INTO Crops (name, quantity, unit_price, year, seed_id) VALUES ('${data['crop-name']}', '${data['crop-quantity']}', '${data['crop-unit-price']}', '${data['crop-year']}', '${data['related-seed']}');`;

	// INSERT logic for a crop with related season(s) is original work
	if (hasRelatedSeason === false) {
		console.log('Please select at least one season.');
		res.redirect('/crops');

	} else {
		db.pool.query(addCrop, function (error, rows, fields) {
			if (error) {
				handleError(error);
	
			} else {
				const insertedCropId = rows.insertId;
				const seasonIds = data["related-season"];
	
				// single related season
				if (Array.isArray(data["related-season"]) === false) {
					const seasonId = seasonIds
					let addCropSeason = `INSERT INTO Crops_Seasons (crop_id, season_id) VALUES ('${insertedCropId}','${seasonId}');`;
	
					db.pool.query(addCropSeason, function (error, row, fields) {
						if (error) {
							handleError(error);
						} else {
							res.redirect('/crops');
						}
					});
				
				// multiple related seasons
				} else {
	
					for (const seasonId of seasonIds) {
						
						let addCropSeason = `INSERT INTO Crops_Seasons (crop_id, season_id) VALUES ('${insertedCropId}','${seasonId}');`;
						
						db.pool.query(addCropSeason, function (error, row, fields) {
							if (error) {
								handleError(error);
							}
						})
					}
					res.redirect('/crops');
				}
			}
		});
	}
});

app.patch("/update-crop", function (req, res) {
	const data = req.body;
	
	const cropId = parseInt(data.cropId);
	const cropName = data.cropName;
	const cropQuantity = parseInt(data.cropQuantity);
	const cropUnitPrice = parseInt(data.cropUnitPrice);
	const cropYear = parseInt(data.cropYear);
	const cropRelatedSeedId = parseInt(data.cropRelatedSeedId);
	const cropRelatedSeasonIds = data.cropRelatedSeasonIds;

	let getCurrentRelatedSeasonIds = `SELECT Crops_Seasons.season_id FROM Crops_Seasons WHERE Crops_Seasons.crop_id = ?;`;
	let updateCrop = `UPDATE Crops SET Crops.name = ?, Crops.quantity = ?, Crops.unit_price = ?, Crops.year = ?, Crops.seed_id = ? WHERE Crops.crop_id = ?;`;
	let addRelatedSeason = `INSERT INTO Crops_Seasons (crop_id, season_id) VALUES ('${cropId}', ?);`;
	let removeRelatedSeason = `DELETE FROM Crops_Seasons WHERE Crops_Seasons.crop_id = ? AND Crops_Seasons.season_id = ?;`;
	
	// UPDATE logic for Crops with related season(s) is original work
	// get current related season IDs
	db.pool.query(getCurrentRelatedSeasonIds, [cropId], function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			const currentRelatedSeasonIds = [];

			for (const row of rows) {
				currentRelatedSeasonIds.push(row.season_id);
			}

			// update the crop
			db.pool.query(updateCrop, [cropName, cropQuantity, cropUnitPrice, cropYear, cropRelatedSeedId, cropId], function (error, rows, fields) {
				if (error) {
					handleError(error);
				
				// case when no change in related seasons
				} else if (JSON.stringify(cropRelatedSeasonIds.sort()) === JSON.stringify(currentRelatedSeasonIds.sort())) {
					res.body = JSON.stringify(data);
					res.sendStatus(200);
				
				// case when related season(s) change
				} else {
					currentRelatedSeasonIds.sort();
					cropRelatedSeasonIds.sort();

					// add Crops_Seasons as appropriate
					const seasonsToAdd = [];

					for (const season of cropRelatedSeasonIds) {
						if (!currentRelatedSeasonIds.includes(season)) {
							seasonsToAdd.push(season);
						}
					}

					if (seasonsToAdd.length > 0) {

						for (const seasonToAddId of seasonsToAdd) {
							db.pool.query(addRelatedSeason, [seasonToAddId], function (error, rows, fields) {
								if (error) {
									handleError(error);
								}
							})
						}
					}

					// remove Crops_Seasons as appropriate
					const seasonsToRemove = [];

					for (const season of currentRelatedSeasonIds) {
						if (!cropRelatedSeasonIds.includes(season)) {
							seasonsToRemove.push(season);
						}
					}

					if (seasonsToRemove.length > 0) {
						for (const seasonToRemoveId of seasonsToRemove) {
							db.pool.query(removeRelatedSeason, [cropId, seasonToRemoveId], function (error, rows, fields) {
								if (error) {
									handleError(error);
								}
							})
						}
					}
					res.body = JSON.stringify(data);
					res.sendStatus(200);
				}
			})
		}
	})
})

app.delete("/delete-crop", function (req, res) {
	const data = req.body
	const cropId = parseInt(data.cropId);

	deleteCrop = `DELETE FROM Crops WHERE crop_id = ?;`

	db.pool.query(deleteCrop, [cropId], function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.sendStatus(204);
		}
	})
});

// SEASONS

app.get("/seasons", function (req, res) {
	let listSeasons = "SELECT season_id AS id, name FROM Seasons;";

	db.pool.query(listSeasons, function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.render('seasons', { data: rows });
		}
	})
});

app.post("/add-season", function (req, res) {
	let data = req.body;

	addSeason = `INSERT INTO Seasons (season_id, name) VALUES ('${data['season-id']}', '${data['season-name']}');`;

	db.pool.query(addSeason, function (error, rows, fields) {
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
	let getCustomerName = `SELECT Customers.customer_id, Customers.name FROM Customers;`;
	let getCropName = `SELECT Crops.crop_id, Crops.name FROM Crops;`;

	db.pool.query(listSales, function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			let sales = rows;

			db.pool.query(getCustomerName, (error, rows, fields) => {
				if (error) {
					handleError(error);
				} else {
					let customers = rows;

					db.pool.query(getCropName, (error, rows, fields) => {
						if (error) {
							handleError(error);
						} else {
							let crops = rows;
							return res.render('sales', { data: sales, customers: customers, crops: crops });
						}
					})
				}
			})
		}
	})
});

app.post("/add-sale", function (req, res) {
	let data = req.body;

	let addSale = `INSERT INTO Sales (customer_id, crop_id, quantity, price, date, is_shipped)
					VALUES ('${data['customer-name']}', '${data['crop-name']}', '${data['sale-quantity']}', '${data['sale-price']}', '${data['sale-date']}', '${data['shipping-status']}');`;

	db.pool.query(addSale, function (error, rows, fields) {
		if (error) {
			handleError(error);
		}
		else {
			res.redirect('/sales');
		};
	});
});

// CUSTOMERS

app.get("/customers", function (req, res) {
	let listCustomers = 'SELECT customer_id AS ID, name AS Name, address AS Address, city AS City, state AS State, zipcode AS Zipcode, email AS Email FROM Customers;';
	let searchCustomers = `SELECT customer_id AS ID, name AS Name, address AS Address, city AS City, state AS State, zipcode AS Zipcode, email AS Email FROM Customers WHERE name LIKE ?`;

	if (req.query['search-customer-name'] === undefined || req.query['search-customer-name'] === '') {
		db.pool.query(listCustomers, function (error, rows, fields) {
			if (error) {
				handleError(error);
			} else {
				res.render('customers', { data: rows });
			}
		})
	} else {

		const customerName = req.query['search-customer-name'];

		db.pool.query(searchCustomers, [customerName], function (error, rows, fields) {
			if (error) {
				handleError(error);
			} else {
				res.render('customers', { data: rows });
			}
		})
	}
});

app.post("/add-customer", function (req, res) {
	let data = req.body;

	if (data.email == undefined) {
		data.email = 'NULL';
	}

	let addCustomer = `INSERT INTO Customers (name, address, city, state, zipcode, email) VALUES ("${data['customer-name']}", "${data['customer-address']}", "${data['customer-city']}", "${data['customer-state']}", '${data['customer-zip']}', "${data['customer-email']}");`;

	db.pool.query(addCustomer, function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.redirect('/customers');
		}
	})
});

// CROPS_SEASONS

app.get("/crops-seasons", function (req, res) {
	let listCropsSeasons = 'SELECT Crops.name AS Crop, Seasons.name AS Season FROM Crops_Seasons INNER JOIN Crops ON Crops.crop_id = Crops_Seasons.crop_id INNER JOIN Seasons on Seasons.season_id = Crops_Seasons.season_id;';

	db.pool.query(listCropsSeasons, function (error, rows, fields) {
		if (error) {
			handleError(error);
		} else {
			res.render('crops-seasons', { data: rows });
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
