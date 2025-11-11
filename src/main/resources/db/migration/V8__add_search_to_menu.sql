ALTER TABLE menu
    ADD COLUMN search_on char(1) check (search_on in ('F','T')) DEFAULT 'F';
