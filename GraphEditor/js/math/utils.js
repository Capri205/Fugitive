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



