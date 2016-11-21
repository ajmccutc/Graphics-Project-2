function Planet(gl, numSubdivisions, points, normals, start) {
    this.gl = gl;
    
    this.numSubdivisions = numSubdivisions;
    this.points = points;
    this.start = start;
    this.size = 0;
    this.normals = normals;
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    this.tetrahedron (va,vb,vc,vd,numSubdivisions)
    this.randomambient = Math.random();

    
}




Planet.prototype.addTriangle = function(a, b, c) {
    var n1 = vec4(a)
    var n2 = vec4(b)
    var n3 = vec4(c)
    n1[3] = 0.0; n2[3] = 0.0; n3[3] = 0.0;
    //normalsArray.push(a);
    //normalsArray.push(b);
    // normalsArray.push(c);

    this.normals.push(n1);
    this.normals.push(n2);
    this.normals.push(n3);

    this.points.push(a);
    this.points.push(b);
    this.points.push(c);

    this.size += 3;
}


Planet.prototype.divideTriangle = function(a, b, c, count) {
    if (count > 0) {

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        this.divideTriangle(a, ab, ac, count - 1);
        this.divideTriangle(ab, b, bc, count - 1);
        this.divideTriangle(bc, c, ac, count - 1);
        this.divideTriangle(ab, bc, ac, count - 1);
    }
    else {
        this.addTriangle(a, b, c);
    }
}


Planet.prototype.tetrahedron = function(a, b, c, d, n) {
    this.divideTriangle(a, b, c, n);
    this.divideTriangle(d, c, b, n);
    this.divideTriangle(a, d, b, n);
    this.divideTriangle(a, c, d, n);
}




Planet.prototype.draw = function(modelViewMatrix,projectionMatrix,program) {

    var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
    var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    
    var materialAmbient = vec4(this.randomambient, 0.0, 1.0, 1.0);
    var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
    var materialShininess = 100.0;
    
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    

    gl.uniform4fv(gl.getUniformLocation(program,
       "ambientProduct"), flatten(ambientProduct));

    gl.uniform4fv(gl.getUniformLocation(program,
       "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"), materialShininess);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    for (var i = this.start; i < this.start+this.size; i += 3)
        this.gl.drawArrays(this.gl.TRIANGLES, i, 3);

}