/* Base segment class for the graph. Represents a segment on a canvas
** which connects two points, along with the draw method
*/

class Segment {

    // constructor takes 2 point objects and optional color and line witdth
    constructor( p1, p2, color, lineWidth ) {

        this.p1 = p1;
        this.p2 = p2;

        this.defaultColor = "white";
        this.color = color ? color : this.defaultColor;
        this.defaultLineWidth = 1;
        this.lineWidth = lineWidth ? lineWidth : this.defaultLineWidth;
    }

    /* Equals method for comparing two segments. Equality for a segment
    ** means the two points coordinates are the same bi-directionally
    **
    ** @param segment - the segment to compare this segment to
    ** @returns - true or false based on whether equal or not
    ** @public
    */
    equals( segment ) {
        return this.includes( segment.p1 ) && this.includes( segment.p2 );
    }

    /* Checks whether a segment already exists for a point
    **
    ** @param point - the point which to check bi-directionally for a segment
    ** @returns - true of false depending on the comparison
    */
    includes( point ) {
        return this.p1.equals( point ) || this.p2.equals( point );
    }

    /* Draw operation for the point
    **
    ** @param ctx - the canvas context
    ** @param color - optional color for the segment or use the default
    ** @param linewidth - optional line width or use the class default
    ** @param dash - optional dashed line specifciation
    ** @returns - nothing
    */
    draw( ctx, { customColor = this.color, customLineWidth = this.lineWidth, dash = [] } = {} ) {

        ctx.beginPath();
        ctx.lineWidth = customLineWidth;
        ctx.strokeStyle = customColor;
        if ( dash.length > 0 ) {
            ctx.setLineDash( dash );
        }
        ctx.moveTo( this.p1.x, this.p1.y );
        ctx.lineTo( this.p2.x, this.p2.y );
        ctx.stroke();
        ctx.setLineDash( [] );
    }
}