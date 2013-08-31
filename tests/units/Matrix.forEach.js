testSection("Matrix forEach",function(){

	var A = $M([[1,1],[1,1]]);
	
	A.forEach(function(m,n){
			this.set(m,n,this.get(m,n)+1);
		});
	
	test(A.isEqual($M([[2,2],[2,2]])),"Increasing each element by 1");
});