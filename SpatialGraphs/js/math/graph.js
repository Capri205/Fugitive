class Graph {

    constructor( points = [], segments = [] ) {

        this.points = points;
        this.segments = segments;
    }

    tryToAddPoint( point ) {
        if ( !this.containsPoint( point ) ) {
            this.addPoint( point );
            return true;
        }
        return false;
    }

    addPoint( point ) {
        console.log(point.x + ", " + point.y);
        this.points.push( point );
    }

    containsPoint( point ) {
        return this.points.find( (p) => p.equals( point ) );
    }

    removePoint( point ) {
        const attachedSegments = this.getSegmentsForPoint( point );
        for( const segment of attachedSegments ) {
            this.removeSegment( segment );
        }
        this.points.splice( this.points.indexOf( point ), 1 );
    }

    tryToAddSegment( segment ) {
        if ( this.points.length > 1 && !segment.p1.equals( segment.p2 ) && !this.containsSegment( segment ) ) {
            this.addSegment( segment );
            return true;
        }
        return false;
    }

    addSegment( segment ) {
        this.segments.push( segment );
    }

    containsSegment( segment ) {
        return this.segments.find( (s) => s.equals( segment ) );
    }

    removeSegment( segment ) {
        this.segments.splice( this.segments.indexOf( segment ), 1 );
    }

    getSegmentsForPoint( point ) {
        const pointSegments = [];
        for( const segment of this.segments ) {
            if ( segment.includes( point ) ) {
                pointSegments.push( segment );
            }
        }
        return pointSegments;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw( ctx ) {
    
        for ( const point of this.points ) {
            point.draw( ctx );
        }

        for ( const seg of this.segments ) {
            seg.draw( ctx );
        }
    }

    
}