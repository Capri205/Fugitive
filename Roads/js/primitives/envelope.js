/* Envelope class for the graph. The envelope is a polygon with
** properties such as line width and roundness, which defines how rounded
** any curves are. Lower values for roundness results in sharp corners
*/

class Envelope {

    // takes a segment, width and roundness parameters
    constructor( skeleton, width, roundness = 1 ) {
        this.skeleton = skeleton;
        this.width = width;
        this.poly = this.#generatePolygon( this.width, roundness );
    }

    /* Returns a new Polygon object from the skeleton (segment) points
    ** by generating points from the first point to the second based
    ** on the roundness value. Larger roundness values equals more points
    ** and a smoother curve
    **
    ** @param width - width of the line
    ** @param roundness - smoothness of the curve
    ** @returns - a new Polygon
    */
    #generatePolygon( width, roundness ) {
        const { p1, p2 } = this.skeleton;

        const radius = width / 2;
        const alpha = angle( subtractPoints( p1, p2 ) );
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;

        const p1_ccw = translate( p1, alpha_ccw, radius );
        const p2_ccw = translate( p2, alpha_ccw, radius );
        const p2_cw = translate( p2, alpha_cw, radius );
        const p1_cw = translate( p1, alpha_cw, radius );

        const points = [];
        const step = Math.PI / Math.max( roundness, 1 );
        const eps = step / 2;
        for ( let i = alpha_ccw; i <= alpha_cw + eps; i += step ) {
            points.push( translate( p1, i, radius ) );
        }
        for ( let i = alpha_ccw; i <= alpha_cw + eps; i += step ) {
            points.push( translate( p2, Math.PI + i, radius ) );
        }
        return new Polygon( points );
    }

    /* Draw routine for the envelope which calls the Polygon
    ** draw with any options the Polygon draw takes
    ** 
    ** @param ctx - canvas context
    ** @returns - nothing
    */
    draw( ctx, options ) {
        this.poly.draw( ctx, options );
    }
}