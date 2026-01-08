-- Manually adding products via SQL
INSERT INTO products (sku, total_quantity, reserved_quantity) VALUES ('SAMSUNG_S24', 50, 0);
INSERT INTO products (sku, total_quantity, reserved_quantity) VALUES ('MACBOOK_PRO', 20, 0);
INSERT INTO products (sku, total_quantity, reserved_quantity) VALUES ('IPHONE15_PRO', 75, 0);

-- Note: 'IPHONE15' and 'PS5' are already added by the CommandLineRunner logic if they don't exist.
