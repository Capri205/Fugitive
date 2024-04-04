/* Hepler functions
**
*/

/* Get the distance between two points using pythagorean theorem
**
** @param p1 - the first point
** @param p2 - the second point
** @returns - the distance between them
*/
function getPointDistance( p1, p2 ) {
    return Math.hypot( p1.x - p2.x, p1.y - p2.y );
    //return Math.sqrt( Math.pow( p1.x - p2.x ) + Math.pow( p1.y - p2.y ) );
    //return Math.sqrt(( Math.pow( p1.x - p2.x,2 )+ ( Math.pow( p1.y - p2.y, 2 ) ) ) );
}

/* Get the nearest graph point to another graph point
** Loops through all points in the graph to find the nearest one to another point
**
** @param loc - the point we are interested in finding ones close to
** @param points - the set of points in the graph
** @param threshold - the minimum distance from the point to be considered near
** @returns nearest - the graph point that was nearest or null if there isn't one
*/
function getNearestPoint( loc, points, threshold = Number.MAX_SAFE_INTEGER ) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for ( const point of points ) {
        const distance = getPointDistance( loc, point );
        if ( distance <= minDistance && distance <= threshold ) {
            minDistance = distance;
            nearest = point;
        }
    }
    return nearest;
}

/* Get the nearest graph point to another graph point but excludes a specific point
** Loops through all points in the graph to find the nearest one to another point
** but excludes a specific point (self) from the search.
**
** @param loc - the point we are interested in finding ones close to
** @param ref - the point for exclusion
** @param points - the set of points in the graph
** @param threshold - the minimum distance from the point to be considered near
** @return nearest - the graph point that was nearest or null if there isn't one
*/
function getNearestPointSkipSelf( loc, ref, points, threshold = Number.MAX_SAFE_INTEGER ) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for ( const point of points ) {
        if ( point != ref ) {
            const distance = getPointDistance( point, loc );
            if ( distance < minDistance && distance < threshold ) {
                minDistance = distance;
                nearest = point;
            }
        }
    }
    return nearest;
}

/* Get angle from center of point to another point on the graph
**
** @param x1 - x coordinate of first point
** @param y1 - y coordinate of first point
** @param x2 - x coordinate of second point
** @param y2 - y coordinate of second point
** @return - the angle in degrees
*/
function angleInDegrees(x1, y1, x2, y2) {
    const slope = (y2 - y1) / (x2 - x1);
    const radians = Math.atan2(y2 - y1, x2 - x1);
    const degrees = radians * (180 / Math.PI);
    return degrees;
}

/* Get the coordinates on the circumference of a circle (exclusion zone)
** based on the angle from center of the circle/point to another point
**
** @param radius - the radius of the circle
** @param angle - the angle in degrees from the center to the other point
** @param origin - the point used as the center of the circle
** @returns x, y - the x and y corrdinates on the circumference as an object 
*/
function pointOnCircumference(radius, angleInDegrees, origin) {
    const x = origin.x + radius * Math.cos(angleInDegrees * Math.PI / 180);
    const y = origin.y + radius * Math.sin(angleInDegrees * Math.PI / 180);
    return { x, y };
 }

 /* Add two points together and return a new Point
 **
 ** @param p1 - first point
 ** @param p2 - second point
 ** @returns - a new point which is the result of p1 + p2
 */
function addPoints( p1, p2 ) {
    return new Point( p1.x + p2.x, p1.y + p2.y );
}

/* Subtract two points from each other and return a new Point
 **
 ** @param p1 - first point
 ** @param p2 - second point
 ** @returns - a new Point which is the result of p1 - p2
 */
 function subtractPoints( p1, p2 ) {
    return new Point( p1.x - p2.x, p1.y - p2.y );
}

/* Scale a point by the value passed in. Values greater than one
** would scale up and less than one scale down.
**
** @param p - the point to scale
** @returns - a new point scaled by the value passed in
*/
function scale( p, scale ) {
    return new Point( p.x * scale, p.y * scale );
}

/* Return a new two dimensional point from the point, angle and offset passed in
** 
** @param loc - the point from which to get the new point
** @param angle - the angle in radians
** @param offset - the magnitude which to move away from the point
** @returns - a new point a certain distance and direction away
*/
function translate( loc, angle, offset ) {
    return new Point(
        loc.x + Math.cos( angle ) * offset,
        loc.y + Math.sin( angle ) * offset
    )
}

/* Return an angle in radians of a 2 dimensional point from the origin x:0, y:0
**
** @param p - the point in 2 dimensional space
** @returns - the angle in radians from the origin to the point
*/
function angle( p ) {
    return Math.atan2( p.y, p.x );
}

/* Returns a new point which is mid way between two points passed in
**
** @param p1 - the first point
** @param p2 - the second point
** @returns - a new point mid way between the two
*/
function average( p1, p2 ) {
    return new Point( ( p1.x + p2.x ) / 2, ( p1.y + p2.y ) / 2 );
}

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

/* Returns the the vector where two segments intersect
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
                x: lerp( A.x, B.x, t ),
                y: lerp( A.y, B.y, t ),
                offset: t,
            }        
        }
    }
    return null;
}

/* Return a random HSL color
**
** @returns - a random color within the hue range, with fixed saturation and level
*/
function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl( " + hue + ", 100%, 60% )";
 }