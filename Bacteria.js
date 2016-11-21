function Bacteria(gl, points, normals, start, spokes, radius, centre) {
    this.randomambient = Math.random();
    this.gl = gl;
    this.points = points;
    this.start = start;
    this.normals = normals;
    this.size = 0;
    for (var i = 0; i < (spokes); i++) {
        t = i * (2 * Math.PI) / spokes;
        t2 = (i + 1) * (2 * Math.PI) / spokes;
         
        var x = vec4(centre[0] + radius * Math.cos(t), centre[1] + radius * Math.sin(t), centre[2], 1.0);
        var y = vec4(centre[0] + radius * Math.cos(t2), centre[1] + radius * Math.sin(t2), centre[2], 1.0);
    
        var z = centre;
        this.addTriangle(x, y, z);
    }
}
Bacteria.prototype.addTriangle = function(a, b, c) {
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

Bacteria.prototype.draw = function(modelViewMatrix,projectionMatrix,program) {

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