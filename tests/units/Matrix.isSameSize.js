testSection("Matrix isSameSize",function(){
	
	var A = $M([[1,2],[3,4]]);
	var B = $M([[2,4],[2,5]]);
	var C = $M([[1]]);
	
	test(A.isSameSize(B) && B.isSameSize(A) && !A.isSameSize(C) && !C.isSameSize(B) && !C.isSameSize(22), "isSameSize method test");
	
});