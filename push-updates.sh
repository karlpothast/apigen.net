#!/bin/bash

msg=$1
git add .
git commit -m "$msg"
git push -f origin master


