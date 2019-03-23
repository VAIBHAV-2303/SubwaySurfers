class Track{

	constructor(gl, posn) {
	  	this.position = posn;

		const positionBuffer = gl.createBuffer();		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		
		var positions = [
		-0.4, -0.9,  -3000.0,
	     -0.3, -0.9,  -3000.0,
	     -0.3, -0.9,  3000.0,
	    -0.4, -0.9,  3000.0,
	    
	    0.3, -0.9,  -3000.0,
	     0.4, -0.9,  -3000.0,
	     0.4, -0.9,  3000.0,
	    0.3, -0.9,  3000.0,
	    ];

	    for(var i=0;i<1000;i++){
	    	positions.push.apply(positions, [-0.5, -0.95, -i-0.5, 
	    									 0.5, -0.95, -i-0.5,
	    									 0.5, -0.95, -i,
	    									 -0.5, -0.95, -i,
	    									 ]
	    						);
	    }

	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	    var textureCoordBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	    var textureCoordinates = [
	    	0.0, 0.0,
	    	3.0, 0.0, 
	    	3.0, 1.0,
	    	0.0, 1.0,

	    	0.0, 0.0,
	    	3.0, 0.0, 
	    	3.0, 1.0,
	    	0.0, 1.0,
	    ];
		for(var i=0;i<1000;i++){
	    	textureCoordinates.push.apply(textureCoordinates, [ 0.0, 0.0,
														    	0.0, 1.0,
														    	2.0, 0.0, 
														    	2.0, 1.0,
	    									 				  ]
	    						         );
	    }	    
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);


  		
	  	var faceColors = [
	    	[0.23,  0.23,  0.22,  1.0],
	    	[0.23,  0.23,  0.22,  1.0],
	  	];

	  	for(var i=0;i<1000;i++){
	  		faceColors.push.apply(faceColors, [[0.502, 0.502, 0.502, 1.0],]);
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

	  	var indices = [
	    	0,  1,  2,      0,  2,  3,
	    	4, 5, 6,        4, 6, 7,
	  	];

	  	for(var i=2;i<1002;i++){
	  		indices.push.apply(indices, [4*i, 4*i+1, 4*i+2, 	4*i, 4*i+2, 4*i+3,]);
	  	}

	  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
	    	new Uint16Array(indices), gl.STATIC_DRAW);

	  	this.buffers = {
	    	position: positionBuffer,
	    	color: colorBuffer,
	    	indices: indexBuffer,
	    	textureCoord: textureCoordBuffer,
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

	  // Tell WebGL how to pull out the colors from the color buffer
	  // into the vertexColor attribute.
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

	  		// Tell WebGL which indices to use to index the vertices
	  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

	  		// Tell WebGL to use our program when drawing

	  	gl.useProgram(programInfo.program);

	  		// Set the shader uniforms

	  	gl.uniformMatrix4fv(
	     	programInfo.uniformLocations.projectionMatrix,
	      	false,
	      	projectionMatrix);
	  	gl.uniformMatrix4fv(
	      	programInfo.uniformLocations.modelViewMatrix,
	      	false,
	      	modelViewMatrix);

	  	{
	    	const vertexCount = 6012;
		    const type = gl.UNSIGNED_SHORT;
	    	const offset = 0;
	    	gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  	}
	}
}