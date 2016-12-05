var canvas;
var gl;
var leftcanvas;
var topcanvas;
var colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];
var bacteria = [];
var modelViewMatrix, projectionMatrix;

var modelViewMatrixLoc, projectionMatrixLoc;

function global() {
    "use strict"
    var planet;
    
    var program;
    var numTimesToSubdivide = 3;
    var index = 0;
    var pointsArray = [];
    var normalsArray = [];
    var near = -100;
    var far = 100;
    var radius = 1.5;
    var theta = 0.0;
    var phi = 0.0;
    var dr = 5.0 * Math.PI / 180.0;
    var left = -3.0;
    var right = 3.0;
    var ytop = 3.0;
    var bottom = -3.0;
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    var ctm;
    var ambientColor, diffuseColor, specularColor;
    
    var eye;
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    function triangle(a, b, c) {
        var n1 = vec4(a)
        var n2 = vec4(b)
        var n3 = vec4(c)
        n1[3] = 0.0;
        n2[3] = 0.0;
        n3[3] = 0.0;
        normalsArray.push(n1);
        normalsArray.push(n2);
        normalsArray.push(n3);
        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);
        index += 3;
    }

    function divideTriangle(a, b, c, count) {
        if (count > 0) {
            var ab = mix(a, b, 0.5);
            var ac = mix(a, c, 0.5);
            var bc = mix(b, c, 0.5);
            ab = normalize(ab, true);
            ac = normalize(ac, true);
            bc = normalize(bc, true);
            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        }
        else {
            triangle(a, b, c);
        }
    }

    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }
    window.onload = function init() {
        canvas = document.getElementById("gl-canvas");
        //assign canvas offset values
        leftcanvas = offset(canvas).left;
        topcanvas = offset(canvas).top;
        gl = WebGLUtils.setupWebGL(canvas, {
            preserveDrawingBuffer: true
        });
        if (!gl) {
            alert("WebGL isn't available");
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        //
        //  Load shaders and initialize attribute buffers
        //
        program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        planet = new Planet(gl, numTimesToSubdivide, pointsArray, normalsArray, pointsArray.length);
        for (var i = 0; i < 10; i++) {
            bacteria.push(new Bacteria(gl, pointsArray, normalsArray, pointsArray.length, spokes, _radius, randompoints()))
        }
        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
        var vNormal = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
       /*
        document.getElementById("Button0").onclick = function () {
            radius *= 2.0;
        };
        document.getElementById("Button1").onclick = function () {
            radius *= 0.5;
        };
        document.getElementById("Button2").onclick = function () {
            theta += dr;
        };
        document.getElementById("Button3").onclick = function () {
            theta -= dr;
        };
        document.getElementById("Button4").onclick = function () {
            phi += dr;
        };
        document.getElementById("Button5").onclick = function () {
            phi -= dr;
        };
        document.getElementById("Button6").onclick = function () {
            numTimesToSubdivide++;
            bacteria = [];
            pointsArray = [];
            normalsArray = [];
            init();
        };
        document.getElementById("Button7").onclick = function () {
            if (numTimesToSubdivide) numTimesToSubdivide--;
            bacteria = [];
            pointsArray = [];
            normalsArray = [];
            init();
            console.log(modelViewMatrix);
        };*/
        canvas.addEventListener("click", clickviacolour, false);
        canvas.addEventListener("mousewheelup",rotatearoundy,false);
        document.getElementsByTagName("body")[0].addEventListener("keypress",rotatearound,false);
        canvas.addEventListener("mousewheeldown",rotatearoundydown,false);

        
        eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
        modelViewMatrix = lookAt(eye, at, up);
        
        render();
    }

    function randompoints() {
        var min = -1.0;
        var max = 1.0;
        var a = (Math.random() * (max - min) + min);
        var b = (Math.random() * (max - min) + min);
        var c = (Math.random() * (max - min) + min);
        var theta = 2 * Math.PI / spokes;
        return vec4(a, b, c, 1.0);
    };

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);
        planet.draw(modelViewMatrix, projectionMatrix, program);
        for (var i = 0; i < bacteria.length; i++) {
            bacteria[i].draw(modelViewMatrix, projectionMatrix, program);
        }
        window.requestAnimFrame(render);
    }
    var _radius = .15;
    var spokes = 12;
}
global();