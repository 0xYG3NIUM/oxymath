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
	
	
	