DROP TABLE IF EXISTS detail_iso;
ALTER TABLE menu ADD COLUMN menu_url varchar(50) not null;
ALTER TABLE panel ADD COLUMN panel_url varchar(50) not null;
