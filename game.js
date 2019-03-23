cameraPos = [];
numOfCoins = 300;
numOfDownboards = 200;
numOfFlies = 5;
coinarr = [];
trainarr = [];
downboardarr = [];
upboardarr = [];
conesarr = [];
flyarr = [];
bootsarr = [];
magnetarr = [];
Score = 0;
textureOn = 0;
grayscale = 0;
textureprogramInfo = ''
nontextureprogramInfo = '';
groundtexture = '';
walltexture = '';
woodtexture = '';
metaltexture = '';
traintexture = '';
skytexture = '';
redtexture = '';
bluetexture = '';
goldtexture = '';
downtexture = '';
endtexture = '';
flashTime = 0;
totalTime = 0;

main();

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  groundtexture = loadTexture(gl, 'ground.jpg');
  walltexture = loadTexture(gl, 'wall.jpg');
  woodtexture = loadTexture(gl, 'wood.jpg');
  metaltexture = loadTexture(gl, 'tracks.jpg');
  traintexture = loadTexture(gl, 'train.jpg');
  skytexture = loadTexture(gl, 'sky.jpg');
  redtexture = loadTexture(gl, 'red.jpeg');
  bluetexture = loadTexture(gl, 'blue.jpg');
  goldtexture = loadTexture(gl, 'gold.jpg');
  downtexture = loadTexture(gl, 'down.jpg')
  endtexture = loadTexture(gl, 'end.jpg')
  
  initBuffers(gl);

  var then = 0;
  resetsources(gl);
  function render(now) {

    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    tickElements(gl);

    drawScene(gl, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function resetsources(gl){
  vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;
  fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  nontextureprogramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
  vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;
  fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  textureprogramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  vsSource = `
    attribute vec4 a_position;
	attribute vec4 a_color;
	attribute vec2 a_texCoord0;

	uniform mat4 u_modelviewTrans;
	uniform mat4 u_projTrans;

	varying lowp vec4 v_color;
	varying highp vec2 v_texCoords;

	void main() {
	    gl_Position = u_projTrans * u_modelviewTrans *a_position;
	    v_color = a_color;
	    v_texCoords = a_texCoord0;
	}
  `;
  fsSource = `
    precision mediump float;
    varying lowp vec4 v_color;
	varying highp vec2 v_texCoords;
	uniform sampler2D u_texture;

	void main() {
	        vec4 color = texture2D(u_texture, v_texCoords);
	        float graycolor = 0.299*color.r + 0.587*color.g + 0.114*color.b;
	        gl_FragColor = vec4(vec3(graycolor), color.a);
	}
  `;
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  grayscaleprogramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'a_position'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'a_texCoord0'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'u_projTrans'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'u_modelviewTrans'),
      uSampler: gl.getUniformLocation(shaderProgram, 'u_texture'),
    },
  };

  vsSource = `
    attribute vec4 a_position;
	attribute vec4 a_color;
	attribute vec2 a_texCoord0;

	uniform mat4 u_modelviewTrans;
	uniform mat4 u_projTrans;

	varying lowp vec4 v_color;
	varying highp vec2 v_texCoords;

	void main() {
	    gl_Position = u_projTrans * u_modelviewTrans *a_position;
	    v_color = a_color;
	    v_texCoords = a_texCoord0;
	}
  `;
  fsSource = `
    precision mediump float;
    varying lowp vec4 v_color;
	varying highp vec2 v_texCoords;
	uniform sampler2D u_texture;

	void main() {
	        vec4 color = texture2D(u_texture, v_texCoords);
	        gl_FragColor = vec4(1.2*color.r, 1.2*color.g, 1.2*color.b, color.a);
	}
  `;
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  flashprogramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'a_position'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'a_texCoord0'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'u_projTrans'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'u_modelviewTrans'),
      uSampler: gl.getUniformLocation(shaderProgram, 'u_texture'),
    },
  };

}

function texture(){
	if(textureOn==0){
		textureOn = 1;
	}
	else{
		textureOn = 0;
	}
}
function grayfn(){
	if(grayscale==0){
		grayscale = 1;
	}
	else{
		grayscale = 0;
	}
}

function tickElements(gl) {
  
  totalTime++;
  if(totalTime>4950){
  	document.getElementById("sc").innerHTML+="The End";
  	sleep(100);
  }		

  surfer.tick();
  flashTime++;

  if(Math.floor((Math.random()*100) + 1) == 1){
  	flashTime = 0;
  }

  police.tick(surfer.position[0]);

  if(police.position[2]-surfer.position[2] < 2 && Math.abs(police.position[1] - surfer.position[1])<0.2){
  	sleep(100);
  }

  if(police.position[2]-surfer.position[2] < 6){
  	surfer.position[2]-=0.005;
  }

  cameraPos=[surfer.position[0], Math.max(surfer.position[1]+1.5, 1.3), surfer.position[2]+6.0];

  for(var i=0;i<numOfCoins;i++){
    if(coinarr[i].taken==0){
      coinarr[i].tick();
      dist = (coinarr[i].position[0]-surfer.position[0])**2 + 
      		(coinarr[i].position[1]-surfer.position[1])**2 + 
      		(coinarr[i].position[2]-surfer.position[2])**2; 
      if(surfer.magnettime<500 && dist<10){
      	coinarr[i].move([surfer.position[0]-coinarr[i].position[0], surfer.position[1]-coinarr[i].position[1], surfer.position[2]-coinarr[i].position[2]], dist);
      }

      if(dist<0.3){
        coinarr[i].taken = 1;
        Score++;
      }
    }
  }

  document.getElementById("sc").innerHTML = "Score: "+Score;

	document.addEventListener('keydown', function(event) {
	    if(event.keyCode == 37) {
	        surfer.moveLeft();
      }
	    else if(event.keyCode == 39) {
	        surfer.moveRight();
	    }
	    else if(event.keyCode == 32){
	    	surfer.jump();
	    }
	    else if(event.keyCode == 40){
	    	surfer.duck();
	    }
	});

	for(var i=0;i<numOfDownboards;i++){
		if(((downboardarr[i].position[0]-surfer.position[0])**2 + 
			(downboardarr[i].position[1]-0.5-surfer.position[1])**2 + 
			(downboardarr[i].position[2]-surfer.position[2])**2 <0.4) && surfer.position[2]>downboardarr[i].position[2]){
			sleep(100);
		}
		if(((upboardarr[i].position[0]-surfer.position[0])**2 +
			(upboardarr[i].position[1]-surfer.position[1])**2 +
			(upboardarr[i].position[2]-surfer.position[2])**2 <2.0) && surfer.position[2]>upboardarr[i].position[2]){
			sleep(100);
		}
	    if(((conesarr[i].position[0]-surfer.position[0])**2 + 
	    	(conesarr[i].position[1]-surfer.position[1])**2 + 
	    	(conesarr[i].position[2]-surfer.position[2])**2 <0.3) && surfer.position[2]>conesarr[i].position[2]){
	      surfer.speed[2] = -0.08;
	    }
	    if(((trainarr[i].position[0]-surfer.position[0])**2 + 
	    	(trainarr[i].position[1]-surfer.position[1])**2 <0.3) && surfer.position[2]-trainarr[i].position[2]<10.0 
	    	&& surfer.position[2]>trainarr[i].position[2]){
	      sleep(100);
	    }
	}

  for(var i=0;i<numOfFlies;i++){
    if(flyarr[i].taken==0){
    	flyarr[i].tick();
     	if(((flyarr[i].position[0]-surfer.position[0])**2 + 
     		(flyarr[i].position[1]-surfer.position[1]-0.5)**2 + 
     		(flyarr[i].position[2]-surfer.position[2])**2 <0.2) && surfer.position[2]>flyarr[i].position[2]){
     		flyarr[i].taken = 1;
        	superJumptime = 580;
     		surfer.flytime = 0;
     		numOfCoins += 20;
     		for(var j=0;j<20;j++){
     			if(Math.floor((Math.random()*2) + 1) == 1){
  	        		coinarr.push(new Coin(gl, [-1.1, 5.24, surfer.position[2]-7*j]));
  	      		}
  	      		else{
  	        		coinarr.push(new Coin(gl, [1.1, 5.24, surfer.position[2]-7*j]));
  	      		}		
     		}
     		break;
     	}
    }

    if(bootsarr[i].taken==0){
   	  bootsarr[i].tick();
     	if(((bootsarr[i].position[0]-surfer.position[0])**2 + 
     		(bootsarr[i].position[1]-surfer.position[1])**2 + 
     		(bootsarr[i].position[2]-surfer.position[2])**2 <0.3) && surfer.position[2]>bootsarr[i].position[2]){
     		bootsarr[i].taken = 1;
        	surfer.superJumptime = 0;
     		break;
     	}
    }

    if(magnetarr[i].taken==0){
    	magnetarr[i].tick();
    	if(((magnetarr[i].position[0]-surfer.position[0])**2 + 
     		(magnetarr[i].position[1]-surfer.position[1])**2 + 
     		(magnetarr[i].position[2]-surfer.position[2])**2 <0.3) && surfer.position[2]>magnetarr[i].position[2]){
     		magnetarr[i].taken = 1;
        	surfer.magnettime = 0;
     		break;
     	}
    }

  }
}

function initBuffers(gl) {
    bg = new Bg(gl);
    ground = new Ground(gl);
    track1 = new Track(gl, [1.1, 0.0, 0.0]);
    track2 = new Track(gl, [-1.1, 0.0, 0.0]);  
    surfer = new Surfer(gl, [-1.0, -0.5, -8.0]);
    wall1 = new Wall(gl, [-3.0, 0.0, 0.0]);
    wall2 = new Wall(gl, [3.0, 0.0, 0.0]);
    police = new Police(gl, [-1.0, -0.5, -5.0]);
    sun = new Sun(gl);
    end = new End(gl, [0.0, 1.0, -1000.0]);

    for(var i=0;i<numOfCoins;i++){
      if(Math.floor((Math.random()*2) + 1) == 1){
        coinarr.push(new Coin(gl, [-1.1, -0.2, -10*i]));
      }
      else{
        coinarr.push(new Coin(gl, [1.1, -0.2, -10*i]));
      }
    }

    for(var i=1;i<=numOfDownboards;i++){
      if(Math.floor((Math.random()*2) + 1) == 1){
        downboardarr.push(new Downboard(gl, [-1.1, -0.2, -67*i]));
      }
      else{
        downboardarr.push(new Downboard(gl, [1.1, -0.2, -67*i]));
      }

      if(Math.floor((Math.random()*2) + 1) == 1){
        upboardarr.push(new Upboard(gl, [-1.1, 1.0, -83*i]));
      }
      else{
        upboardarr.push(new Upboard(gl, [1.1, 1.0, -83*i]));
      }

	    if(Math.floor((Math.random()*2) + 1) == 1){
        conesarr.push(new Cones(gl, [-1.1, -0.7, -109*i]));
      }
      else{
        conesarr.push(new Cones(gl, [1.1, -0.7, -109*i]));
      }

      if(Math.floor((Math.random()*2) + 1) == 1){
        trainarr.push(new Train(gl, [-1.1, -0.7, -117*i]));
      }
      else{
        trainarr.push(new Train(gl, [1.1, -0.7, -117*i]));
      }      
    }

    for(var i=1;i<=numOfFlies;i++){
	    if(Math.floor((Math.random()*2) + 1) == 1){
    	  flyarr.push(new Fly(gl, [1.1, 0.2, -201*i]));
      }
      else{
    	  flyarr.push(new Fly(gl, [-1.1, 0.2, -201*i]));
      }
    
      if(Math.floor((Math.random()*2) + 1) == 1){
    	  bootsarr.push(new Boots(gl, [1.1, 0.0, -189*i]));
      }
      else{
    	  bootsarr.push(new Boots(gl, [-1.1, 0.0, -189*i]));
      }

      if(Math.floor((Math.random()*2) + 1) == 1){
      	magnetarr.push(new Magnet(gl, [1.1, 0.0, -89*i]));
      }
      else{
    	  magnetarr.push(new Magnet(gl, [-1.1, 0.0, -89*i]));
      }
    }	
}

function drawScene(gl, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);           
  gl.depthFunc(gl.LEQUAL);            


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 60 * Math.PI / 180;   
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 10000.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  var cameraMatrix = mat4.create();
  mat4.translate(cameraMatrix, cameraMatrix, cameraPos);
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];

  var up = [0, 1, 0];
  mat4.lookAt(cameraMatrix, cameraPosition, [cameraPos[0], cameraPos[1], cameraPos[2]-2.0], up);
  
  var viewMatrix = cameraMatrix;
  var viewProjectionMatrix = mat4.create();
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  if(textureOn==1){
  	if(grayscale==1){
  		end.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, endtexture);
    	ground.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, groundtexture);
 		wall1.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, walltexture);
  		wall2.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, walltexture);
    	track1.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, metaltexture);
    	track2.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, metaltexture);		
    	bg.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, skytexture);
  		surfer.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, redtexture);
        police.draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, bluetexture);
  	}
  	else{
  		end.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, endtexture);
    	ground.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, groundtexture);
    	if(flashTime<10){
    		wall1.draw(gl, viewProjectionMatrix, flashprogramInfo, deltaTime, textureOn, walltexture);
  			wall2.draw(gl, viewProjectionMatrix, flashprogramInfo, deltaTime, textureOn, walltexture);
    	}
    	else{
 			wall1.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, walltexture);
  			wall2.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, walltexture);
    	}
    	track1.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, metaltexture);
    	track2.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime , textureOn, metaltexture);
    	bg.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, skytexture);
  		surfer.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, redtexture);
        police.draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, bluetexture);
  	}
  }
  else{
  	end.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, endtexture);
    bg.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, skytexture);
    ground.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, groundtexture);
    wall1.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, walltexture);
    wall2.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, walltexture);
    track1.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, metaltexture);
    track2.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, metaltexture);
    surfer.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, redtexture);
    police.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, bluetexture);
  }

  sun.draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime);

  for(var i=0;i<numOfCoins;i++){
    if(coinarr[i].taken==0){
    	if(textureOn==0){
      		coinarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, goldtexture);
    	}
    	else{
    		if(grayscale==0){
      			coinarr[i].draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, goldtexture);
    		}
    		else{
      			coinarr[i].draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, goldtexture);
    		}
    	}
    }
  }

  for(var i=0;i<numOfDownboards;i++){
    if(textureOn==0){
      downboardarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, downtexture);
      upboardarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, woodtexture);
      trainarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime, textureOn, traintexture);
    }
    else{
      if(grayscale==1){
      	downboardarr[i].draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, downtexture);
	    upboardarr[i].draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, woodtexture);
	    trainarr[i].draw(gl, viewProjectionMatrix, grayscaleprogramInfo, deltaTime, textureOn, traintexture);
      }
      else{
	    downboardarr[i].draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, downtexture);
	    upboardarr[i].draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, woodtexture);
	    trainarr[i].draw(gl, viewProjectionMatrix, textureprogramInfo, deltaTime, textureOn, traintexture);
      }
    }
  	conesarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime);
  }

  for(var i=0;i<numOfFlies;i++){
    if(flyarr[i].taken==0){
      flyarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime);
    }
    if(bootsarr[i].taken==0){
      bootsarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime);
    }
    if(magnetarr[i].taken==0){
      magnetarr[i].draw(gl, viewProjectionMatrix, nontextureprogramInfo, deltaTime);	
    }
  }

}


function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);


  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);


  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);


  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  return texture;
}