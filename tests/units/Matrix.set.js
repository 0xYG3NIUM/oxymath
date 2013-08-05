testSection("Matrix.set method",function(){

	var A = $M(3,3,0);
	A.set(2,2,33);
	
	test(A.isEqual($M([[0,0,0],[0,33,0],[0,0,0]])),"Checking if element is being set");
});