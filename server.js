const express = require('express');
const path = require('path');

const app = express();
const PORT = 5600;
const db = require('./database/db-connector');

// Commented out to show proof of concept MySQL connection working
// app.get('/', function(req, res){
//     res.sendFile(path.join(__dirname, 'index.html'));     
// }); 

app.get('/', function (req, res) {

    // Data Definitions
    prepDatabase = "SET FOREIGN_KEY_CHECKS=0; SET AUTOCOMMIT = 0; DROP TABLE IF EXISTS `Seeds`, `Crops`, `Customers`, `Seasons`, `Crops_Seasons`, `Sales`;";
    createSeeds = "CREATE TABLE `Seeds` (`seed_id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(45) NOT NULL, `price` int(11) NOT NULL, `growth_days` int(11) NOT NULL, `can_regrow` tinyint(1) NOT NULL DEFAULT 0, PRIMARY KEY (`seed_id`));";
    createCrops = "CREATE TABLE `Crops` (`crop_id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(45) NOT NULL, `quantity` int(11) NOT NULL, `unit_price` int(11) NOT NULL, `year` int(11) NOT NULL, `seed_id` int(11) NOT NULL, PRIMARY KEY (`crop_id`), FOREIGN KEY (`seed_id`) REFERENCES `Seeds` (`seed_id`) ON DELETE CASCADE);";
    createSeasons = "CREATE TABLE `Seasons` (`season_id` varchar(45) NOT NULL UNIQUE, `name` varchar(45) DEFAULT NULL, PRIMARY KEY (`season_id`));";
    createCropsSeasons = "CREATE TABLE `Crops_Seasons` (`crop_id` int(11) NOT NULL, `season_id` varchar(45) NOT NULL, PRIMARY KEY (`crop_id`, `season_id`), FOREIGN KEY (`crop_id`) REFERENCES `Crops` (`crop_id`) ON DELETE CASCADE, FOREIGN KEY (`season_id`) REFERENCES `Seasons` (`season_id`) ON DELETE CASCADE);";
    createCustomers = "CREATE TABLE `Customers` (`customer_id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `address` varchar(100) NOT NULL, `city` varchar(100) NOT NULL, `state` varchar(25) NOT NULL, `zipcode` varchar(5) NOT NULL, `email` varchar(100) DEFAULT NULL, PRIMARY KEY (`customer_id`));";
    createSales = "CREATE TABLE `Sales` (`sale_id` int(11) NOT NULL AUTO_INCREMENT, `quantity` int(11) NOT NULL, `price` int(11) NOT NULL, `date` date NOT NULL, `is_shipped` tinyint(1) NOT NULL DEFAULT 0, `crop_id` int(11), `customer_id` int(11), PRIMARY KEY (`sale_id`), FOREIGN KEY (`crop_id`) REFERENCES `Crops` (`crop_id`) ON DELETE SET NULL, FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`) ON DELETE SET NULL);";
    insertSeeds = "INSERT INTO `Seeds` (`seed_id`, `name`, `price`, `growth_days`, `can_regrow`) VALUES (1, 'cauliflower', 80, 12, 0), (2, 'blueberry', 80, 13, 1), (3, 'wheat', 10, 4, 0), (4, 'pumpkin', 100, 13, 0);";
    insertCrops = "INSERT INTO `Crops` (`crop_id`, `name`, `quantity`, `unit_price`, `year`, `seed_id`) VALUES (1, 'cauliflower', 100, 175, 2023, 1), (2, 'blueberry', 300, 150, 2021, 2), (3, 'wheat', 50, 25, 2022, 3), (4, 'wheat', 100, 25, 2022, 3), (5, 'pumpkin', 250, 320, 2023, 4);";
    insertCustomers = "INSERT INTO `Customers` (`customer_id`, `name`, `address`, `city`, `state`, `zipcode`, `email`) VALUES (1, 'Jodi', '1 Willow Lane', 'Gull City', 'California', '91542', 'jodi@stardew.com'), (2, 'Evelyn', '1 River Road', 'Pelican Town', 'Florida', '34787', 'evelyn@stardew.com'), (3, 'Robin', '24 Mountain Road', 'Sparrow Village', 'Ohio', '63548', 'robin@stardew.com');";
    insertSeasons = "INSERT INTO `Seasons` (`season_id`, `name`) VALUES ('FA', 'fall'), ('SP', 'spring'), ('SU', 'summer');";
    insertCropsSeasons = "INSERT INTO `Crops_Seasons` (`crop_id`, `season_id`) VALUES (1, 'SP'), (2, 'SU'), (3, 'SU'), (4, 'FA'), (5, 'FA');";
    insertSales = "INSERT INTO `Sales` (`sale_id`, `quantity`, `price`, `date`, `is_shipped`, `crop_id`, `customer_id`) VALUES (1, 50, 8750, '2022-04-10', 1, 1, 1), (2, 100, 15000, '2021-05-13', 1, 2, 2), (3, 35, 875, '2023-01-01', 0, 3, 3), (4, 70, 1750, '2023-02-01', 0, 4, 1), (5, 100, 25000, '2021-05-14', 1, 5, 2);";
    resetKeyChecks = "SET FOREIGN_KEY_CHECKS=1;"
    makeTransaction = "COMMIT;"

    // Drop existing tables
    db.pool.query(prepDatabase, function (err, results, fields) {

        // Create Seeds table
        db.pool.query(createSeeds, function (err, results, fields) {

            // Create Crops table
            db.pool.query(createCrops, function (err, results, fields) {

                // Create Seasons table
                db.pool.query(createSeasons, function (err, results, fields) {

                    // Create Crops_Seasons table
                    db.pool.query(createCropsSeasons, function (err, results, fields) {

                        // Create Customers table
                        db.pool.query(createCustomers, function (err, results, fields) {

                            // Create Sales table
                            db.pool.query(createSales, function (err, results, fields) {

                                // Add data to Seeds table
                                db.pool.query(insertSeeds, function (err, results, fields) {
                                
                                    // Add data to Crops table
                                    db.pool.query(insertCrops, function (err, results, fields) {
                                    
                                        // Add data to Customers table
                                        db.pool.query(insertCustomers, function (err, results, fields) {
                                        
                                            // Add data to Seasons table
                                            db.pool.query(insertSeasons, function (err, results, fields) {
                                            
                                                // Add data to Crops_Seasons table
                                                db.pool.query(insertCropsSeasons, function (err, results, fields) {
                                                
                                                    // Add data to Sales table
                                                    db.pool.query(insertSales, function (err, results, fields) {
                                                    
                                                        // Add back foreign key checks
                                                        db.pool.query(resetKeyChecks, function (err, results, fields) {
                                                        
                                                            // Commit transaction
                                                            db.pool.query(makeTransaction, function (err, results, fields) {
                                                            
                                                                console.log("Database load successful")

                                                                // Load index page
                                                                res.sendFile(path.join(__dirname, 'index.html'));
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});

    app.get('/seeds', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/seeds.html'));
    });

    app.get('/crops', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/crops.html'));
    });

    app.get('/seasons', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/seasons.html'));
    });

    app.get('/sales', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/sales.html'));
    });

    app.get('/customers', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/customers.html'));
    });

    app.get('/crops-seasons', function (req, res) {
        res.sendFile(path.join(__dirname, '/pages/crops-seasons.html'));
    });

    app.listen(PORT, function () {
        console.log(`Server started on PORT ${PORT}...`)
    });