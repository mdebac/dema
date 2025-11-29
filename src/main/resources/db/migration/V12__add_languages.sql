create table main_languages (
                            main_id bigint not null,
                            iso enum ('HR','FR','NL','DE','EN','ES','DK','SE','FI','IT','HU','PL','UA','RU','NO','CZ') not null
) engine=InnoDB;
alter table main_languages
    add constraint FK_main_languages_main
        foreign key (main_id)
            references main (id);
