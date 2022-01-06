#!/usr/bin/bash
mkdir -p backup
pg_dump -c fillitup > backup/fillitup.sql
cp -r static/fileuploads backup/fileuploads
tar -cvzf backup.tar.gz backup