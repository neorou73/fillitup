#!/usr/bin/bash
export FLASK_APP=$1
export FLASK_ENV=development

flask run --host="0.0.0.0" --port=8321