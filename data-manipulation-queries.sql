------------------------------------------------------------------------------------
-- SEEDS 
------------------------------------------------------------------------------------

-- Query for select all seeds
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for add a new seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for update a seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for delete a seed
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

------------------------------------------------------------------------------------
-- CROPS 
------------------------------------------------------------------------------------

-- Query for select all crops
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for add a new crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for update a crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for delete a crop
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

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

-- Query for select all sales records
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for add a new sale record
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for update a sale record
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

-- Query for delete a sale record
-- Angle brackets '<' '>' used to denote the variables that will have data from Node
-- TODO

------------------------------------------------------------------------------------
-- CUSTOMERS #TODO CLAY
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
-- CROPS_SEASONS #TODO CLAY
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