-- Madison Gillis
-- Data Manipulation Queries for Seeds, Crops, and Sales pages

-- Seeds
-- read
SELECT Seeds.seed_id, Seeds.name, Seeds.price, Seeds.growth_days, Seeds.can_regrow
FROM Seeds;
-- create
INSERT INTO Seeds (name, price, growth_days, can_regrow)
VALUES (:seed_name_input, :seed_price_input, :seed_growth_days_input, seed_can_regrow_input);
-- delete
DELETE FROM Seeds WHERE Seeds.name = :seed_name_input;
-- update
UPDATE Seeds
SET Seeds.name = :seed_name_input, Seeds.price = :seed_price_input, Seeds.growth_days = :seed_growth_days_input, 
    Seeds.can_regrow = :seed_can_regrow_input
WHERE Seeds.seed_id = :seed_id_input;

-- Crops
-- read
SELECT Crops.crop_id, Crops.name, Seeds.name AS seed_name, Crops.quantity, Crops.unit_price, Crops.year
FROM Crops
INNER JOIN Seeds ON Crops.seed_id = Seeds.seed_id;
-- create
INSERT INTO Crops (Crops.name, seed_name, Crops.quantity, Crops.unit_price, Crops.year)
VALUES (:crop_name_input, :seed_name_input, :crop_quantity_input, :crop_unit_price_input, :crop_year_input);
-- delete
DELETE FROM Crops WHERE Crops.name = :crop_name_input;
-- update
UPDATE Crops
SET Crops.name = :crop_name_input, seed_name = :seed_name_input, Crops.quantity = :crop_quantity_input
	Crops.unit_price = :crop_unit_price_input, Crops.year = :crop_year_input
WHERE Crops.crop_id = :crop_id_input;

-- Sales
-- read
SELECT Sales.sale_id, Customers.name AS customer, Crops.name AS crop, Sales.quantity, Sales.price, Sales.date, Sales.is_shipped AS shipping_status
FROM Sales
INNER JOIN Customers ON Sales.customer_id = Customers.customer_id
INNER JOIN Crops ON Sales.crop_id = Crops.crop_id;
-- create
-- delete
-- update
