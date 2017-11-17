#!/bin/bash
sudo -u postgres psql < fillupUser.sql
sudo -u postgres psql < database.sql
sudo -u postgres psql -d fillup < PostgresSchema.sql
