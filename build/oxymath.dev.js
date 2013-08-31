/*!
 * Oxymath JavaScript Library v0.0.1
 * http://yurigolub.com/
 *
 * @author: Yuri Golub
 * Email: oxygenych@gmail.com
 *
 * Copyright 2013
 * Released under the MIT license
 */


/**
* Oxymath library 
*@module Oxymath 
*/
(function(){
	
	
	window.Oxymath = Oxymath; //Making Oxymath visible from outside
	
	
	var config = {
		safe_mode:true,
		tol: 0.000000000001 //Tolerance when comparing matrices
	}
	
	

	/**
	 * Represents a namespace accessible from outer world.
	 * @class Oxymath
	 * @constructor
	 */
	function Oxymath() {};	
	
	
	/**
	* Reference to the ERROR_TYPE object, see source code to find out supported error types
	* @method ERROR_TYPE
	*/
	var ERROR_TYPE = Oxymath.ERROR_TYPE = {
		DIMENSION_ERROR:0,
		OBJECT_TYPE_MISMATCH:1,
		RANGE_ERROR:2,
		ZERO_DETERMINANT:3,
		UNDEFINED:100
	};
	
	/**
	* Error class constructor function
	* @private
	* @method Error
	* @param {string} error_message Error message 
	* @param {ErrorType} error_type See ERROR_TYPE_OBJECT
	* @param debug_info Optional debug info.
	*/
	var Error = Oxymath.Error = function(message, type, info){
		this.error_message = message;
		this.error_type    = type;
		this.debug_info	   = info;
	};
	
	
	
	
	/**
	* Internal parent object of the library, not accessible from outside. All objects are inherited from it.
	* @class _Oxymath
	* @constructor
	*/
	
	function _Oxymath(){
	};
	
	
	/**
	* This function is used to create objects without calling 'new' operator
	* @private
	* @method create
	* @param {function} constructor_function Function - constructor of an object
	* @param {Array} args Array containing arguments
	*/
	var create = _Oxymath.prototype.create = function(constructor_function, args){
		function f(){
			return constructor_function.apply(this,args);
		};
		f.prototype = constructor_function.prototype;
		return new f();
	}
	
	

	
	/**
	* Overloading function. Used internally to overload constructor methods
	* @private
	* @method overload
	* @param {string} name Method name
	* @param {function} fn New method function
	*/
	_Oxymath.prototype.overload = function(name,fn){
		var oldImplementation = this[name];
		
		this[name] = function(){
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
				}
			else if (typeof oldImplementation === "function") 
				return oldImplementation.apply(this,arguments);		
		};
	};
	
	
	
	// Shows if we need do init when we constructing prototypes or creating new objects
	
	var do_init = false;
	
	/**
	* Subclassing function. Creates new constructor function with the original object as a prototype
	* @private
	* @method subClass
	* @param {Object} child Object that contains additional properties that will be copied to a new constructor function
	* @return {function} New constructor function
	*/
	_Oxymath.subClass = function _subClass(child){
		
		var parent = this.prototype;
		
	 	do_init = false;
		var prototype = new this();
		do_init = true;
		
		
		for(var member in child){
			prototype[member] = typeof child[member] === "function" &&
								typeof parent[member] === "function" ?
			(function(member){ return function(){
				var old = this.parent;
				this.parent = parent[member];
				
				var result = child[member].apply(this, arguments);
				this.parent = old;
				return result;
				
			};})(member)
			:child[member];	
		
		};	
		
		function Obj(){
			this._private = {};	//For private members
			
			if(do_init && this.init){
				this.init.apply(this,arguments);
			}
		};	
		Obj.prototype = prototype;
		Obj.subClass = _subClass;
		return Obj;	
	};
	
	
	/**
* Matrix class 
* @class Matrix
*/	
var Matrix = Oxymath.Matrix = _Oxymath.subClass({
						
		/** 
		* Constructor of the Matrix class. There are several ways for creating a matrix:
		* 1: new Matrix(instance_of_another_matrix)
		* 2: new Matrix([[1,2,3],[1,2,3]]);
		* 3: new Matrix(size_m,size_n, <optional_initial_value>)
		* @method Matrix
		*/ 		
		init: function(){
				if(!this._private._initialized){
					
					
					//Declaring class members
					//Matrix dimensions
					this.size = {
									m:0, //rows
								 	n:0  //cols
								};
					
					
					var storage = this._private._storage = storage=storage?storage:[]; //Initializing storage
								
					//Overloading constructor
					//Initializing from array or matrix
					this.overload("init", function(arr){
					
						//if arr is a matrix then copy from there
						if(arr instanceof Matrix){
							this.init(arr.size.m,arr.size.n);
							this.forEach(function(m,n){
								this.set(m,n, arr.get(m,n));
							});
							return;								
						}
					
					
						if(!(arr instanceof Array) || !arr.length || !(arr[0] instanceof Array) || !arr[0].length)
							throw new Error("Matrix initialization error: Array of Arrays expected", ERROR_TYPE.OBJECT_TYPE_MISMATCH, arr);
						
						
						for(var i=0;i<arr.length;i++){
							if(!(arr[i] instanceof Array) || arr[i].length !== arr[0].length )
								throw new Error("Matrix initialization error: Rows have different sizes", ERROR_TYPE.DIMENSION_ERROR);
							storage.push(arr[i]); //Copying matrix to local storage
						};							
						
						this.size.m = arr.length;
						this.size.n = arr[0].length;
					});
					
				
					//Initializing from dimensions and fill with init_value;
					this.overload("init", function(m,n,init_value){
						if(m>0 && n>0){
							this.size.m = m;
							this.size.n = n;
						
							
							for(var i=0;i<m;i++){
								var row = (new Array(n));
								for (var k=0;k<n;k++)
									row[k]=init_value?init_value:0;		//Initializing new array with 0s 		
								storage.push(row);
							};
						}else throw new Error("Matrix initialization error: Wrong matrix size", ERROR_TYPE.DIMENSION_ERROR, {m:m,n:n});
					 });
					
					//Initializing from dimensions and fill with 0s
					this.overload("init", function(m,n){
						this.init(m,n,0);
					});
				
					this._private._initialized =true;
					this.init.apply(this,arguments);//Calling constructor again after overloading
				};
			
		},
		
		/** Calculates determinant of the matrix
		* @method det
		* @return {number} Determinant value
		*/
		det:function(){
			
			try{
				var lu_dec = this.lu();
			}catch(err){
				if(err instanceof Error && err.error_type === ERROR_TYPE.ZERO_DETERMINANT)
					return 0;
				else throw(err);
			};
			
			var det = 1;
			for( var i = 1; i <= this.size.m;i++)
				det = det*lu_dec.L.get(i,i);
			return det*lu_dec.signum;
		},	
		
		/**
		* Exchanges rows of the matrix
		* @method exchangeRows
		* @param {number} i Row number
		* @param {number} j Row number
		* @return {Object} Reference to the current matrix
		*/
		exchangeRows:function(i,j){
			if(i>this.size.m || j>this.size.m || i<1 || j<1)
				throw new Error("Wrong indices during the row exchange", ERROR_TYPE.RANGE_ERROR);
			var tmp = this._private._storage[i-1];
			this._private._storage[i-1]=this._private._storage[j-1];
			this._private._storage[j-1]=tmp;
			
			return this;
		}, 
		
		/**
		* Executes function on each matrix element and passing indices as params
		* @method forEach
		* @param {function} fn Expects function as follows function(index_m, index_n){//your code};
		* @return {Object} Reference to the matrix
		*/
		forEach:function(fn){
			for(var m=0;m<this.size.m;m++)
				this.forEachInRow(m+1,fn)				
			return this;
		},
		
		/**
		* Executes function on each row element and passing index as a param
		* @method forEachRow
		* @param {function} fn Expects function as follows function(index_m, index_n){//your code};
		* @return {Object} Reference to the matrix
		*/
		forEachInRow: function(row_number, fn){
			
			for (var n=0;n<this.size.n;n++)
				//this._private._storage[m][n] = 
				try {
					fn.call(this,row_number,n+1); 
				} catch(stop_execution){
					if(stop_execution)
						break;
				}	
				
			return this;
		},
		
		/**
		* Retrievs the value of the particular matrix element
		* @method get
		* @param {number} index_m m index
		* @param {number} index_n n index
		* @return Requested element
		*/
		get: function(index_m, index_n){
			return this._private._storage[index_m-1][index_n-1];
		},
		
		/**
		* Inverse of the matrix
		* @method inv
		* @return Inverse of the matrix
		*/
		inv:function(){
			return inverse(this);
		},
		
		/**
		* Checks if parameter-matrix has the same values as the current one
		* @method isEqual
		* @param {Matrix} matrix Matrix to compare to
		* @return {Boolean} Boolean
		*/
		isEqual: function(matrix){
			if(!(matrix instanceof Matrix) || !this.isSameSize(matrix))
				return false;
			
			var equal = true;
			this.forEach(function(m,n){
				if(Math.abs(this.get(m,n)-matrix.get(m,n))>config.tol){ 
					equal = false;
					throw true;	
				}
			});
			
			return equal;
		},
		
		/**
		* Checks if parameter-matrix is the same size as the current one
		* @method isSameSize
		* @param {Matrix} matrix Matrix to compare size to
		* @return {Boolean} Boolean
		*/
		isSameSize: function(matrix){
			if(matrix instanceof Matrix)
				return this.size.m === matrix.size.m && this.size.n === matrix.size.n;
			else return false;
		},
		
		/**
		* PA = LU Decomosition. Returns object with the next members
		* P Permutation matrix
		* L Lower triangular
		* U Upper triangular
		* signum - It has the value (-1)^n, where n is the number of interchanges in the permutation.
		* @method lu
		* @return {Matrix} object containing L,U and P matrices;
		*/
		lu:function(){
			return luCrout(this);
		},
		
		/**
		* Subtracts parameter-matrix from the matrix and returns result as new matrix instance
		* @method minus
		* @param {Matrix} B Subtrahend matrix
		* @return {Matrix} Minuend matrix as a new instance
		*/
		minus: function(B){
			var A = this;				
			var C = new Matrix(A);
			return C.unsafeMinus(B);		
		},
		
		/**
		* Adds a matrix to the current one and returns the result as a new instance of Matrix
		* @method plus
		* @param {Matrix} B Addend matrix
		* @return {Matrix} Sum
		*/
		plus: function(B){
			var A = this;				
			var C = new Matrix(A);
			return C.unsafePlus(B);						
				
		},

		/**
		* Sets the matrix element to the specified value
		* @method set
		* @param {numeric} index_m m index
		* @param {numeric} index_n n index
		* @param value New value for the element
		* @return {Object} Reference to the matrix
		*/
		set: function(index_m, index_n, value){
			this._private._storage[index_m-1][index_n-1] = value;
			
			return this;
		},
				
		/**
		* Multiplies current matrix by specified in parameter one. 
		* @method times
		* @param {Matrix} multiplier Matrix-multiplier
		* @return {Matrix} New result matrix
		*/
		times: function(multiplier){
			var A = this;
			if(typeof multiplier === "number")
				return (new Matrix(this.size.m,this.size.n)).forEach(function(m,n){this.set(m,n,multiplier*A.get(m,n));});
				
			if(multiplier instanceof Matrix){
				return naiveMatrixMultiplication(A,multiplier);
			}
			throw new Error("Matrix multiplication error",ERROR_TYPE.OBJECT_TYPE_MISMATCH);
		},
		
		/**
		* Returns a new matrix which is a transpose of the current one
		* @method transpose
		* @return {Matrix} Transposed matrix
		*/
		transpose: function(){
			var A=this;
			return (new Matrix(this.size.n,this.size.m)).forEach(function(m,n){this.set(m,n,A.get(n,m));});
		},
		
		/**
		* Subtracts parameter-matrix from the current one and stores result in the current matrix
		* @method unsafeMinus
		* @param {Matrix} B Subtrahend matrix
		* @return {Matrix} Current matrix (diminished by parameter)
		*/
		unsafeMinus: function(B){
			var A = this;
			if(!this.isSameSize(B)){
				throw new Error("Matrix subtraction error: Matrices have different size", ERROR_TYPE.DIMENSION_ERROR);
			};
			
			return A.forEach(function(m,n){
				this.set(m,n,A.get(m,n)-B.get(m,n)); 
			});
			return A;
		},
		
		/**
		* Adds a matrix to the current one and stores result in the current matrix
		* @method unsafePlus
		* @param {Matrix} B Addend matrix
		* @return {Matrix} Current matrix (increased by parameter)
		*/
		unsafePlus: function(B){//Copy new result to self
			var A = this;
			if(!this.isSameSize(B)){
				throw new Error("Matrix addition error: Matrices have different size", ERROR_TYPE.DIMENSION_ERROR);
			};
			
			return A.forEach(function(m,n){
				this.set(m,n,A.get(m,n)+B.get(m,n)); 
			});
			return A;
		}
		
	});
	
/**
* Identity matrix constructor implementation
* @class Identity
* @extends Matrix
*/	
var Identity = Oxymath.Identity = Matrix.subClass({
	
	/**
	* Identity matrix constructor. Creates an identity matrix of size MxM
	* @constructor
	* @method Identity 	
	* @param {number} m Matrix size
	* @return {Matrix} Matrix of size mxm
	*/
	init:function(m){
		if(!this._private._initialized){
			if(typeof m === "number" && m){
				this.parent(m,m);
				this.forEach(function(m,n){
					this.set(m,n,m===n?1:0);
				});	
			}else throw Error("Error initializing identity matrix",ERROR_TYPE.OBJECT_TYPE_MISMATCH,m);
		};
	}
});

/**
* Vector is a subclass of the Matrix and essentially is a matrix of size m x 1
* @class Vector
* @extends Matrix
*/	
var Vector = Oxymath.Vector = Matrix.subClass({
		/**
		* There are several ways for creating a vector:
		* 1. new Vector(elements_number)
		* 2. new Vector(instance_of_non_empty_array)
		* 3. new Vector(instance_of_another_vector)
		* @method Vector
		*/
		init:function(vector){
		
			if(!this._private._initialized){
				
				if((typeof vector === "number") && vector){ //initializing from a number
					this.parent(vector,1);
					return;
				}
					
				
				if((vector instanceof Array) && vector.length){ //initializing from an array
					
					this.parent(vector.length, 1);
					this.forEach(function(m){
						this.set(m,vector[m-1]);
					});
					return;  
				};
					
					
				if(vector instanceof Vector){ //initializing from a matrix or a vector
					this.parent(vector);
					return;
				}	
					
				throw new Error("Vector initialization error: Array or Integer or Vector expected", ERROR_TYPE.OBJECT_TYPE_MISMATCH, vector);
			};
		},
		
		
		/** 
		* Calculates dot product of the two vectors
		* @method dot
		* @param {Vector} B Second vector
		* @return {number} Dot product
		*/
		dot:function(B){
			var A = this;
			if(!A.isSameSize(B))
				throw new Error("Vector dot product error: Vectors have different size", ERROR_TYPE.DIMENSION_ERROR);
			var product = 0;
			
			for(var m=1;m<=A.length();m++)
				product+=A.get(m)*B.get(m);
			
			return product;
			
		},
		

		/**
		* Retrievs the value of the particular vector element
		* @method get
		* @param {number} index_m m index
		* @return Requested element
		*/
		get: function(index_m){
			return this.parent(index_m,1);
		},		
		
		/**
		* Subtracts parameter-vector from the vector and returns the result as a  new vector instance
		* @method minus
		* @param {Vector} B Subtrahend vector
		* @return {Vector} Minuend vector as a new instance
		*/
		minus: function(B){
			var A = this;				
			var C = new Vector(A);
			return C.unsafeMinus(B);		
		},
		
		/** Returns norm of the vector (i.e. magnitude or length)
		* @method norm
		* @return {number} norm of the vector
		*/
		norm: function(){
			var len = 0;
			
			this.forEach(function(m){
				len+=this.get(m)*this.get(m);
			});
			
			return Math.sqrt(len);
		},
		
		/**
		* Adds a vector to the current one and returns the result as a new instance of Vector
		* @method plus
		* @param {Vector} B Addend vector
		* @return {Vector} Sum
		*/
		plus: function(B){
			var A = this;				
			var C = new Vector(A);
			return C.unsafePlus(B);						
				
		},
		
		
		/**
		* Sets the vector element to a specified value
		* @method set
		* @param {numeric} index_m m index
		* @param value New value for the element
		*/
		set: function (index_m, value){
			return this.parent(index_m,1,value);
		},
		
		/**
		* Return the number of elements in the vector
		* @method length
		* @return {number} number of elements in the vector
		*/
		length: function(){
			return this.size.m;
		}
	
	});
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
//This decomposition is a Crout's imlementation



function luCrout(A){

	if(!(A instanceof Matrix))
		throw new Error("Only matrices can be decomposed", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(A.size.n !== A.size.m)
		throw new Error("Decomposition error: Matrix must be square", ERROR_TYPE.DIMENSION_ERROR);
	
	var size = A.size.n
	
	
	var P = new Identity(size);
	var L = new Identity(size);
	var U = new Matrix(A);
	var signum=1; //(-1)^n where n - number of permutations
	
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

};
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

function inverse(A){
	if(!(A instanceof Matrix))
		throw new Error("Only matrices can be inverted", ERROR_TYPE.OBJECT_TYPE_MISMATCH);
	if(A.size.n !== A.size.m)
		throw new Error("Inverse error: Matrix must be square", ERROR_TYPE.DIMENSION_ERROR);
	
		
	var a_decomposed = A.lu();
	var Y = forwardSubstitution(a_decomposed.L,a_decomposed.P.times(new Identity(A.size.m)));
	
	return backSubstitution(a_decomposed.U,Y);
}
Oxymath.createMatrix = function(){return create(Matrix, arguments);};
Oxymath.createVector = function(){return create(Vector, arguments);};
Oxymath.createIdentity = function(){return create(Identity, arguments);};
	
})();

//Shortcuts
$M = Oxymath.createMatrix;
$V = Oxymath.createVector;
$I = Oxymath.createIdentity;
