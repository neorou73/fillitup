/*
connection to postgresql database
create user and tables
*/
create table appuser (
  id serial, fullname varchar(1024), username varchar(1024), 
  email varchar(1024), password varchar(1024), created date default current_timestamp, 
  groups text, active boolean default true, primary key(id));

alter table appuser owner to fillup;

create table appgroup (
  id serial, groupname varchar(1024), created date default current_timestamp,
  description text,
  active boolean default true, primary key(id));

alter table appgroup owner to fillup;

insert into appuser (fullname, username, password, created, groups) values
  ('Application Administrator','administrator',md5('admin'),now(),'admin');

insert into appgroup (groupname, created, description) values
  ('admin',now(),'Application Administration Activities');


