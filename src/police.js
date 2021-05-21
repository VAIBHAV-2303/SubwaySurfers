class Police{

	constructor(gl, posn) {
	  	this.position = posn;
	  	this.speed = [0, 0, -0.1];
		this.movingLeft = 0;
		this.movingRight = 0;

		const positionBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		
		var positions = [];

		for(var i=0;i<360;i+=2){
			positions.push.apply(positions, [0.0, 0.6, 0.0,
											 0.2*Math.cos(i*3.14/180.0), 0.2*Math.sin(i*3.14/180.0)+0.6, 0.0,
											 0.2*Math.cos((i+1)*3.14/180.0), 0.2*Math.sin((i+1)*3.14/180.0)+0.6, 0.0,
											 0.2*Math.cos((i+4)*3.14/180.0), 0.2*Math.sin((i+2)*3.14/180.0)+0.6, 0.0,
											]
								);
		}
		positions.push.apply(positions, [0.1, 0.4, 0.0,
										 -0.1, 0.4, 0.0,
										 -0.1, -0.15, 0.0,
										 0.1, -0.15, 0.0, 
										]
							);
		positions.push.apply(positions, [0.1, 0.3, 0.0,
										 0.1, 0.25, 0.0,
										 0.25, 0.1, 0.0,
										 0.27, 0.15, 0.0, 
										]
							);

		positions.push.apply(positions, [-0.1, 0.3, 0.0,
										 -0.1, 0.25, 0.0,
										 -0.25, 0.1, 0.0,
										 -0.27, 0.15, 0.0, 
										]
							);

		positions.push.apply(positions, [-0.1, -0.1, 0.0,
										 -0.1, -0.15, 0.0,
										 -0.25, -0.3, 0.0,
										 -0.27, -0.25, 0.0, 
										]
							);

		positions.push.apply(positions, [0.1, -0.1, 0.0,
										 0.1, -0.15, 0.0,
										 0.25, -0.3, 0.0,
										 0.27, -0.25, 0.0, 
										]
							);
		

	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	    var textureCoordBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	    
  		var textureCoordinates = [];

  		for(var i=0;i<360;i+=2){
			textureCoordinates.push.apply(textureCoordinates, [0.0, 0.0,
													    	1.0, 0.0, 
													    	1.0, 1.0,
													    	0.0, 1.0,]
								);
		}

	    textureCoordinates.push.apply(textureCoordinates, [
	    	0.0, 0.0,
	    	1.0, 0.0, 
	    	1.0, 1.0,
	    	0.0, 1.0,
	    	0.0, 0.0,
	    	1.0, 0.0, 
	    	1.0, 1.0,
	    	0.0, 1.0,
	    	0.0, 0.0,
	    	1.0, 0.0, 
	    	1.0, 1.0,
	    	0.0, 1.0,
	    	0.0, 0.0,
	    	1.0, 0.0, 
	    	1.0, 1.0,
	    	0.0, 1.0,
	    	0.0, 0.0,
	    	1.0, 0.0, 
	    	1.0, 1.0,
	    	0.0, 1.0,
	    ]);
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

	  	var faceColors = [];
	  	for(var i=0;i<185;i++){
	  		faceColors.push.apply(faceColors, [[0.0,  0.0,  1.0,  1.0],]);
	    }
	  	var colors = [];


	  	for (var j = 0; j < faceColors.length; ++j) {
	    	const c = faceColors[j];

	    	colors = colors.concat(c, c, c, c);
	  	}

	  	const colorBuffer = gl.createBuffer();
	  	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	  	const indexBuffer = gl.createBuffer();
	  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	  	var indices = [];

	  	for(var i=0;i<185;i++){
	  		indices.push.apply(indices, [4*i, 4*i+1, 4*i+2, 	4*i, 4*i+2, 4*i+3,]);
	  	}


	  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
	    	new Uint16Array(indices), gl.STATIC_DRAW);

	  	this.buffers = {
	    	textureCoord: textureCoordBuffer,
	    	position: positionBuffer,
	    	color: colorBuffer,
	    	indices: indexBuffer,
	  	};
	}

	draw(gl, projectionMatrix, programInfo, deltaTime, textOn, texture){

		const modelViewMatrix = mat4.create();

		mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
      			this.position);  // amount to translate
	  	
	  	{
	    const numComponents = 3;
	    const type = gl.FLOAT;
	    const normalize = false;
	    const stride = 0;
	    const offset = 0;
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
	    gl.vertexAttribPointer(
	        programInfo.attribLocations.vertexPosition,
	        numComponents,
	        type,
	        normalize,
	        stride,
	        offset);
	    gl.enableVertexAttribArray(
	        programInfo.attribLocations.vertexPosition);
	  	}

	  	if(textOn==0){
	  	{
		const numComponents = 4;
	    const type = gl.FLOAT;
	    const normalize = false;
	    const stride = 0;
	    const offset = 0;
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
	    gl.vertexAttribPointer(
	       	programInfo.attribLocations.vertexColor,
	       	numComponents,
	       	type,
	       	normalize,
	       	stride,
	       	offset);
	    gl.enableVertexAttribArray(
	       	programInfo.attribLocations.vertexColor);
	  	}
	  }
	  else{
	  	{
		    const num = 2; // every coordinate composed of 2 values
		    const type = gl.FLOAT; // the data in the buffer is 32 bit float
		    const normalize = false; // don't normalize
		    const stride = 0; // how many bytes to get from one set to the next
		    const offset = 0; // how many bytes inside the buffer to start from
		    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
		    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
		    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	  }

	  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);


	  	gl.useProgram(programInfo.program);

	  	gl.uniformMatrix4fv(
	     	programInfo.uniformLocations.projectionMatrix,
	      	false,
	      	projectionMatrix);
	  	gl.uniformMatrix4fv(
	      	programInfo.uniformLocations.modelViewMatrix,
	      	false,
	      	modelViewMatrix);

	  	{
	    	const vertexCount = 185*6;
		    const type = gl.UNSIGNED_SHORT;
	    	const offset = 0;
	    	gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  	}
	}

	tick(surferXpos){
		this.position[2] += this.speed[2];
		this.speed[2] -= 0.002;
		this.speed[2] = Math.max(this.speed[2], -0.2);
		
		this.position[1] += this.speed[1];
		if(this.position[1] > -0.4){
			this.speed[1] -= 0.025;
		}
		else{
			this.position[1] = -0.4;
			this.speed[1] = 0;
		}
		

		if(this.speed[1]!=0){
			this.position[0] += this.speed[0];
		}
		else{
			this.speed[0]=0;
		}

		if(surferXpos>0.0){
			this.moveRight();
		}
		else{
			this.moveLeft();
		}

	}

	jump(){
		if(this.speed[1]==0 && this.position[1]==-0.4){
			this.speed[1]=0.3;
		}
	}

	moveLeft(){
		if(this.position[0]>0.0 && this.speed[1]==0){
			this.jump();
			this.speed[0] = -0.08;
		}
	}

	moveRight(){
		if(this.position[0]<0.0 && this.speed[1]==0){
			this.jump();
			this.speed[0] = +0.08;
		}
	}
}