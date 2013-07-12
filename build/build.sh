#!/bin/sh

set -e 

#cleaning 
echo 'Cleaning...'
rm build/oxymath.dev.js
rm oxymath.min.js

echo 'Creating library...'
#creating library
cd src
cat start.js Matrix.js Vector.js algo/MatrixMultiplication.js end.js > ../build/oxymath.dev.js
cat ../build/oxymath.dev.js | ../node_modules/uglify-js/bin/uglifyjs -o ../oxymath.min.js
cd ..

#creating documentation
echo 'Creating documentation...'
yuidoc -t ./docs/simple -o ./docs/yuidoc ./build

