var Vec = Oxymath.Vector;

var A = new Vec([1,2,3,4,5]);
var B = new Vec([1.1,1.2,1.4,1.00001,2]);
var C = new Vec([1,2]);


print("C=",C,"times 3=\n",C.times(3));
print("A=",A,"dot B=", B, "=\n", A.dotProduct(B));