class Boots{

	constructor(gl, posn) {
	  	this.position = posn;
	  	this.rotation = 0;
	  	this.taken = 0;
		const positionBuffer = gl.createBuffer();		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		
		var positions = [0.8, -0.3, 0.0,
						 0.0, -0.3, 0.0,
						 0.0, 0.7, 0.0,
						 -0.8, -0.3, 0.0,

						0.8, 0.4, 0.0,
						 0.0, 0.4, 0.0,
						 0.0, -0.6, 0.0,
						 -0.8, 0.4, 0.0,						 
						];


	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	  	var faceColors = [[1.0,  1.0,  0.0,  1.0],
	  					  [1.0,  1.0,  0.0,  1.0],
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

	  	var indices = [0, 1, 2,    1, 2, 3,
	  				   4, 5, 6,	   5, 6, 7,	
	  				  ];

	  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
	    	new Uint16Array(indices), gl.STATIC_DRAW);

	  	this.buffers = {
	    	position: positionBuffer,
	    	color: colorBuffer,
	    	indices: indexBuffer,
	  	};
	}

	draw(gl, projectionMatrix, programInfo, deltaTime){

		const modelViewMatrix = mat4.create();

		mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
      			this.position);  // amount to translate
	  	
		mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
		[0, 1, 0]);

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
	    	const vertexCount = 12;
		    const type = gl.UNSIGNED_SHORT;
	    	const offset = 0;
	    	gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  	}
	}

	tick(){
		this.rotation+=0.05;
	}
}