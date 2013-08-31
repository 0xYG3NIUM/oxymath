testSection("Exchange rows test", function(){

	var A = $M([[1,2,3],
				[4,5,6],
				[7,8,9]]);
		
	test($M([[7,8,9],[4,5,6],[1,2,3]]).isEqual(A.exchangeRows(3,1)),"Exchanging rows...");
	
	});