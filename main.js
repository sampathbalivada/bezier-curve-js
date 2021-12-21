var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

function getPointValues(x, y) {
    var x_val = parseFloat(document.getElementById(x).value);
    var y_val = parseFloat(document.getElementById(y).value);

    return [x_val, y_val]
}

function setPointValues(x, y, x_val, y_val) {
    document.getElementById(x).value = x_val.toString();
    document.getElementById(y).value = y_val.toString();
}

function resetCanvasAndCoordinates(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    // set default values for points
    setPointValues('x1', 'y1', 10, 10);
    setPointValues('x2', 'y2', 10, 500);
    setPointValues('xc1', 'yc1', 110, 110);
    setPointValues('xc2', 'yc2', 70, 310);
}

function plotCoordinates(x, y, style = 'black') {

    ctx.beginPath();
    ctx.rect(x, y, 1, 1);
    ctx.fillStyle = style;
    ctx.fill();
}

function plotPoint(x, y, style) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(p1, p2) {
    for (var t = 0.00; t <= 1.00; t += 0.01) {
        var xt = (p2.x - p1.x) * t + p1.x;
        var yt = (p2.y - p1.y) * t + p1.y;
        plotCoordinates(xt, yt, 'red');
    }
}

// Quadratic Bezier Curve
// x(t) = (1−t)^2 * x0 + 2 * t * (1−t) * x1 + t^2 * x2

function calcQuadraticBezierCurveValue(c1, c2, control, t) {
    return Math.pow(1 - t, 2) * c1 + 2 * t * (1 - t) * control + Math.pow(t, 2) * c2;
}

function drawQuadraticBezierCurve(p1, p2, controlPoint) {
    for (var t = 0; t <= 1; t += 0.001) {
        var xt = calcQuadraticBezierCurveValue(p1.x, p2.x, controlPoint.x, t);
        var yt = calcQuadraticBezierCurveValue(p1.y, p2.y, controlPoint.y, t);
        plotCoordinates(xt, yt);
    }
}

// Cubic Bezier Curve
// x(t) = (1−t)^3 * x0 + 3 * (1-t)^2 * t * x1 + 3 * (1 - t) * t ^ 2 * x2 + t^3 * x3

function calcCubicBezierCurveValue(c1, c2, control1, control2, t) {
    return Math.pow(1 - t, 3) * c1 + 3 * Math.pow(1 - t, 2) * t * control1 + 3 * (1 - t) * Math.pow(t, 2) * control2 + Math.pow(t, 3) * c2;
}

// https://www.moshplant.com/direct-or/bezier/math.html

function drawCubicBezierCurve(p1, p2, controlPoint1, controlPoint2) {
    for (var t = 0; t <= 1; t += 0.001) {
        var xt = calcCubicBezierCurveValue(p1.x, p2.x, controlPoint1.x, controlPoint2.x, t);
        var yt = calcCubicBezierCurveValue(p1.y, p2.y, controlPoint1.y, controlPoint2.y, t);
        plotCoordinates(xt, yt);
    }
}

function redrawLine() {
    clearCanvas();

    var [x1, y1] = getPointValues('x1', 'y1');
    var [x2, y2] = getPointValues('x2', 'y2');

    if (x1 !== NaN && y1 !== NaN && x2 !== NaN && y2 !== NaN) {
        drawLine({ 'x': x1, 'y': y1 }, { 'x': x2, 'y': y2 })
    } else {
        window.alert('Enter valid numbers into the input fields.');
    }

    plotPoint(x1, y1, 'red');
    plotPoint(x2, y2, 'red');
}

function redrawQuadraticBezierCurve() {
    clearCanvas();

    var [x1, y1] = getPointValues('x1', 'y1');
    var [x2, y2] = getPointValues('x2', 'y2');
    var [xc, yc] = getPointValues('xc1', 'yc1');

    if (x1 !== NaN && y1 !== NaN && x2 !== NaN && y2 !== NaN && xc !== NaN && yc !== NaN) {
        drawLine({ 'x': x1, 'y': y1 }, { 'x': x2, 'y': y2 });
        drawLine({ 'x': x1, 'y': y1 }, { 'x': xc, 'y': yc });
        drawLine({ 'x': xc, 'y': yc }, { 'x': x2, 'y': y2 });
        drawQuadraticBezierCurve({ 'x': x1, 'y': y1 }, { 'x': x2, 'y': y2 }, { 'x': xc, 'y': yc });
    } else {
        window.alert('Enter valid numbers into the input fields.');
    }

    plotPoint(x1, y1, 'red');
    plotPoint(x2, y2, 'red');
    plotPoint(xc, yc, 'green');
}

function redrawCubicBezierCurve() {
    clearCanvas();

    var [x1, y1] = getPointValues('x1', 'y1');
    var [x2, y2] = getPointValues('x2', 'y2');
    var [xc1, yc1] = getPointValues('xc1', 'yc1');
    var [xc2, yc2] = getPointValues('xc2', 'yc2');

    if (x1 !== NaN && y1 !== NaN && x2 !== NaN && y2 !== NaN && xc1 !== NaN && yc1 !== NaN && xc2 !== NaN && yc2 !== NaN) {
        drawCubicBezierCurve({ 'x': x1, 'y': y1 }, { 'x': x2, 'y': y2 }, { 'x': xc1, 'y': yc1 }, { 'x': xc2, 'y': yc2 });
    } else {
        window.alert('Enter valid numbers into the input fields.');
    }

    plotPoint(x1, y1, 'red');
    plotPoint(x2, y2, 'red');
    plotPoint(xc1, yc1, 'green');
    plotPoint(xc2, yc2, 'green');
}

document.onload = resetCanvasAndCoordinates(canvas);