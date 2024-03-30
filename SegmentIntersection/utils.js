/* Hepler functions
**
*/

/* Using simple linear interpolation, return a value between the same coordinate of two points
** E.g. p1.X and p2.X, where t = 0.5 which represents the mid point between them.
** Repeat for all cooordinates of points to get the point between two points on the canvas
**
** @param p1 - first point coordinate
** @param p2 - second point coordinate
** @param t - position between the two points in the range 0 (one end) to 1 (the other end)
** @returns - the coordinate point between the two point coordinates
*/
function lerp( A, B, t ) {
    return A + (B - A) * t;
}

/* Returns the the point where two lines intersect
** A line is defined by a start point and end point
**
** @param A - first point of first segment
** @param B - second point of first segment
** @param C - first point of second segment
** @param D - second point of second segment
** @returns - the point where the two segements intersect or null for no intersection
*/
function getIntersection( A, B, C, D ) {
    const tTop = ( D.x - C.x ) * ( A.y - C.y ) - ( D.y - C.y ) * ( A.x - C.x );
    const uTop = ( C.y - A.y ) * ( A.x - B.x ) - ( C.x - A.x ) * ( A.y - B.y );
    const bottom = ( D.y - C.y ) * ( B.x - A.x ) - ( D.x - C.x ) * ( B.y - A.y );
    if ( bottom != 0 ) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if ( ( t >= 0 && t <= 1 ) && ( u >= 0 && u <= 1 ) ) {
            return {
                x:lerp( A.x, B.x, t ),
                y:lerp( A.y, B.y, t )
            }        
        }
    }
    return null;
}

/* Draw a circle with text in the center at a point
**
** @param p1 - point
** @param p2 - second point coordinate
** @returns - the coordinate mid-point between the two point coordinates
*/
function drawDot( point, label, isRed ) {
    ctx.beginPath();
    ctx.fillStyle = isRed ? "red" : "white";
    ctx.arc( point.x, point.y, 10, 0, Math.PI * 2 );
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px Arial";
    ctx.fillText( label, point.x, point.y );
}