/* 
* Naive matrix multiplication
* @private
* @method naiveMatrixMultiplication
* @for Oxymath
* @param {Matrix} A Matrix A
* @param {Matrix} B Matrix B
* @return {Matrix} New result matrix
*/
function naiveMatrixMultiplication(A,B){
	if(!(A instanceof Matrix) || !(B instanceof Matrix))
		throw new Error("Only matrices or Vectors can be multiplied", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(A.size.n !== B.size.m)
		throw new Error("Multiplication error: Matrices size mismatch", ERROR_TYPE.DIMENSION_ERROR);
	
	var C = B instanceof Vector ? new Vector(A.size.m) : new Matrix(A.size.m, B.size.n)
	
	return C.forEach(function(m,n){
		var sum = 0;
		for(var i=1; i<=A.size.n;i++)
			sum+= A.get(m,i)*B.get(i,n);
		C instanceof Vector ? this.set(m,sum) : this.set(m,n,sum);
	});

};
