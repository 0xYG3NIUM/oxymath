/*!
 * Oxymath JavaScript Library v2.0.2
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
		safe_mode:true
	}
	
	

	/**
	 * Represents a namespace accessible from outer world.
	 * @class Oxymath
	 * @constructor
	 */
	function Oxymath() {}; 
	
	
	/*
	* Internal parent object of the library
	* All objects are childs of it.
	*/
	function _Oxymath(){
	};
	
	
	/**
	* Displays error messages
	* @private
	* @method error
	* @param {string} message The massage to be printed
	*/
	var error = _Oxymath.prototype.error = function(message){
		for(var i=1; i<arguments.length;i++){
			console.log(arguments[i]);
		}
		alert(message);
		return false;	
	};
	
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
		
		parent = this.prototype;
		
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

/**
* Vector is a subclass of the Matrix and essentially is a matrix of size m x 1
* @class Vector
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
					this.forEach(function(val,m){
						return vector[m-1];
					});
					return;  
				};
					
					
				if(vector instanceof Vector){ //initializing from a matrix or a vector
					this.parent(vector);
					return;
				}	
					
				return this.error("Vector initialization error: Array or Integer or Vector expected",vector);
			};
		},
		
		
		/** 
		* Calculates dot product of the two vectors
		* @method dotProduct
		* @param {Vector} B Second vector
		* @return {number} Dot product
		*/
		dotProduct:function(B){
			var A = this;
			if(!A.isSameSize(B))
				return this.error("Vector dot product error: Vectors have different size");
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
		* Checks if parameter-vector is the same size as the current one
		* @method isSameSize
		* @param {Vector} vector Vector to compare size to
		* @return {boolean} Boolean
		*/
		isSameSize: function(vector){
			if(vector instanceof Vector)
				return this.length() === vector.length();
			else return false;
		},
				
		
		/**
		* Return the length of the vector
		* @method length
		* @return {number} Length of the vector
		*/
		length: function(){
			return this.size.m;
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
		}
	
	});
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
		return sum;
	});

};	
	
})();