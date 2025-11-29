create table main_fonts (
                          main_id bigint not null,
                          family varchar(30)
) engine=InnoDB;
alter table main_fonts
    add constraint FK_main_fonts_main
        foreign key (main_id)
            references main (id);
