/* Polygon class for the graph. Represents a series of points and
** segments to form a polygon which can be drawm and filled with a color
*/

class Polygon {

    // takes an array of points and builds the segments from those to define the polygon
    constructor( points ) {
        this.points = points;
        this.segments = [];
        for( let i = 1; i <= points.length; i++ ) {
            this.segments.push(
                new Segment( points[ i - 1 ], points[ i % points.length ] )
            );
        }
    }

    /* Takes an array of polygons and for their segments breaks any that overlap
    ** another polygons segments, removing the overlap to make a single new segment.
    ** The result is a set ofnon-overlapping segments forming a polygon
    **
    ** @param polys - the array of polgons
    ** @returns - new set of segments forming a polygon
    */
    static union( polys ) {

        Polygon.multiBreak( polys );

        const keptSegments = [];
        for ( let i = 0; i < polys.length; i++ ) {

            for ( const seg of polys[i].segments ) {

                let keep = true;
                for ( let j = 0; j < polys.length; j++ ) {

                    if ( i != j ) {
                        if ( polys[j].containsSegment( seg ) ) {
                            keep = false;
                            break;
                        }
                    }
                }

                if ( keep ) {
                    keptSegments.push( seg );
                }
            }
        }

        return keptSegments;
    }

    /* Breaks the segments of a series of polygons into smaller
    ** segments where they intersect with another polygons segments,
    ** resulting in the provided array containing more segments
    **
    ** @param polys - an array of polygons
    ** @returns - nothing
    */
    static multiBreak( polys ) {
        for( let i = 0; i < polys.length - 1; i++ ) {
            for( let j = i + 1; j < polys.length; j++ ) {
                Polygon.break( polys[i], polys[j] );
            }
        }
    }

    /* Takes two polygons and finds intersecting segments and breaks
    ** them into individual segments in the array of segments
    **
    ** @param poly1 - the first polygon
    ** @param poly2 - the second polygon
    ** @returns - nothing
    */
    static break( poly1, poly2 ) {

        const segs1 = poly1.segments;
        const segs2 = poly2.segments;

        for( let i = 0; i < segs1.length; i++ ) {

            for( let j = 0; j < segs2.length; j++ ) {

                const intersection = getIntersection(
                    segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2
                );

                // check for intersection and not end points of segment and split the segment into two
                if ( intersection && intersection.offset != 1 && intersection.offset != 0 ) {

                    const intersectionPoint = new Point( intersection.x, intersection.y );

                    let savePoint = segs1[i].p2;
                    segs1[i].p2 = intersectionPoint;
                    segs1.splice( i + 1, 0, new Segment( intersectionPoint, savePoint ) );
                    savePoint = segs2[j].p2;
                    segs2[j].p2 = intersectionPoint;
                    segs2.splice( j + 1, 0, new Segment( intersectionPoint, savePoint ) );
                }
            }
        }
    }

    /* Returns true if any segment of this polygon contains the mid point
    ** of the segment being passed in
    **
    ** @param seg - segment from which to get the mid point
    ** @returns - true or false depending on whether this polygons segments intersect with the midpoint
    */
    containsSegment( seg ) {

        const midpoint = average( seg.p1, seg.p2 );
        return this.containsPoint( midpoint );
    }

    /* Returns zero or one depending on whether the point passed in is inside this polygon
    **
    ** @param point - the point to check
    ** @returns - zero if the point is outside of this polygon, one if inside
    */
    containsPoint( point ) {

        const outerPoint = new Point( -1000, -1000 );
        let intersectionCount = 0;
        for ( const seg of this.segments ) {
            const int = getIntersection( outerPoint, point, seg.p1, seg.p2 );
            if ( int ) {
                intersectionCount++;
            }
        }

        return intersectionCount % 2 == 1;
    }

    /* Draw the polygon by means of its segments
    **
    ** @param ctx - canvas context
    ** @returns - nothing
    */
    drawSegments( ctx ) {
        for( const seg of this.segments ) {
            seg.draw( ctx, getRandomColor(), 5 );
        }
    }

    /* Draw operation for the polygon
    **
    ** @param ctx - the canvas context
    ** @param stroke - optional color for the polygon
    ** @param linewidth - optional line width or use the class default
    ** @param fill - optional fill color for the polygon
    ** @returns - nothing
    */
    draw( ctx, { stroke = "blue", lineWidth = 2, fill = "rgba( 0, 0, 255, 0.3)" } = {} ) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        //TODO: error if empty graph - need to handle
        ctx.moveTo( this.points[0].x, this.points[0].y );
        for ( let i = 1; i < this.points.length; i++ ) {
            ctx.lineTo( this.points[i].x, this.points[i].y );
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
