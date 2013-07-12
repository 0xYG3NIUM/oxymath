//Matrix initialization

var Mx = Oxymath.Matrix;

var A = new Mx([[1,2,3],
				[4,5,6],
				[7,8,9]]);
			
			
var B = new Mx([[3,2,10],
				[3,4,2]]);
				
var C = new Mx([[4,3],
				[4,1],
				[9,5]]);
				

var D = A.transpose();

print(A,"times\n",D,"=\n",A.times(D));

print(B,"times\n",C,"=\n",B.times(C));

var l = B.get(1,1);
l =2;
print(B);