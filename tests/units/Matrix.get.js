testSection("Matrix.get method",function() {
	var A = $M([[1,2,3,4,5,6],[9,8,7,3,1,4]]);
	
	test(A.get(2,1)===9 && A.get(1,5)===5, "Calling get and comparing result");
	
}); 