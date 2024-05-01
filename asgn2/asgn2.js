// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

var g_shapesList = []

// Global Variables
var canvas, ctx, gl;
var a_Position, u_Size, u_FragColor;



// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of of point

var g_selectedColor = [1.0, 1.0, 1.0, 1.0];
var g_selectedShape = "POINT";
var g_selectedRAINBOWMODE = false;
var g_selectedSize = 10.0
var g_selectedSegments = 7.0

function connectVariablestoGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
}

function setUp(){
    canvas = document.getElementById('asgn1');

    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log("Failed to get webGL context")
        return -1
    }
}


function clearCanvas(){
    // Sets the color of the canvas to black
    // gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    g_shapesList = []
}

function main() {
    // Grab canvas element and initialize its context
    setUp();
    connectVariablestoGLSL();
    htmlUIActions();

    isDragging = false;

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) {
        isDragging = true;
        click(ev, g_selectedShape)
    };

    canvas.onmousemove = function(ev) {
        if (isDragging) {
            click(ev, g_selectedShape) 
        }
    };

    canvas.onmouseup = function(ev) {
        isDragging = false;
    }


    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    renderAllShapes()

    // Draw a point
    // gl.drawArrays(gl.POINTS, 0, 1);
}


function htmlUIActions() {
    // COLOR MODES
    document.getElementById("red").onclick = () => {
        g_selectedRAINBOWMODE = false
        g_selectedColor = [1.0, 0.0, 0.0, 1.0]
    }
    document.getElementById("green").onclick = () => {
        g_selectedRAINBOWMODE = false
        g_selectedColor = [0.0, 1.0, 0.0, 1.0]
    }
    document.getElementById("blue").onclick = () => {
        g_selectedRAINBOWMODE = false
        g_selectedColor = [0.0, 0.0, 1.0, 1.0]
    }
    document.getElementById("rainbow").onclick = () => {g_selectedRAINBOWMODE = true}

    // SHAPE MODES
    document.getElementById("point").onclick = () => {g_selectedShape = "POINT"}
    document.getElementById("triangle").onclick = () => {g_selectedShape = "TRIANGLE"}
    document.getElementById("circle").onclick = () => {g_selectedShape = "CIRCLE"}

    // COLOR SLIDERS
    document.getElementById("redSlider").addEventListener('mouseup', (event) => {g_selectedColor[0] = event.target.value/100})
    document.getElementById("greenSlider").addEventListener('mouseup', (event) => {g_selectedColor[1] = event.target.value/100})
    document.getElementById("blueSlider").addEventListener('mouseup', (event) => {g_selectedColor[2] = event.target.value/100})
    
    // SiZE SLIDERS
    document.getElementById("sizeSlider").addEventListener('mouseup', (event) => {g_selectedSize = parseFloat(event.target.value)});
    document.getElementById("segmentSlider").addEventListener('mouseup', (event) => {g_selectedSegments = parseFloat(event.target.value)});
    
    // CLEAR CANVAS
    document.getElementById("clear").onclick = () => {clearCanvas()}
}




function click(ev, shape_type) {
    [x, y] = coordinateCalcToGl(ev, ev.clientX, ev.clientY);

    let shape;

    console.log(`shape: ${shape_type}`)

    switch (shape_type) {
        case "TRIANGLE":
            shape = new Triangle();
            break;
        case "CIRCLE":
            shape = new Circle();
            break;
        case "POINT":
            shape = new Point();
            break;
        default:
            console.error(`Unknown shape type ${shape_type}`)
            break;
    }

    shape.position = [x,y, 0.0];

    // Set Color
    if (g_selectedRAINBOWMODE === true) {
        shape.color = RandomStartColor();
        console.log(shape.color)
    } else {
        shape.color = g_selectedColor.slice();
    }

    // Set shape size
    shape.size = g_selectedSize;
    
    // Set Segments if shape is a circle
    if (shape instanceof Circle) {
        shape.segments = g_selectedSegments
    }
    
    g_shapesList.push(shape);


    
    gl.clear(gl.COLOR_BUFFER_BIT)
    renderAllShapes();
}

/*
    @param x -> x coordinate of mouse pointer
    @param y -> y coordinate of mouse pointer
*/
function coordinateCalcToGl(ev, x, y) {
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return ([x, y])
}

function renderAllShapes() {
    var startTime = performance.now();
    gl.clear(gl.COLOR_BUFFER_BIT);

    // console.log(`g_shapesList: ${JSON.stringify(g_shapesList)}`)
    
    // for(let i = 0; i < g_shapesList.length; i++) {
    //     g_shapesList[i].render();
    // }

    // u_FragColor = []

    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0]
    body.render();

    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
    drawTriangle3D([-1.0,0.0,0.0,    -0.5,-1.0,0.0,    0.0,0.0,0.0])

    var duration = performance.now() - startTime;

    sendTextToHTML( " ms: " + Math.floor(duration) + " fps " + Math.floor(10000/duration) / 10, "numdot");

}


function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
      console.log("Failed to get " + htmlID + " from HTML");
      return;
    }
    htmlElm.innerHTML = text;
}