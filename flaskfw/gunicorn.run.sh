#!/usr/bin/bash 
killall gunicorn 
gunicorn -w 2 -b 0.0.0.0:9321 --log-file "$(date +%F).gunicorn.log" api:app & 