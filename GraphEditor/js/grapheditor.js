/* GraphEditor - used to manage and draw points and segments on a canvas
** Constructor takes a canvas object and a graph object. Both must exist
*/

class GraphEditor {

    constructor( canvas, graph ) {

        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext( "2d" );

        this.selected = null;
        this.hovered = null;        // hovered is which point we are hovering over
        this.breached = null;       // breached is to indicate we over another points exclusion zone
        this.savex = null;          // used to reset a point when dragged into a 
        this.savey = null;          //   another points exclusion zone
        this.mousePosition = null;

        this.shiftKey = false;      // used for adding segments between points

        this.#addEventListeners();  // event listeners for mouse operations
    }

    /* Remove a point and any segments associated with it
    ** Resets hovered flag and selected flag if point to be removed
    ** if its the currently selected point
    **
    ** @param point Point object to be removed from the graph
    ** @returns Nothing
    ** @private
    */
    #removeGraphPoint( point ) {
        this.graph.removePoint( point );
        this.hovered = null;
        if ( this.selected == point ) {
            this.selected = null;
        }
    }

    /* Get coordinates on cicumference of a points exclusion zone
    ** Used to relocate a new or dragged point to a place on
    ** the perimeter of a breached points exclusion zone
    **
    ** @param point The point being created or dragged
    ** @param breached The point being breached
    ** @private
    **
    ** TODO: need to detect invalid coordinates, like off canvas and loop until we
    ** get a good location or quit after a certain number of tries and use any saved coordinates
    */
    #getNewCoords( point, breached ) {
        const angle = angleInDegrees( breached.x, breached.y, point.x, point.y );
        const newposition = pointOnCircumference( breached.getSize() * breached.getZoneScale(), angle, breached );
        return [ newposition.x, newposition.y ];
    }

    /* Mark a point selected and try to add any segments
    **
    ** @param point - the point we are marking selected
    ** @returns nothing
    ** @private
    */
    #select( point, shiftKeyPressed ) {

        // before selecting the point, see if there a point currently selected and try to add a segment
        if ( this.selected && shiftKeyPressed ) {
            this.graph.tryToAddSegment( new Segment( this.selected, point ) );
        }
        this.selected = this.hovered;
    }

    #processLeftClick( event ) {

        // capture if we're pressing shift for the operation (add segment)
        this.shiftKey = event.shiftKey;

        // get a point where we clicked
        this.mousePosition = new Point( event.offsetX, event.offsetY );

        // if on existing point then select the instead of adding a new point
        if ( this.hovered ) {

            this.#select( this.hovered, this.shiftKey );
            this.hovered = getNearestPoint( this.mousePosition, this.graph.points, this.mousePosition.getSize() / 2 );
            this.dragging = false;
            return;
        }

        // dont add point if within exclusion zone of another point
        if ( this.breached ) {
            this.dragging = false;
            return;
        }

        // add point to graph and add any segments to the currently selected point if there is one
        this.graph.addPoint( this.mousePosition );
        this.hovered = this.mousePosition;
        this.#select( this.mousePosition, this.shiftKey );

        this.dragging = false;
    }

    /* Handle mouse button click event
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #processRightClick( event ) {
        // first cancel a selection, then second click will delete point as it's not selected anymore
        if ( this.selected ) {

            this.selected = null;

        } else if ( this.hovered ) {

            // remove point including segments attached to it
            this.graph.removePoint( this.hovered );
            if ( this.selected == this.hovered ) {
                this.selected = null;
                this.breached = null;
            }
            this.hovered = null;
        }
        this.dragging = false;
    }

    /* Handle mouse button click event
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseDown( event ) {
        console.log("mousedown");
        if ( event.button == 0 ) {  // left click - select point or create new point
            this.#processLeftClick( event );
        } else if ( event.button == 2 ) { // right click - clear a point from graph
            this.#processRightClick( event );
        }

    }

    /* Handle dragging of point
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseDrag( event ) {

        if ( event.button == 0 && this.hovered ) {

            // save position of point at start of drag so we an reset the 
            // point back to this location if breaching
            this.savex = this.selected.x;
            this.savey = this.selected.y;
            this.dragging = true;
        }
    }

    /* Handle mouse move
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseMove( event ) {

        // get mouse coordinates
        this.mousePosition = new Point( event.offsetX, event.offsetY );

        // selected point needs coordinates updated if it's being dragged
        if ( this.dragging && this.selected != null ) {

            this.selected.x = event.offsetX;
            this.selected.y = event.offsetY;
            this.breached = getNearestPointSkipSelf( this.mousePosition, this.selected, this.graph.points,
                ( this.mousePosition.getSize() / 2 ) * this.mousePosition.getZoneScale() + ( this.mousePosition.getSize() / 2 ));
        } else {

            this.hovered = getNearestPoint( this.mousePosition, this.graph.points, this.mousePosition.getSize() / 2 );
            this.breached = getNearestPoint( this.mousePosition, this.graph.points,
                ( this.mousePosition.getSize() / 2 ) * this.mousePosition.getZoneScale() );
        }
    }

    /* Handle mouse button release (up)
    **
    ** @param event - the event
    ** @returns - nothing
    ** @private
    */
    #handleMouseUp( event ) {

        // breaching another points exclusion zone while dragging needs to have
        // the currently selected point relocated to its saved coordinates
        if ( this.dragging && this.breached ) {
            this.selected.x = this.savex;
            this.selected.y = this.savey;
        }

        this.dragging = false;
    }

    /* Event listeners for mouse operations
    ** mousedown for a new point, selecting an existing point, removing a point or dragging a point
    ** mousemove for hovering flag or breaching flag when inside a points exclusion zone
    ** mouseup for resetting flags following a mousedown or mousemove event
    **
    ** @param No parameters
    ** @returns Nothing
    ** @private
    */
    #addEventListeners() {

         // left and right mouse button click events for addition or removal of a point
        this.canvas.addEventListener( "mousedown", this.#handleMouseDown.bind( this ) );            

        // left mouse button click event for dragging which is a combination of a left click and hovering over a point
        this.canvas.addEventListener( "mousedown", this.#handleMouseDrag.bind( this ) );

        // mouse move events - as the mouse moves use its coordinates on the canvas to set
        // the position of the selected point if dragging it and set any hovering and breach flags
        this.canvas.addEventListener( "mousemove", this.#handleMouseMove.bind( this ) );

        // mouse up event - button release should reset flags as it signals the end of an operation
        this.canvas.addEventListener( "mouseup",  this.#handleMouseUp.bind( this ) );

        // prevent context menus appearing for a right click
        this.canvas.addEventListener( "contextmenu", (event) => event.preventDefault() );
    }

    /* Draw a point and its exclusion zone and whether it's being hovered over or currently selected
    **
    ** @param none
    ** @returns nothing
    ** @private
    */
    display() {

        // draw the point
        this.graph.draw( this.ctx );

        // draw hovered indicator on point, but not if the currently selected point
        if ( this.hovered != this.selected && this.hovered ) {
            this.hovered.drawHovered( this.ctx );
        }

        // draw selection indicator on point if the currently selected point
        if ( this.selected ) {
            if ( this.shiftKey ) {
                const intent = this.hovered ? this.hovered : this.mousePosition;
                new Segment( this.selected, intent ).draw( ctx, { indash: [ 3, 3 ] } );
            }
            this.selected.drawSelected( this.ctx );
        }

        // draw exclusion zone if breached
        if ( this.breached ) {
            this.breached.drawZone( this.ctx );
        }
    }

}