testSection("Matrix isEqual",function(){

	var A = $M([[1,2,4,1],
			    [1,4,2,2]]);
	var B = $M([[1,2,4,1],
			    [1,4,2,2]]);
			    
	var C = $M([[1,2],[2,2]]);
	
	test(A.isEqual(B)&&B.isEqual(A)&&A.isEqual(A),"Matrix isEqual equality test");
	test(!A.isEqual(C)&&!C.isEqual(B),"Matrix isEqual inequality test");
});