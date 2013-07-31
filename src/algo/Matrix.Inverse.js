function inverse(A){
	if(!(A instanceof Matrix))
		throw new Error("Only matrices can be inverted", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(A.size.n !== A.size.m)
		throw new Error("Inverse error: Matrix must be square", ERROR_TYPE.DIMENSION_ERROR);
	
		
	a_decomposed = A.lu();
	var Y = forwardSubstitution(a_decomposed.L,a_decomposed.P.times(new Identity(A.size.m)));
	
	return backSubstitution(a_decomposed.U,Y);
}