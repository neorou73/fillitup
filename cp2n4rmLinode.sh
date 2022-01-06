#!/usr/bin/bash

#echo "to copy from linode, please issue:"
#echo "     scp -r -i /home/krispy/.ssh/id_rsa vagrant@45.79.185.245:/home/vagrant/entitytocopy ./path/to/entity/locally"
#echo "to copy to linode, please issue:"
#echo "     scp -r -i /home/krispy/.ssh/id_rsa ./path/to/entity/locally vagrant@45.79.185.245:/home/vagrant/entitytocopy"

#echo $1
#echo $2
#echo $3

if [ "$1" == "cp2" ]; then 
    echo "copying to linode..."
    if [ -z "$2" ]; then 
        echo "no source entity provided; please provide source entity path as argument"
    else 
        if [ -z "$3" ]; then 
            echo "no target entity provided; please provide target entity path as argument"
        else 
            echo "source is $2 on local server and destination is vagrant@45.79.185.245:$3"
            scp -r -i /home/krispy/.ssh/id_rsa $2 vagrant@45.79.185.245:$3
        fi 
    fi     
elif [ "$1" == "cp4rm" ]; then
    echo "copying from linode..."
    if [ -z "$2" ]; then 
        echo "no source entity provided; please provide source entity path as argument"
    else 
        if [ -z "$3" ]; then 
            echo "no target entity provided; please provide target entity path as argument"
        else 
            echo "source is vagrant@45.79.185.245:$2 and destination is $3 on local server"
            scp -r -i /home/krispy/.ssh/id_rsa vagrant@45.79.185.245:$2 $3
        fi 
    fi 
else
    echo "invalid action; please use cp2 or cp4rm as first argument!"
fi