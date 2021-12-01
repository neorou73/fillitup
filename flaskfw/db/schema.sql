drop database fillitup;
create database fillitup;
drop role fillitupadmin;
create role fillitupadmin with login superuser password '1+5@secret!' valid until 'infinity';

\c fillitup 

create table people (
    id serial,
    username varchar(255) not null unique,
    email varchar(255) not null primary key,
    password varchar(255) not null,
    tscreated timestamp default current_timestamp,
    changelog json);

/* 4d9820104357e42325bce5f0ecccdaa7b3b42af2e59ac4de8217aa37ddd8948e is a hashed value of 1+5@secret!*/
insert into people (username, email, password, tscreated) values ('admin','superuser@org.org','4d9820104357e42325bce5f0ecccdaa7b3b42af2e59ac4de8217aa37ddd8948e', now());

alter table people owner to fillitupadmin;

create table accesstokens (
    person varchar(255) references people(email),
    token text not null,
    tscreated timestamp default current_timestamp,
    loggedout timestamp default null,
    ttd integer default 86400);

alter table accesstokens owner to fillitupadmin;

create table htmlcontent (
    id serial,
    title varchar(255) not null primary key,
    content text,
    meta json,
    tscreated timestamp default current_timestamp,
    published boolean default false);

alter table htmlcontent owner to fillitupadmin;

create table htmlcontentchanges (
    id serial,
    htctitle varchar(255) references htmlcontent(title),
    contentdata text,
    metadata json,
    tscreated timestamp default current_timestamp);

alter table htmlcontentchanges owner to fillitupadmin;

create table uploads (
    id serial,
    filename varchar(255) not null,
    fullpath text,
    filetype varchar(255),
    tscreated timestamp default current_timestamp,
    published boolean default false);

alter table uploads owner to fillitupadmin;