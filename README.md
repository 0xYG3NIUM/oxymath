Oxymath library
=======

Simple JS library for matrix and vector manipulations

Documentation - http://www.yurigolub.com/oxymath_documentation/<br>
Developer version - http://raw.github.com/oxygenych/oxymath/master/build/oxymath.dev.js<br>
Production version(minimized) - http://raw.github.com/oxygenych/oxymath/master/oxymath.min.js<br>
<br><br>
<b>
Code example:
</b>
```JavaScript

//$M is a shortcut for 	new Oxymath.Matrix
var A = $M([[ 1,  8, -9,  7, 5], 
            [ 0,  1,  0,  4, 4], 
            [ 0,  0,  1,  2, 5], 
            [ 0,  0,  0,  1,-5], 
            [ 0,  0,  0,  0, 1]]);

A.det(); //returns determinant (1 in this case);

A.inv(); //returns new matrix - inverse of A

var decomposition = A.lu(); //performs PA = LU decomposition

//$I is a shortcut for new Oxymath.Identity
var B = $I(5); //Creating 5x5 identity matrix

var C = A.plus(B);  //Matrix algebra
var D = A.minus(B); 
var E = A.times(5);
var F = A.times(B);

A.get(1,1); //returns 1
A.set(1,1,4); //sets element's value to 4


//Vectors

//$V is a shortcut for new Oxymath.Vector
var a = $V([1,2,3,4,5]);

a.norm(); //vector length (not size)

var b = $V([1,1,1,1,1]);

var c = a.dot(b); //dot product


```
