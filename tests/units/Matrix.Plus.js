testSection("Matrix Addition", function(){
	var A = $M([[ 2, 3, 8],
				[10, 4, 9],
				[ 4,11,22]]);
	
	var B = $M(3,3,3);
	
	test(A.plus(B).isEqual($M([[5,6,11],[13,7,12],[7,14,25]])) && A.plus(B)._private._storage.compare([[5,6,11],[13,7,12],[7,14,25]]),"Matrix addition");
	});