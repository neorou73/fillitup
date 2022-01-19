truncate accesstokens;
alter table accesstokens drop constraint "accesstokens_person_fkey";
alter table accesstokens add constraint "accesstokens_person_fkey" foreign key (person) references people(email) on update cascade;