-- Goldberry Farm Database Data Manipulation Queries
-- CS 340 Group 56
-- Madison Gillis & Clayton Loftus

------------------------------------------------------------------------------------
-- SEEDS 
------------------------------------------------------------------------------------

-- Query for select all seeds
SELECT Seeds.seed_id AS ID, Seeds.name AS Name, Seeds.price AS Price, Seeds.growth_days AS GrowthDays, Seeds.can_regrow AS CanItRegrow 
FROM Seeds;

-- Query to create a seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Seeds (name, price, growth_days, can_regrow)
VALUES (<seed-name>, <seed-price>, <growth-days>, <can-regrow>);

-- If a related crop is selected during seed creation, the following query updates the crop <> seed relationship
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE Crops 
SET Crops.seed_id = <insertedSeedId>
WHERE Crops.crop_id = <relatedCropId>;

-- Query to update a seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE Seeds
SET Seeds.name = <name>, Seeds.price = <price>, Seeds.growth_days = <growthDays>, Seeds.can_regrow = <canRegrow>
WHERE Seeds.seed_id = <seedId>;

-- If a related crop needs to be removed during Seed UPDATE, the following query updates the crop <> seed relationship
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE FROM Crops 
WHERE Crops.crop_id = <currentRelatedCropId>;

-- If a related crop needs to be added during Seed UPDATE, the following query updates the crop <> seed relationship
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE Crops
SET Crops.seed_id = <seedId> 
WHERE Crops.crop_id = <relatedCropId>;

-- Query to delete a seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE FROM Seeds 
WHERE Seeds.seed_id = <seedId>;

------------------------------------------------------------------------------------
-- CROPS 
------------------------------------------------------------------------------------

-- Query to list crops
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
SELECT Crops.crop_id AS ID, Crops.name AS Name, Seeds.name AS SeedName, Crops.quantity as QUANTITY, Crops.unit_price AS UnitPrice, Crops.year AS Year
FROM Crops
INNER JOIN Seeds ON Crops.seed_id = Seeds.seed_id;

-- Query to add a new crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Crops (Crops.name, Crops.quantity, Crops.unit_price, Crops.year, Crops.seed_id)
VALUES (<name>, <quantity>, <unit_price>, <year>, <seed_id>);

-- Query to update a crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE Crops
SET Crops.name = <name>, Crops.quantity = <quantity>, Crops.unit_price = <unit_price>, Crops.year = <year>, Crops.seed_id = <seedId>
WHERE Crops.crop_id = <cropId>;

-- Query to delete a crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE FROM Crops 
WHERE Crops.crop_id = <cropId>;

------------------------------------------------------------------------------------
-- SEASONS
------------------------------------------------------------------------------------

-- Query for select all seasons
SELECT season_id AS id, name 
FROM Seasons;

-- Query for add a new season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Seasons (season_id, name)
VALUES (<season-id>, <season-name>);

------------------------------------------------------------------------------------
-- SALES
------------------------------------------------------------------------------------

-- Query for list sales
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
SELECT Sales.sale_id AS ID, Customers.name AS Customer, Crops.name AS Crop, Sales.quantity AS Quantity, Sales.price AS Price, Sales.date AS Date, Sales.is_shipped AS ShippingStatus
FROM Sales
INNER JOIN Customers ON Sales.customer_id = Customers.customer_id
LEFT JOIN Crops ON Sales.crop_id = Crops.crop_id;

-- Query for create a new sale (TODO: update this when implemented)
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Sales (customer, crop, Sales.quantity, Sales.price, Sales.date, shipping_status)
VALUES (<customer_name>, <crop_name>, <sale_quantity>, <sale_price>, <sale_date>, <sale_is_shipped>);

-- delete (TODO: update this when implemented or delete if not implemented)
-- Colon ':' used to denote the variables that will have data from Node
DELETE FROM Sales WHERE Sales.sale_id = :sale_id_input;

-- update (TODO: update this when implemented or delete if not implemented)
-- Colon ':' used to denote the variables that will have data from Node
UPDATE Sales
SET customer = :customer_name_input, crop = :crop_name_input, Sales.quantity = :sale_quantity_input,
	Sales.price = :sale_price_input, Sales.date = :sale_date_input, shippint_status = :sale_is_shipped_input
WHERE Sales.sale_id = :sale_id_input;

------------------------------------------------------------------------------------
-- CUSTOMERS
------------------------------------------------------------------------------------

-- Query for select all customers
SELECT customer_id AS ID, name AS Name, address AS Address, city AS City, state AS State, zipcode AS Zipcode, email AS Email 
FROM Customers;

-- Query for search for a customer
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
SELECT customer_id AS ID, name AS Name, address AS Address, city AS City, state AS State, zipcode AS Zipcode, email AS Email 
FROM Customers WHERE name LIKE <customer-search-name>;

-- Query for add a new customer
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Customers (name, address, city, state, zipcode, email)
VALUES (<customer-name>, <customer-address>, <customer-city>, <customer-state>, <customer-zip>, <customer-email>);

------------------------------------------------------------------------------------
-- CROPS_SEASONS
------------------------------------------------------------------------------------

-- Query for select all crops_seasons
SELECT Crops.name AS Crop, Seasons.name AS Season
FROM Crops_Seasons
INNER JOIN Crops ON Crops.crop_id = Crops_Seasons.crop_id 
INNER JOIN Seasons on Seasons.season_id = Crops_Seasons.season_id;

-- Query for add a crop_season (implemented as part of Crops INSERT)
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO Crops_Seasons (crop_id, season_id) 
VALUES (<crop_id>, <season_id>);