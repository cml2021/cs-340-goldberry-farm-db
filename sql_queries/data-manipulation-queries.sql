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
-- Colon ':' used to denote the variables that will have data from Node
INSERT INTO Seeds (name, price, growth_days, can_regrow)
VALUES (:seed_name_input, :seed_price_input, :seed_growth_days_input, seed_can_regrow_input);

-- If a related crop is selected during seed creation, the following query updates the crop <> seed relationship
UPDATE Crops 
SET Crops.seed_id = :inserted_seed_id 
WHERE Crops.crop_id = :related_crop_id;

-- Query to update a seed
-- Colon ':' used to denote the variables that will have data from Node
UPDATE Seeds
SET Seeds.name = :seed_name_input, Seeds.price = :seed_price_input, Seeds.growth_days = :seed_growth_days_input, 
    Seeds.can_regrow = :seed_can_regrow_input
WHERE Seeds.seed_id = :seed_id_input;

-- Query to delete a seed
-- Colon ':' used to denote the variables that will have data from Node
DELETE FROM Seeds WHERE Seeds.name = :seed_name_input;

------------------------------------------------------------------------------------
-- CROPS 
------------------------------------------------------------------------------------

-- Query to list crops
-- Colon ':' used to denote the variables that will have data from Node
SELECT Crops.crop_id AS ID, Crops.name AS Name, Seeds.name AS SeedName, Crops.quantity as QUANTITY, Crops.unit_price AS UnitPrice, Crops.year AS Year
FROM Crops
INNER JOIN Seeds ON Crops.seed_id = Seeds.seed_id;

-- create
-- Colon ':' used to denote the variables that will have data from Node
INSERT INTO Crops (Crops.name, seed_name, Crops.quantity, Crops.unit_price, Crops.year)
VALUES (:crop_name_input, :seed_name_input, :crop_quantity_input, :crop_unit_price_input, :crop_year_input);

-- delete
-- Colon ':' used to denote the variables that will have data from Node
DELETE FROM Crops WHERE Crops.name = :crop_name_input;

-- update
-- Colon ':' used to denote the variables that will have data from Node
UPDATE Crops
SET Crops.name = :crop_name_input, seed_name = :seed_name_input, Crops.quantity = :crop_quantity_input
	Crops.unit_price = :crop_unit_price_input, Crops.year = :crop_year_input
WHERE Crops.crop_id = :crop_id_input;

------------------------------------------------------------------------------------
-- SEASONS
------------------------------------------------------------------------------------

-- Query for select all seasons
SELECT 
    * 
FROM 
    Seasons;

-- Query for add a new season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO 
    Seasons (season_id, name)
VALUES 
    (<season_id>, <season_name>);

-- Query for update a season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE 
    Seasons
SET
    name = <season_name>
WHERE
    season_id = <season_id>;

-- Query for delete a season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE
FROM 
    Seasons
WHERE
    season_id = <season_id>;

------------------------------------------------------------------------------------
-- SALES
------------------------------------------------------------------------------------

- read
-- Colon ':' used to denote the variables that will have data from Node
SELECT Sales.sale_id, Customers.name AS customer, Crops.name AS crop, Sales.quantity, Sales.price, Sales.date, Sales.is_shipped AS shipping_status
FROM Sales
INNER JOIN Customers ON Sales.customer_id = Customers.customer_id
INNER JOIN Crops ON Sales.crop_id = Crops.crop_id;

-- create
-- Colon ':' used to denote the variables that will have data from Node
INSERT INTO Sales (Sales.sale_id, customer, crop, Sales.quantity, Sales.price, Sales.date, shipping_status)
VALUES (:customer_name_input, :crop_name_input, :sale_quantity_input, :sale_price_input, :sale_date_input, :sale_is_shipped_input);

-- delete
-- Colon ':' used to denote the variables that will have data from Node
DELETE FROM Sales WHERE Sales.sale_id = :sale_id_input;

-- update
-- Colon ':' used to denote the variables that will have data from Node
UPDATE Sales
SET customer = :customer_name_input, crop = :crop_name_input, Sales.quantity = :sale_quantity_input,
	Sales.price = :sale_price_input, Sales.date = :sale_date_input, shippint_status = :sale_is_shipped_input
WHERE Sales.sale_id = :sale_id_input;

------------------------------------------------------------------------------------
-- CUSTOMERS
------------------------------------------------------------------------------------

-- Query for select all customers
SELECT 
    name, address, city, state, zipcode, email
FROM
    Customers;

-- Query for add a new customer
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO 
    Customers (name, address, city, state, zipcode, email)
VALUES
    (<customer_name>, <customer_address>, <customer_city>, <customer_state>, <customer_zip>, <customer_email>);

-- Query for update a customer
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE 
    Customers
SET
    name = <customer_name>,
    address = <customer_address>,
    city = <customer_city>,
    state = <customer_state>,
    zipcode = <customer_zip>,
    email = <customer_email>

WHERE
    customer_id = <customer_id>;

-- Query for delete a customer
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE
FROM 
    Customers
WHERE
    customer_id = <customer_id>;

------------------------------------------------------------------------------------
-- CROPS_SEASONS
------------------------------------------------------------------------------------

-- Query for select all crops_seasons
SELECT 
    crop_id, season_id
FROM
    Crops_Seasons;

-- Query for add a new crop_season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
INSERT INTO 
    Crops_Seasons
VALUES
    (<crop_id>, <season_id>);

-- Query for update a crop_season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
UPDATE
    Crops_Seasons
SET
    crop_id = <crop_id>,
    season_id = <season_id>
WHERE
    crop_season_id = <crop_season_id>;

-- Query for delete a crop_season
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
DELETE 
FROM
    Crops_Seasons
WHERE
    crop_season_id = <crop_season_id>;