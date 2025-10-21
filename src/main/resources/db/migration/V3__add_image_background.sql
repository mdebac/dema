ALTER TABLE main
    ADD COLUMN content_background MEDIUMBLOB,
    ADD COLUMN remove_background char(1) check (remove_background in ('F','T')),
    ADD COLUMN size_background bigint not null,
    ADD COLUMN file_name_background varchar(255),
    ADD COLUMN mime_type_background varchar(255);
