//Back substitution when the input is in form UX=B 
//returns matrix X

function backSubstitution(U,B){
	if(!(U instanceof Matrix) || !(B instanceof Matrix))
		throw new Error("BackSubstitution Error: Expecting 2 matrices", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(U.size.n!=B.size.m)
		throw new Error("BackSubstitution Error: B and U size mismatch", ERROR_TYPE.DIMENSION_ERROR);
	
	
	var X = new Matrix(B.size.m,B.size.n,0);
	
	for(var j = 1; j<=B.size.n; j++){
		//for Each in row of B
		for(var i = B.size.m; i>= 1; i--){
			//for each in column of B
			X.set(i,j,B.get(i,j));
			for(var k = i+1; k<=B.size.m;k++)
				X.set(i,j,X.get(i,j)-U.get(i,k)*X.get(k,j));
			X.set(i,j,X.get(i,j)/U.get(i,i));
		}
			
	}
	
	return X;

};

//Back substitution when the input is in form LX=B 
//returns matrix X
function forwardSubstitution(L,B){
	if(!(L instanceof Matrix) || !(B instanceof Matrix))
		throw new Error("ForwardSubstitution Error: Expecting 2 matrices", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(L.size.n!=B.size.m)
		throw new Error("ForwardSubstitution Error: B and U size mismatch", ERROR_TYPE.DIMENSION_ERROR);
			
	
	var X = new Matrix(B.size.m,B.size.n,0);
	
	for(var j = 1; j<=B.size.n; j++){
		//for Each in row of B
		for(var i = 1; i<= B.size.m; i++){
			X.set(i,j,B.get(i,j));
			for(var k = 1; k<=i-1;k++)
				X.set(i,j,X.get(i,j)-L.get(i,k)*X.get(k,j));	
			X.set(i,j,X.get(i,j)/L.get(i,i));
		}
	}
	
	return X;

};

