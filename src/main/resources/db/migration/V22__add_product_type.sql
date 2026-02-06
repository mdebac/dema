create table product (
                      id bigint not null,
                      created_by varchar(255) not null,
                      created_on datetime(6) not null,
                      modified_by varchar(255),
                      modified_on datetime(6),

                      name varchar(255),
                      main_id bigint not null,
                      primary key (id)
) engine=InnoDB;

create table product_seq (next_val bigint) engine=InnoDB;
insert into product_seq values ( 1 );

alter table product
    add constraint FK_main_products_main
        foreign key (main_id)
            references main (id);

create table product_properties (
                               id bigint not null,
                               product_id bigint not null,
                               name varchar(255) not null,
                               unit varchar(10),
                               type enum ('INTEGER','STRING','DATE','BOOLEAN') not null,
                               primary key (id),
                               created_by varchar(255) not null,
                               created_on datetime(6) not null,
                               modified_by varchar(255),
                               modified_on datetime(6)
) engine=InnoDB;

create table product_properties_seq (next_val bigint) engine=InnoDB;
insert into product_properties_seq values ( 1 );
alter table product_properties
    add constraint FK_product_property_product
        foreign key (product_id)
            references product (id);
