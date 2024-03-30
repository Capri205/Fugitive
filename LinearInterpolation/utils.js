/* Hepler functions
**
*/

/* Uses simple linear interpolation to return a value between two numbers at a certain decimal percentage along
** Negative or numbers greater than 1.0 will extrapolate instead of interpolate
**
** @param n1 - first number
** @param n2 - second number
** @param t - decimal percentage along. e.g. 0.5 half way, 0.3 would be 1/3rd
** @returns - the number between the two at the specified percentage
*/
function lerp( n1, n2, t ) {
    return n1 + (n2 - n1) * t;
}

/* Return interpolated vector a certain percentage between the two vectors passed in
** Negative or numbers greater than 1.0 will extrapolate instead of interpolate
**
** @param v1 - first vector
** @param v2 - second vector
** @param t - position between the two points in the range 0 (one end) to 1 (the other end). E.g. 0.5 = 1/2, 0.3 = 1/3rd
** @returns - a new vector between the two at the percentage specified
*/
function vlerp( v1, v2, t ) {
    const res = {};
    for( let attr in v1 ) {
        res[attr] = lerp( v1[attr], v2[attr], t );
    }
    return res;
}

/* Draw a circle with text in the center at a point 
**
** @param p1 - point
** @param p2 - second point coordinate
** @returns - the coordinate mid-point between the two point coordinates
*/
function drawDot( ctx, point, label, fillColor ) {
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.arc( point.x, point.y, 10, 0, Math.PI * 2 );
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px Arial";
    ctx.fillText( label, point.x, point.y );
}