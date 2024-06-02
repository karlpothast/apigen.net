#!/bin/bash

msg=$1
git add .
git commit -m "$msg"
#git remote -v
git push origin master
