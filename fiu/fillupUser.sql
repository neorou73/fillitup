drop table logintoken cascade;
drop table appgroup cascade;
drop table appuser cascade;
drop table appdocument cascade;

drop user if exists fillup;
create user fillup with password 'fillup' valid until 'infinity';
