/** 
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
		error("Only matrices can be multiplied");
	if(A.size.n !== B.size.m)
		error("Multiplication error: Matrices size mismatch");
	
	return (new Matrix(A.size.m, B.size.n)).forEach(function(value,m,n){
		var sum = 0;
		for(var i=1; i<=A.size.n;i++)
			sum+= A.get(m,i)*B.get(i,n);
		this.set(m,n,sum);
	});

};
