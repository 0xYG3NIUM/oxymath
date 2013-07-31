
(function(){

	var results;
	var test_container = document.createElement('ul');
	document.body.appendChild(test_container);
	
	this.test = function test(condition, test_description){
		var li = document.createElement('li');
		li.style.color = condition ? 'green' : 'red';
		li.appendChild(document.createTextNode(test_description))
		results.appendChild(li);
		if(!condition)
			li.parentNode.parentNode.style.color='red';
		return li;	
	};
	
	this.testSection = function testSection(description,fn){
		results = test_container;
		results = test(true, description).appendChild(document.createElement('ul'));
		fn();
	};	

})();



function print(obj){
	if(arguments.length>1){
		for(var i=0; i<arguments.length; i++)
			print(arguments[i]);
		return;
	};
	
	decimal_digits = 9; // 
	
	switch(typeof obj){
	
	case "object":
		if(obj instanceof Oxymath.Vector){
			var line = "";
			for(var m=1;m<=obj.size.m;m++){
				line+=obj.get(m).toFixed(decimal_digits)+" ";
			}
			console.log(line);
			console.log("\n");
			return;
		}
		
		if(obj instanceof Oxymath.Matrix){
			for(var m=1;m<=obj.size.m;m++){
				var line = "";
				for(var n=1;n<=obj.size.n;n++)
					line+=obj.get(m,n).toFixed(decimal_digits)+" ";
				console.log(line);
			}
			console.log("\n");
			return;
		}
		
		console.log(obj);
		return;
	
	case "number":
		console.log(obj.toFixed(decimal_digits));
		return;
	
	default:
		console.log(obj);	
	}
	return obj;
};



Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};





