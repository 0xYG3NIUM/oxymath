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
	
	
	