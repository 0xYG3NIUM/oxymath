Oxymath.createMatrix = function(){return create(Matrix, arguments);};
Oxymath.createVector = function(){return create(Vector, arguments);};
Oxymath.createIdentity = function(){return create(Identity, arguments);};
	
})();



//Shortcuts
$M = Oxymath.createMatrix;
$V = Oxymath.createVector;
$I = Oxymath.createIdentity;
