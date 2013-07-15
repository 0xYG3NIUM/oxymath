//Matrix initialization

var Mx = Oxymath.Matrix;


var A = new Mx([[1,2,3,4,5],[1]]); //Error size mismatch

A = new Mx([[1,2,3],
			[2,4,5],
			[6,1,3]]);
			
print(A);




//Initialization with zeroes



var B = new Mx(4,8);
print(B);


//identity

var I = new Oxymath.Identity(3);
print("Identity: \n",I);
