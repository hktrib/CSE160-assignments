

var canvas, ctx;

function main() {
    // Retrieving <canvas> element
    canvas = document.getElementById('example');
    if (!canvas) {
      console.log('Failed to retrieve the <canvas> element');
      return false;
    }
  
    ctx = canvas.getContext('2d');
    clear();

    // drawVector(new Vector3([2.25, 2.25, 0.0]), "red")
}

function drawVector(v, color) {
    // Set the stroke color
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);

    // Draw a line to the end point
    ctx.lineTo(200 + v.elements[0]*20, 200 - v.elements[1]*20, 0);
    ctx.lineTo(200 + v.elements[0]*20, 200 - v.elements[1]*20, 0);

    ctx.stroke();
}

function handleDrawEvent(){
    var x = parseFloat(document.getElementById('x-coordinate').value);
    var y = parseFloat(document.getElementById('y-coordinate').value);
    var x2 = parseFloat(document.getElementById('x-coordinate-v2').value);
    var y2 = parseFloat(document.getElementById('y-coordinate-v2').value);

    clear();
 
    // Draw new lines
    drawVector(new Vector3([x, y, 0.0]), "red");
    drawVector(new Vector3([x2, y2, 0.0]), "blue");
}


function handleDrawOperationEvent(){
    var x = parseFloat(document.getElementById('x-coordinate').value);
    var y = parseFloat(document.getElementById('y-coordinate').value);
    var x2 = parseFloat(document.getElementById('x-coordinate-v2').value);
    var y2 = parseFloat(document.getElementById('y-coordinate-v2').value);
 
    // Clear Canvas
    clear();

    var v1 = new Vector3([x, y, 0.0]);
    var v2 = new Vector3([x2, y2, 0.0]);

    drawVector(v1, "red");
    drawVector(v2, "red");
 
    var operator = document.getElementById('operation').value;
    // Add or Subtract
    switch(operator) {
        case "add":
            v1.add(v2);
            drawVector(v1, "green");
            break;
        case "sub":
            v1.sub(v2);
            drawVector(v1, "green");
            break;
        case "mul":
            var s = document.getElementById('scalar').value;
            v1.mul(s);
            drawVector(v1, "green");
            v2.mul(s);
            drawVector(v2, "green");
            break;
        case "div":
            var s = document.getElementById('scalar').value;
            v1.div(s);
            drawVector(v1, "green");
            v2.div(s);
            drawVector(v2, "green");
            break;
        case "mag":
            console.log("Magnitude v1: "+ v1.magnitude());
            console.log("Magnitude v2: "+ v2.magnitude());
            break;
        case "norm":
            var v1n = v1.normalize();
            drawVector(v1n, "green");
            var v2n = v2.normalize();
            drawVector(v2n, "green");
            break;
        case "ang":
            console.log("Angle: " + (angleBetween(v1, v2)).toFixed(2));
            break;
        case "area":
            console.log("Area of this triangle: " + (areaTriangle(v1, v2)).toFixed(2));
            break;
    }
 }
 
function angleBetween(v1, v2) {
    // Calculate the dot product of v1 and v2
    let dotProduct = Vector3.dot(v1, v2);

    // Calculate the magnitudes of v1 and v2
    let magnitudeV1 = v1.magnitude();
    let magnitudeV2 = v2.magnitude();

    // Calculate the cosine of the angle between v1 and v2
    let cosTheta = dotProduct / (magnitudeV1 * magnitudeV2);

    // Calculate the angle in radians
    let theta = Math.acos(cosTheta);

    // Convert the angle to degrees
    let degrees = theta * (180 / Math.PI);

    return degrees;
}
 
 function areaTriangle(v1, v2){
    // Take the cross product
    var cross = Vector3.cross(v1, v2);

    // Create a new vector with the cross product result Vector3.
    var v1 = new Vector3([cross.elements[0], cross.elements[1], cross.elements[2]]);
    
    // return the area
    return v1.magnitude()/2;
}

// Helper to clear out canvas
function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
}
