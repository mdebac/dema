
alter table menu ADD COLUMN price decimal(38,2);
alter table item ADD COLUMN price decimal(38,2);

create table orders (
                      id bigint not null,
                      created_by varchar(255) not null,
                      created_on datetime(6) not null,
                      modified_by varchar(255),
                      modified_on datetime(6),

                      order_tracking_number varchar(255),
                      total_quantity int,
                      total_price decimal(38,2),
                      status varchar(255),

                      owner_id bigint,
                      primary key (id)
) engine=InnoDB;
create table orders_seq (next_val bigint) engine=InnoDB;
insert into orders_seq values ( 1 );

alter table orders
    add constraint FK_order_owner
        foreign key (owner_id)
            references _user (id);

create table order_items (
                        quantity int,
                        product_id bigint not null,
                        order_id bigint not null
) engine=InnoDB;

alter table order_items
    add constraint FK_order_order_items
        foreign key (order_id)
            references orders (id);


create table address (
                           order_id bigint not null,
                           address_type enum ('SHIPPING','BILLING') not null,
                           street varchar(255),
                           city varchar(255),
                           state varchar(255),
                           country varchar(255),
                           zip_code varchar(255)
) engine=InnoDB;

alter table address
    add constraint FK_address_order
        foreign key (order_id)
            references orders (id);

ALTER TABLE item
    MODIFY COLUMN chip
        ENUM ('TEXT','JOB','PICTURE','VIDEO','FORM','TABLE','SETTINGS','SHOPPING_ITEM','SHOPPING_CARD','DOMAINS',
            'MOVE_RIGHT','MOVE_LEFT','HOTEL_SEARCH');
