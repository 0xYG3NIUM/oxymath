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
			var lu_dec = this.lu();
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

