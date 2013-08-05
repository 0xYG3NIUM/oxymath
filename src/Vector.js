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
