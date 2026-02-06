alter table item ADD COLUMN image_align_horizontal varchar(10) not null DEFAULT 'Start';
alter table item ADD COLUMN image_align_vertical varchar(10) not null DEFAULT 'Start';
alter table item ADD COLUMN image_height integer DEFAULT 100;
alter table item ADD COLUMN image_width integer DEFAULT 100;
