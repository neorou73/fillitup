/*
connection to postgresql database
create user and tables
*/

drop table if exists appuser cascade;
create table appuser (
  id serial, fullname varchar(1024), username varchar(1024),
  email varchar(1024), password varchar(1024), created date default current_timestamp,
  groups text, active boolean default true, primary key(id));
alter table appuser owner to fillup;

drop table if exists appgroup cascade;
create table appgroup (
  id serial, groupname varchar(1024), created date default current_timestamp,
  description text,
  active boolean default true, primary key (id));
alter table appgroup owner to fillup;

insert into appuser (fullname, username, email, password, created, groups) values
  ('Application Administrator', 'administrator', 'fake@random.com', md5('admin'), now(), 'administrator');

insert into appgroup (groupname, created, description) values
  ('administator',now(),'Application Administration Activities'),
  ('contributor',now(),'Application Usage Activities');

drop table if exists logintoken cascade;
create table logintoken (
  id serial,
  token text not null, appuser integer not null references appuser (id),
  created date not null default current_timestamp, logged_out date, primary key (id));
alter table logintoken owner to fillup;

drop table if exists appdocument cascade;
create table appdocument (
  id varchar(50), title text,
  creator integer not null references appuser (id),
  document json not null,
  created date default current_timestamp, primary key (id));
alter table appdocument owner to fillup;

insert into appuser (fullname, username, email, password) values ('Test User', 'testuser','neorou@gmail.com',md5('secret!'));
