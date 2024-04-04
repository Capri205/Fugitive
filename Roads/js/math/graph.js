/* Graph consisting of points and segments connecting points
** Constructor can take an existing array of point objects or
** it will create an empty array. Same for segments.
*/

class Graph {

    constructor( points = [], segments = [] ) {

        this.points = points;
        this.segments = segments;
    }

    /* Load graph data into graph
    **
    ** @param json string of data representing points and segments
    ** @returns a new graph with the data loaded
    */
    static load( data ) {

        const points = data.points.map( (i) => new Point(
            i.x, i.y,
            i.size, i.color, i.lineWidth,
            i.selectedScale, i.selectedColor, i.lineWidth,
            i.hoverScale, i.hoverColor, i.hoverLineWidth,
            i.zoneScale, i.zoneColor, i.zoneLineWidth
        ) );
        const segments = data.segments.map( (i) => new Segment(
            points.find( (p) => p.equals( i.p1 ) ),
            points.find( (p) => p.equals( i.p2 ) ),
            i.color, i.lineWidth
        ));

        return new Graph( points, segments );
    }

    /* Base add point object to array method
    **
    ** @param point - the point to add
    ** @returns - nothing
    ** @private
    */
    addPoint( point ) {
        this.points.push( point );
    }

    /* Add a point object to the points array if it doesn't already exist
    **
    ** @param point - the point to add
    ** @returns - true or false if the addition worked or failed
    ** @public
    */
    tryToAddPoint( point ) {

        if ( !this.containsPoint( point ) ) {
            this.addPoint( point );
            return true;
        }

        return false;
    }

    /* Check if a point object exists in the graph
    **
    ** @param point - the point to look for in the array
    ** @returns - true or false if the object exists or not
    ** @public
    */
    containsPoint( point ) {
        return this.points.find( (p) => p.equals( point ) );
    }

    /* Removes a point object from the points array and any segments associated with it
    **
    ** @param point - the point to remove
    ** @returns - nothing
    ** @public
    */
    removePoint( point ) {
        const attachedSegments = this.getSegmentsForPoint( point );
        for( const segment of attachedSegments ) {
            this.removeSegment( segment );
        }
        this.points.splice( this.points.indexOf( point ), 1 );
    }

    /* Base add segment operation
    **
    ** @param segment - the segment to add to the graph
    ** @returns - nothing
    ** @private
    */
    addSegment( segment ) {
        this.segments.push( segment );
    }

    /* Attempt to add a segment to the graph validating the segment doesn't already 
    ** exist in the graph and the two points aren't the same
    **
    ** @param segment - the segment to add
    ** @returns - true or false depending on whether the segment was added successfully or not
    ** @public
    */
    tryToAddSegment( segment ) {
        if ( this.points.length > 1 && !segment.p1.equals( segment.p2 ) && !this.containsSegment( segment ) ) {
            this.addSegment( segment );
            return true;
        }
        return false;
    }

    /* Check if a segement object exists in the graph
    **
    ** @param segment - the segment to look for in the graph
    ** @returns - true or false if the object exists or not
    ** @public
    */
    containsSegment( segment ) {
        return this.segments.find( (s) => s.equals( segment ) );
    }

    /* Remove a segment from the graph
    **
    ** @param segment - the segment to remove
    ** @returns - nothing
    ** @private
    */
    removeSegment( segment ) {
        this.segments.splice( this.segments.indexOf( segment ), 1 );
    }

    /* Get all segments for a point
    **
    ** @param point - the point object which to get segments for
    ** @returns pointSegments - the array of segment objects for the point
    ** @public
    */
    getSegmentsForPoint( point ) {
        const pointSegments = [];
        for( const segment of this.segments ) {
            if ( segment.includes( point ) ) {
                pointSegments.push( segment );
            }
        }
        return pointSegments;
    }

    /* Clear graph of all points and segments
    **
    ** @params - none
    ** @returns - nothing
    */
    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    /* Draw a graph points and associated segments on canvas
    ** Override with optional parameters
    ** point:   ctx, { inSize: <size>, inColor <color>, inLineWidth: <width> }
    ** segment: ctx, { inColor: <color>, inLineWidth: <width> }
    **
    ** @param ctx - required canvas context
    ** @returns - nothing
    */
    draw( ctx ) {
    
        for ( const point of this.points ) {
            point.draw( ctx );
        }

        for ( const seg of this.segments ) {
            seg.draw( ctx );
        }
    }

    
}