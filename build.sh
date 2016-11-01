#!/bin/bash

cp src/html/index.html .
sed -i -e 's,\.\.\/\.\.\/,,g' index.html
sed -i -e 's,\.\.\/,src\/,g' index.html

npm install && bower install && npm run build

