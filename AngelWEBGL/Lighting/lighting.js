

var canvas;
var gl;
var nRows = 50;
var nColumns = 50;


//alert(print_r(your array));  //call it like this

function print_r(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object') { //Array/Hashes/Objects 
    for(var item in arr) {
        var value = arr[item];

        if(typeof(value) == 'object') { //If it is an array,
            dumped_text += level_padding + "'" + item + "' ...\n";
            dumped_text += print_r(value,level+1);
        } else {
            dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    }
} else { //Stings/Chars/Numbers etc.
    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
}







 
var index = 0;

var pointsArray = [];
var normalsArray = [];


var near = -20;
var far = 20;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -5.0;
var right = 5.0;
var ytop =5.0;
var bottom = -5.0;

    
var lightPosition = vec4(0.0, 1.0, -1.0, 0.0 );
var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
var lightDiffuse = vec4( 0.0, 0.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0,0.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
eye = vec3(0.0,1.0,1.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
    



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

// vertex array of nRows*nColumns quadrilaterals 
// (two triangles/quad) from data
   a=4;b=2; 
    for(var i=0; i<nRows-1; i++) {
        for(var j=0; j<nColumns-1;j++) {
           
            pointsArray.push( vec4(a*i/nRows-b, 0.0, a*(j+1)/nColumns-b, 1.0) );
 pointsArray.push( vec4(a*(i+1)/nRows-b, 0.0, a*(j+1)/nColumns-b, 1.0));
pointsArray.push( vec4(a*(i+1)/nRows-b, 0.0, a*j/nColumns-b, 1.0));
 pointsArray.push( vec4(a*i/nRows-b, 0.0, a*j/nColumns-b, 1.0));
             
     normal = vec4(0.0,1.0,0.0,0.0);
     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);

    }
}


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
shininessLoc = gl.getUniformLocation( program, "shininess" );

    document.getElementById("Button0").onclick = function(){materialShininess*= 2.0;};
    document.getElementById("Button1").onclick = function(){materialShininess*= 0.5;};
    document.getElementById("Button2").onclick = function(){eye[1]+=0.2;};
    document.getElementById("Button3").onclick = function(){eye[1]-=0.2;};
    
    
   


    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    

    modelViewMatrix = lookAt(eye, at , up);

//alert(print_r(modelViewMatrix));
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
            
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
gl.uniform1f( shininessLoc,materialShininess );
        

// draw each quad as two filled red triangles
    // and then as two black line loops
    
    for(var i=0; i<pointsArray.length; i+=4) { 
        //gl.uniform4fv(fColor, flatten(red));
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
        //gl.uniform4fv(fColor, flatten(black));
        //gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }
    
    window.requestAnimFrame(render);
}
