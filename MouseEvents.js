//moving the mouse around
//selecting any of the colours
function clickviacolour(event){

    var pixels = new Uint8Array(4);
    gl.readPixels(event.clientX-leftcanvas, event.clientY-topcanvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
    for (var i = 0; i<7;i++){
            if (pixels = colors[i]){
                //Andrew has to tell me how to remove cricles. 
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