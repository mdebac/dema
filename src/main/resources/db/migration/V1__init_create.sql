create table _user (
                       id bigint not null,
                       account_locked bit not null,
                       created_date datetime(6) not null,
                       date_of_birth date,
                       email varchar(255),
                       enabled bit not null,
                       firstname varchar(255),
                       host varchar(255),
                       last_modified_date datetime(6),
                       lastname varchar(255),
                       password varchar(255),
                       primary key (id)
) engine=InnoDB;
    
create table _user_roles (
                             user_id bigint not null,
                             roles_id integer not null
) engine=InnoDB;
    
create table _user_seq (
                           next_val bigint
) engine=InnoDB;
    
insert into _user_seq values ( 1 );
    
create table comment (
                         id bigint not null,
                         created_by varchar(255) not null,
                         created_on datetime(6) not null,
                         modified_by varchar(255),
                         modified_on datetime(6),
                         comment varchar(255),
                         note float(53),
                         main_id bigint not null,
                         primary key (id)
) engine=InnoDB;
    
create table comment_seq (
                             next_val bigint
) engine=InnoDB;
    
insert into comment_seq values ( 1 );
    
create table cv_data (
                         id bigint not null,
                         created_by varchar(255) not null,
                         created_on datetime(6) not null,
                         modified_by varchar(255),
                         modified_on datetime(6),
                         content mediumblob not null,
                         cover_letter_text varchar(255),
                         email varchar(255),
                         file_name varchar(255),
                         item_id bigint,
                         mime_type varchar(255) not null,
                         name varchar(255),
                         size bigint not null,
                         primary key (id)
) engine=InnoDB;
    
create table cv_data_seq (
                             next_val bigint
) engine=InnoDB;
    
insert into cv_data_seq values ( 1 );
    
create table detail (
                        id bigint not null,
                        created_by varchar(255) not null,
                        created_on datetime(6) not null,
                        modified_by varchar(255),
                        modified_on datetime(6),
                        background_color_on char(1) not null check (background_color_on in ('F','T')),
                        columns integer,
                        corner_radius integer,
                        show_program char(1) check (show_program in ('F','T')),
                        menu_id bigint not null,
                        panel_id bigint not null,
                        primary key (id)
) engine=InnoDB;
    
create table detail_iso (
                            detail_id bigint not null,
                            iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null,
                            label varchar(255),
                            title varchar(255)
) engine=InnoDB;
    
create table detail_seq (
                            next_val bigint
) engine=InnoDB;
    
insert into detail_seq values ( 1 );
    
create table item (
                      id bigint not null,
                      created_by varchar(255) not null,
                      created_on datetime(6) not null,
                      modified_by varchar(255),
                      modified_on datetime(6),
                      background_color varchar(255),
                      chip enum ('TEXT','JOB','PICTURE','VIDEO','FORM','TABLE','SETTINGS','SHOP') not null,
                      col_span integer,
                      content MEDIUMBLOB,
                      corner_radius integer,
                      file_name varchar(255),
                      mime_type varchar(255),
                      min_height integer,
                      order_num integer,
                      row_span integer,
                      shadow_color varchar(255),
                      size bigint not null,
                      url varchar(255),
                      detail_id bigint not null,
                      primary key (id)
) engine=InnoDB;
    
create table item_iso (
                          item_id bigint not null,
                          description varchar(2500),
                          iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null,
                          title varchar(255)
) engine=InnoDB;
    
create table item_seq (
                          next_val bigint
) engine=InnoDB;
    
insert into item_seq values ( 1 );
    
create table main (
                      id bigint not null,
                      created_by varchar(255) not null,
                      created_on datetime(6) not null,
                      modified_by varchar(255),
                      modified_on datetime(6),
                      accept_color varchar(255),
                      accept_color_light varchar(255),
                      content MEDIUMBLOB,
                      danger_color varchar(255),
                      danger_color_light varchar(255),
                      file_name varchar(255),
                      host varchar(255),
                      info_color varchar(255),
                      info_color_light varchar(255),
                      mime_type varchar(255),
                      price decimal(38,2),
                      primary_color varchar(255),
                      primary_color_light varchar(255),
                      remove_picture char(1) check (remove_picture in ('F','T')),
                      secondary_color varchar(255),
                      secondary_color_light varchar(255),
                      size bigint not null,
                      warn_color varchar(255),
                      warn_color_light varchar(255),
                      owner_id bigint,
                      primary key (id)
) engine=InnoDB;
    
create table main_iso (
                          main_id bigint not null,
                          description varchar(2000),
                          icon_text varchar(30),
                          iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null,
                          title varchar(15)
) engine=InnoDB;
    
create table main_seq (
                          next_val bigint
) engine=InnoDB;
    
insert into main_seq values ( 1 );
    
create table menu (
                      id bigint not null,
                      created_by varchar(255) not null,
                      created_on datetime(6) not null,
                      modified_by varchar(255),
                      modified_on datetime(6),
                      hide_menu_panel_if_one char(1) check (hide_menu_panel_if_one in ('F','T')),
                      icon varchar(255),
                      layout enum ('CENTER','FULL') not null,
                      order_num integer,
                      panel_on char(1) check (panel_on in ('F','T')),
                      side enum ('LEFT','RIGHT') not null,
                      main_id bigint not null,
                      primary key (id)
) engine=InnoDB;
    
create table menu_iso (
                          menu_id bigint not null,
                          iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null,
                          title varchar(255)
) engine=InnoDB;
    
create table menu_seq (
                          next_val bigint
) engine=InnoDB;
    
insert into menu_seq values ( 1 );
    
create table panel (
                       id bigint not null,
                       created_by varchar(255) not null,
                       created_on datetime(6) not null,
                       modified_by varchar(255),
                       modified_on datetime(6),
                       icon varchar(255),
                       order_num integer,
                       menu_id bigint not null,
                       primary key (id)
) engine=InnoDB;
    
create table panel_iso (
                           panel_id bigint not null,
                           description varchar(255),
                           iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null,
                           title varchar(255)
) engine=InnoDB;
    
create table panel_seq (
                           next_val bigint
) engine=InnoDB;
    
insert into panel_seq values ( 1 );
    
create table payment (
                         id bigint not null,
                         created_by varchar(255) not null,
                         created_on datetime(6) not null,
                         modified_by varchar(255),
                         modified_on datetime(6),
                         amount decimal(38,2),
                         fund varchar(255),
                         vrijeme datetime(6),
                         primary key (id)
) engine=InnoDB;
    
create table payment_seq (
                             next_val bigint
) engine=InnoDB;
    
insert into payment_seq values ( 1 );
    
create table role (
                      id integer not null,
                      created_date datetime(6) not null,
                      last_modified_date datetime(6),
                      name varchar(255),
                      primary key (id)
) engine=InnoDB;
    
create table role_seq (
                          next_val bigint
) engine=InnoDB;
    
insert into role_seq values ( 1 );
    
create table token (
                       id bigint not null,
                       created_at datetime(6),
                       expires_at datetime(6),
                       token varchar(255),
                       validated_at datetime(6),
                       user_id bigint not null,
                       primary key (id)
) engine=InnoDB;
    
create table token_seq (
                           next_val bigint
) engine=InnoDB;
    
insert into token_seq values ( 1 );

alter table _user
    add constraint UK3ll7h6igsem2hjvgui28dkq3u unique (email, host);

alter table cv_data
    add constraint UKdl106ihkr36xbdomfc1kg5wps unique (email, item_id);

alter table detail
    add constraint UK9uqjwshsvjmhff83w289uymoy unique (panel_id, menu_id);

alter table main
    add constraint UK_l393581052chrl7dwb0la635g unique (host);
    
alter table role
    add constraint UK_8sewwnpamngi6b1dwaa88askk unique (name);

alter table token
    add constraint UK_pddrhgwxnms2aceeku9s2ewy5 unique (token);
    
alter table _user_roles
    add constraint FKtq7v0vo9kka3qeaw2alou2j8p
        foreign key (roles_id)
            references role (id);
    
alter table _user_roles
    add constraint FK1knb08qasyc3njr6m6je05u4f
        foreign key (user_id)
            references _user (id);
    
alter table comment
    add constraint FK3sq0xmw55nl22ntceu7m6eq0l
        foreign key (main_id)
            references main (id);
    
alter table detail
    add constraint FK650w35a0djvheea9ecxcwiyf0
        foreign key (menu_id)
            references menu (id);
    
alter table detail
    add constraint FKql3v9fehgnc3qg7ec1c7h1jm2
        foreign key (panel_id)
            references panel (id);
    
alter table detail_iso
    add constraint FK6vmpi8icf0iltmq6a80hx3d6q
        foreign key (detail_id)
            references detail (id);
    
alter table item
    add constraint FKcc8axcluxc3ck9m98w8xcmwwp
        foreign key (detail_id)
            references detail (id);
    
alter table item_iso
    add constraint FKnbwcswlgjlakqrw5h39o0cftc
        foreign key (item_id)
            references item (id);
    
alter table main
    add constraint FK2pe3vbjsbeaue4aa1vm5bhike
        foreign key (owner_id)
            references _user (id);
    
alter table main_iso
    add constraint FKqdnp4c35916ntccvrpiwq0fpd
        foreign key (main_id)
            references main (id);
    
alter table menu
    add constraint FK3gv7x91t5jo3r057bf3a2f0gt
        foreign key (main_id)
            references main (id);
    
alter table menu_iso
    add constraint FKquw80mpoy0ohpadawg03b7tcc
        foreign key (menu_id)
            references menu (id);
    
alter table panel
    add constraint FKdc49pdfmshyd0e88a7q7cttkc
        foreign key (menu_id)
            references menu (id);
    
alter table panel_iso
    add constraint FK9fiyc6jc8rkhoj8fd9fx89wir
        foreign key (panel_id)
            references panel (id);
    
alter table token
    add constraint FKiblu4cjwvyntq3ugo31klp1c6
        foreign key (user_id)
            references _user (id);
