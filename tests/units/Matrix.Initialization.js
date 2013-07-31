testSection("Matrix initialization", function(){	

	
	
	//Correct initialization
	
	var array = [[1,2,3],
				 [4,5,6],
				 [7,8,9]];
		
	var A = $M(array); 
	test(array.compare(A._private._storage) && A.size.m===3 && A.size.n===3, 
		"Matrix initialization through the array of arrays");
	
	var B = $M(A);
	test(B._private._storage.compare(A._private._storage) && A.size.m===B.size.m && A.size.n===B.size.n,
		"Matrix initialization through another Matrix instance");
	
	var A = $M(2,2,3);
	test([[3,3],[3,3]].compare(A._private._storage) && A.size.m === 2 && A.size.n===2, 
		"Matrix initialization through dim sizes 2x2 with default value 3 ");	
	
	
	//Examples of wrong initialization
	try{
		var passed = false;
		$M([[1,2],3]); //not all elements  in array are arrays 
	}catch(e){
	    passed = (e instanceof Oxymath.Error) && e.error_type === Oxymath.ERROR_TYPE.DIMENSION_ERROR;
	}finally{
		test(passed,"Handling exception when initializing with an Array of unsupported form");
	};
	
	try{
	    passed = false;
		$M(0,10,0); //not all elements  in array are arrays 
	}catch(e){
	    passed = (e instanceof Oxymath.Error) && e.error_type === Oxymath.ERROR_TYPE.DIMENSION_ERROR;
	}finally{
		test(passed,"Handling exception when initializing with a 0-dimension");
	};
	
	try{
	    passed = false;
		$M({}); //not all elements  in array are arrays 
	}catch(e){
	    passed = (e instanceof Oxymath.Error) && e.error_type === Oxymath.ERROR_TYPE.OBJECT_TYPE_MISMATCH;
	}finally{
		test(passed,"Handling exception when initializing with an unsupported object");
	};
	
});			