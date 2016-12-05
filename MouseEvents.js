//moving the mouse around
//selecting any of the colours
function clickviacolour(event){

    var pixels = new Uint8Array(4);
    gl.readPixels(event.clientX-leftcanvas, canvas.height-(event.clientY-topcanvas), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
    for (var i = 0; i<10;i++){
            //Colours appear in same order as colours[]
            if (pixels == colors[i%colors.length]){
                //Andrew has to tell me how to remove cricles. 
                bacteria.splice(i,1);
                console.log ("Hello World!")
            }
        }
}
function offset(elem) {
    
    var x = elem.offsetLeft;
    var y = elem.offsetTop;

    while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
    }

    return { left: x, top: y };
}
function rotatearoundy (event){
    //rotate camera
    modelViewMatrix = mult(modelViewMatrix,rotate(5,[1,0,0]))
}
function rotatearoundydown (event){
    //rotate camera
    modelViewMatrix = mult(modelViewMatrix,rotate(-5,[1,0,0]))
}
function rotatearound (event){    
    
    var e = event;
    if (e.keyCode == 119) {
        // up arrow
        modelViewMatrix = mult(modelViewMatrix,rotate(5,[1,0,0]))
    }
    else if (e.keyCode == 115) {
        // down arrow
        modelViewMatrix = mult(modelViewMatrix,rotate(-5,[1,0,0]))
    }
    else if (e.keyCode == 97) {
       // left arrow
        modelViewMatrix = mult(modelViewMatrix,rotate(5,[0,1,0]))
    }
    else if (e.keyCode == 100) {
       // right arrow
        modelViewMatrix = mult(modelViewMatrix,rotate(-5,[0,1,0]))
    }
     else if (e.keyCode == 113) {
       // left z
        modelViewMatrix = mult(modelViewMatrix,rotate(5,[0,0,1]))
    }
     else if (e.keyCode == 101) {
       // right z
        modelViewMatrix = mult(modelViewMatrix,rotate(-5,[0,0,1]))
    }
}