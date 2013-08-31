//This decomposition is a Crout's imlementation



function luCrout(A){

	if(!(A instanceof Matrix))
		throw new Error("Only matrices can be decomposed", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(A.size.n !== A.size.m)
		throw new Error("Decomposition error: Matrix must be square", ERROR_TYPE.DIMENSION_ERROR);
	
	var size = A.size.n
	
	
	P = new Identity(size);
	L = new Identity(size);
	U = new Matrix(A);
	signum=1; //(-1)^n where n - number of permutations
	
	for(var i = 1; i <= size; i++){
	
		if(U.get(i,i) == 0){ //trying to do row exchange if 0 is in the pivot position
		
			var max_index=i;
			
			for(var j=i; j<=size;j++)
				if(U.get(j,i)>U.get(max_index,i))
					max_index=j;
			
			if(U.get(max_index,i) != 0){
				U.exchangeRows(i,max_index);
				P.exchangeRows(i,max_index);
				signum = signum * -1;
			}else throw new Error("Decomposition error: Matrix is singular", ERROR_TYPE.ZERO_DETERMINANT);
			
		}
		
		//Reducing pivot to 1
		if( U.get(i,i) != 1 ){ // we need reduction in order to achive RREF
			L.set(i,i,U.get(i,i)); 
			U.forEachInRow(i,function(m,n){this.set(m,n,this.get(m,n)/L.get(i,i));});	
		};
		
		if( i != size) //nothing to do in the case of last roww
			for(var j=i+1; j<=size;j++){
				var pivot = U.get(j,i);
				L.set(j,i,pivot);
				U.forEachInRow(j,function(m,n){this.set(m,n,this.get(m,n)-pivot*this.get(i,n));});
			}
	}
	
	return {
		A:A,
		P:P,
		U:U,
		L:L,
		signum:signum
	};

}