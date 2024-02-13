/* Viewport - used to pan and zoom over a canvas allowing us to have
** a much larger canvas and world to work with
** Constructor takes canvas and canvas context objects which must exist
*/
class Viewport {

    constructor( canvas, ctx ) {

        this.canvas = canvas;
        this.ctx = ctx;

        // zoom canvas
        this.minZoom = 1;
        this.maxZoom = 5;
        this.zoom = this.minZoom;
        this.center = new Point( this.canvas.width / 2, this.canvas.height /2 );

        // pan canvas
        this.offset = scale( this.center, -1 );
        this.pan = {};
        this.resetPan();

        this.#addEventListeners();
    }

    /* Perform viewport operations as part of animating the canvas
    **
    ** @param none
    ** @returns nothing
    */
    viewops() {
        this.ctx.restore();
        this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.ctx.save();
        this.ctx.translate( this.center.x, this.center.y );
        this.ctx.scale( 1 / this.zoom, 1 / this.zoom );
        const offset = this.getOffset();
        this.ctx.translate( offset.x, offset.y );
    }

    /* Reset viewport paramters
    **
    ** @param none
    ** @returns nothing
    */
    reset() {
        this.zoom = 1;
        this.viewops();
        this.resetPan();
    }

    /* Reset the pan record
    **
    ** @param none
    ** @returns nothing
    ** @private
    */
    resetPan() {
        this.pan.active = false;
        this.pan.start = new Point( 0, 0 );
        this.pan.end = new Point( 0, 0 );
        this.pan.offset = new Point( 0, 0 );
    }

    /* Get position of mouse pointer factoring in any zoom
    **
    ** @param event - the event
    ** @returns - a new point at position of mouse on canvas factoring in the current zoom
    ** @private
    */
    getMousePosition( event, subtractPanOffset = false ) {

        const p = new Point(

            ( event.offsetX - this.center.x ) * this.zoom - this.offset.x,
            ( event.offsetY - this.center.y ) * this.zoom - this.offset.y
        );

        return subtractPanOffset ? subtractPoint( p, this.pan.offset ) : p;

    }

    /* Get the paning offset
    **
    ** @param none
    ** @returns the addition of the viewport offset and the panning offset
    */
    getOffset() {
        return addPoints( this.offset, this.pan.offset );
    }

    /* Handle mouse scroll wheel
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseWheel( event ) {
        
        // get direction of scroll to determine zoom in or out and apply to zoom
        // and cap the range of the zoom between our zoom limits
        const step = 0.1;
        const direction = Math.sign( event.deltaY );
        this.zoom += direction * step;
        this.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.zoom) );
    }

    /* Handle mouse button click event
    **
    ** @param event - the event
    ** look for middle button/scroll wheel down and begin pan
    ** @returns - nothing
    ** @private
    */
    #handleMouseDown( event ) {

        if ( event.button == 1 ) {
            this.pan.start = this.getMousePosition( event );
            this.pan.active = true;
        }
    }

    /* Handle mouse move
    ** update pan with current mouse position
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseMove( event ) {

        if ( this.pan.active ) {
            this.pan.end = this.getMousePosition( event );
            this.pan.offset = subtractPoints( this.pan.end, this.pan.start );

        }
    }

    /* Handle mouse button release (up)
    ** pan finished so reset pan and update screen
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseUp( event ) {

        if ( this.pan.active ) {
            this.offset = addPoints( this.offset, this.pan.offset );
            this.resetPan();
        }
    }

    /* Event listeners for mouse operations
    ** wheel for detecting mouse scroll wheel for zoom operations
    **
    ** @param No parameters
    ** @returns Nothing
    ** @private
    */
    #addEventListeners() {

        // mouse scroll wheel event - capture the mouse scroll wheel being used
        this.canvas.addEventListener( "wheel", this.#handleMouseWheel.bind( this ) );

        // mouse down, move and up for panning across the canvas
        this.canvas.addEventListener( "mousedown", this.#handleMouseDown.bind( this ) );
        this.canvas.addEventListener( "mousemove", this.#handleMouseMove.bind( this ) );
        this.canvas.addEventListener( "mouseup", this.#handleMouseUp.bind( this ) );
    }


}