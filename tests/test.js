function print(obj){
	if(arguments.length>1){
		for(var i=0; i<arguments.length; i++)
			print(arguments[i]);
		return;
	};
	switch(typeof obj){
	
	case "object":
		if(obj instanceof Oxymath.Vector){
			var line = "";
			for(var m=1;m<=obj.size.m;m++){
				line+=obj.get(m)+" ";
			}
			console.log(line);
			console.log("\n");
			return;
		}
		
		if(obj instanceof Oxymath.Matrix){
			for(var m=1;m<=obj.size.m;m++){
				var line = "";
				for(var n=1;n<=obj.size.n;n++)
					line+=obj.get(m,n)+" ";
				console.log(line);
			}
			console.log("\n");
			return;
		}
		
		console.log(obj);
		return;
		
	default:
		console.log(obj);	
	}

}



