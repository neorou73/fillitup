#!/bin/bash
apt-get update -y
apt-get upgrade -y
apt-get install -y libpq-dev libssl-dev build-essential virtualbox-guest-dkms python3 nginx postgresql postgresql-contrib vim git fop

ufw enable
ufw allow 80
ufw allow 8080
ufw allow 8123
ufw allow 22
ufw status
