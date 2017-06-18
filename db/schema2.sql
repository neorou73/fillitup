/* fresh create the application user table */
drop table if exists appuser cascade;

create table appuser (
  auid serial not null primary key,
  timezone text,
  email text unique not null,
  disabled boolean default false,
  created date not null,
  password text not null,
  firstname text not null,
  lastname text not null);

alter table appuser owner to fillitup;

/* access tokens are stored here */
drop table if exists accesstoken cascade;

create table accesstoken (
  atid serial not null primary key,
  token text not null,
  created date not null,
  appuser integer references appuser(auid));

alter table accesstoken owner to fillitup;

/* question types definitions */
drop table if exists questiontype cascade;

create table questiontype (
  qtid serial not null primary key,
  name text not null,
  description text);

alter table questiontype owner to fillitup;

insert into questiontype (name, description) values ('open text question','the response should be plain free form text stored as utf-8 characters');
insert into questiontype (name, description) values ('single selection question','returns a single text response from an array of preset choices');
insert into questiontype (name, description) values ('multiple selection question','returns an array of two or more responses from an array of preset choices');
insert into questiontype (name, description) values ('file upload','the response should be an array of one or more URLs to an uploaded file');

/* form template defines the template metadata */
drop table if exists formtemplate cascade;

create table formtemplate (
  ftid serial not null primary key,
  title text not null,
  created date not null,
  description text,
  owner integer not null references appuser(auid),
  published date);

alter table formtemplate owner to fillitup; 

/* form instance specified here */
drop table if exists forminstance cascade;

create table forminstance (
  fiid serial not null primary key,
  template integer references formtemplate(ftid),
  owner integer not null references appuser(auid),
  submitted date,
  created date not null);

alter table forminstance owner to fillitup;

/* form question */
drop table if exists formquestion cascade;

create table formquestion (
  fqid serial not null primary key,
  numberorder integer,
  questiontype integer references questiontype(qtid),
  prompt text not null,
  choices text[][]);

alter table formquestion owner to fillitup;

/* formquestion associated attachments */
drop table if exists formquestionassociatedattachment;

create table formquestionassociatedattachment (
  fqaaid serial not null primary key,
  name text not null,
  description text not null,
  uploaded date not null,
  url text not null,
  formquestion integer references formquestion(fqid) not null);

alter table formquestionassociatedattachment owner to fillitup;

/* form instance response */
drop table if exists forminstanceresponse cascade;

create table forminstanceresponse (
  firid serial not null primary key,
  question integer references formquestion(fqid),
  response text,
  forminstance integer references forminstance(fiid));

alter table forminstanceresponse owner to fillitup;

/* forminstanceresponse associated attachments */
drop table if exists forminstanceresponseassociatedattachment;

create table forminstanceresponseassociatedattachment (
  firaaid serial not null primary key,
  name text not null,
  description text not null,
  uploaded date not null,
  url text not null,
  forminstanceresponse integer references forminstanceresponse(firid) not null);

alter table forminstanceresponseassociatedattachment owner to fillitup;


/* functions to insert user */
DROP FUNCTION if exists newappuser(text, text, text, text, text);

CREATE FUNCTION newappuser(tz text, uemail text, upw text, ufname text, ulname text)
  RETURNS void AS
  $BODY$
      BEGIN
        INSERT INTO appuser(timezone, email, disabled, created, password, firstname, lastname)
        VALUES(tz, uemail, false, now(), md5(upw), ufname, ulname);
      END;
  $BODY$
  LANGUAGE 'plpgsql';

alter function newappuser(text, text, text, text, text) owner to fillitup;

/* function to create a new user access token */
DROP FUNCTION if exists newuseraccesstoken(text);

CREATE FUNCTION newuseraccesstoken(appuseruuid text)
  RETURNS void AS
  $BODY$
      BEGIN
        INSERT INTO accesstoken(token, created, appuser)
        VALUES('test', now(), appuseruuid);
      END;
  $BODY$
  LANGUAGE 'plpgsql';

alter function newuseraccesstoken(text) owner to fillitup;

/* grant all on schema public to fillitup user role */

grant all on schema public to fillitup;
