function inverse(A){
	if(!(A instanceof Matrix))
		return error("Only matrices can be decomposed");
	if(A.size.n !== A.size.m)
		return error("Decomposition error: Matrix must be square");
		
	a_decomposed = A.lu();
	var Y = forwardSubstitution(a_decomposed.L,a_decomposed.P.times(new Identity(A.size.m)));
	
	return backSubstitution(a_decomposed.U,Y);
}