
create table menu_properties (
                          menu_id bigint not null,
                          value varchar(255) not null,
                          name varchar(255) not null
) engine=InnoDB;


alter table menu_properties
    add constraint FK_MENU_PROPERTIES_MENU
        foreign key (menu_id)
            references menu (id);
