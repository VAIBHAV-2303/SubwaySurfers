class Upboard{

	constructor(gl, posn) {
	  	this.position = posn;

		const positionBuffer = gl.createBuffer();		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		
		var positions = [
		-1.0, -0.8,  0.0,
	     1.0, -0.8,  0.0,
	    -1.0, 1.5,  0.0,
	     1.0, 1.5,  0.0,

		-1.0, -2.2,  0.0,
	     -0.9, -2.2,  0.0,
	    -1.0, 0.3,  0.0,
	     -0.9, 0.3,  0.0,

	     1.0, -2.2,  0.0,
	     0.9, -2.2,  0.0,
	    1.0, 0.3,  0.0,
	     0.9, 0.3,  0.0,	     
	    ];


	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	    const textureCoordBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	    const textureCoordinates = [
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
	    ]
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

	  	var faceColors = [
	    	[0.16,  0.16,  0.87,  1.0],
	    	[0.16,  0.16,  0.87,  1.0],
	    	[0.16,  0.16,  0.87,  1.0],
	  	];

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
	    	0,  1,  2,      2,  1,  3,
	    	4,  5,  6,      6,  5,  7,
	    	8,  9,  10,      10,  9,  11,
	  	];

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
	    	const vertexCount = 18;
		    const type = gl.UNSIGNED_SHORT;
	    	const offset = 0;
	    	gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  	}
	}
}