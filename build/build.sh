#!/bin/sh


set -e 

#cleaning 
echo 'Cleaning...'
rm build/oxymath.dev.js
rm oxymath.min.js

echo 'Creating library...'
#creating library
cd src
cat _start.js Matrix.js Vector.js algo/MatrixMultiplication.js _end.js > ../build/oxymath.dev.js
cat ../build/oxymath.dev.js | ../node_modules/uglify-js/bin/uglifyjs -o ../oxymath.min.js
cd ..

#creating documentation with YUIDOC
echo 'Creating documentation...'
yuidoc -t ./docs/simple -o ./docs/yuidoc ./build


if [ -f ./build/local.sh ];
then
./build/local.sh
fi
