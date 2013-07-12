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
							this.forEach(function(val,m,n){
								return arr.get(m,n);
							});
							return;								
						}
					
					
						if(!(arr instanceof Array) || !arr.length || !(arr[0] instanceof Array) || !arr[0].length)
							return this.error("Matrix initialization error: Array of Arrays expected",arr);
						
						
						for(var i=0;i<arr.length;i++){
							if(!(arr[i] instanceof Array) || arr[i].length !== arr[0].length )
								return error("Matrix initialization error: Rows have different sizes");
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
						}else return error("Matrix initialization error: Wrong matrix size",m,n);
					 });
					
					//Initializing from dimensions and fill with 0s
					this.overload("init", function(m,n){
						this.init(m,n,0);
					});
				
					this._private._initialized =true;
					this.init.apply(this,arguments);//Calling constructor again after overloading
				};
			
		},
		
		
		/**
		* Sets new value for the each matrix element equal to the value that parameter function returns
		* @method forEach
		* @param {function} fn Expects function as follows function(value, index_m, index_n){return new_value};
		* @return {Object} Reference to the matrix
		*/
		forEach:function(fn){
			for(var m=0;m<this.size.m;m++)
				for (var n=0;n<this.size.n;n++)
					this._private._storage[m][n] = fn.call(this,this._private._storage[m][n],m+1,n+1);
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
		* Checks if parameter-matrix is the same size as the current one
		* @method isSameSize
		* @param {Matrix} matrix Matrix to compare size to
		* @return {Boolean} Boolean
		*/
		
		isSameSize: function(matrix){
			if(matrix instanceof Matrix)
				return this.size.m === matrix.size.m && this.size.n === matrix.size.m;
			else return false;
		},
		
		/**
		* Sets the matrix element to the specified value
		* @method set
		* @param {numeric} index_m m index
		* @param {numeric} index_n n index
		* @param value New value for the element
		*/
		set: function(index_m, index_n, value){
			this._private._storage[index_m][index_n] = value;
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
				return (new Matrix(this.size.m,this.size.n)).forEach(function(value,m,n){return multiplier*A.get(m,n);});
				
			if(multiplier instanceof Matrix){
				return naiveMatrixMultiplication(A,multiplier);
			}
			return this.error("Matrix multiplication error");
		},
		
		/**
		* Returns a new matrix which is a transpose of the current one
		* @method transpose
		* @return {Matrix} Transposed matrix
		*/
		transpose: function(){
			var A=this;
			return (new Matrix(this.size.n,this.size.m)).forEach(function(value,m,n){return A.get(n,m);});
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
				return this.error("Matrix subtraction error: Matrices have different size");
			};
			
			return A.forEach(function(val,m,n){
				return val-B.get(m,n); 
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
				return this.error("Matrix addition error: Matrices have different size");
			};
			
			return A.forEach(function(val,m,n){
				return val+B.get(m,n); 
			});
			return A;
		}
		
	});
	
/**
* Identity matrix constructor implementation
* @class Identity
*/	
var Identity = Oxymath.Identity = Matrix.subClass({
	
	/**
	* Identity matrix constructor. Creates a matrix mxm
	* @constructor
	* @method Identity 	
	* @param {number} m Matrix size
	* @return {Matrix} Matrix of size mxm
	*/
	init:function(m){
		if(!this._private._initialized){
			if(m>0){
				this.parent(m,m);
				this.forEach(function(val,m,n){
					return m===n?1:0;
				});	
			}else this.error("Error initializing identity matrix",m);
		};
	}
});

