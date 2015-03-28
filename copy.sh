#!/bin/bash
set -e
filename=${1:2}
filename=${filename//\//_}
cp $HOME/prog/sass-repos/$1 ./scss/$filename
