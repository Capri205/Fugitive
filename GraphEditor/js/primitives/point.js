/* Base point class for the graph. Represents a point on a canvas
** with various draw methods for drawing the point, it's exclusion zone
** and wether the point is currently selected or being hovered over
*/

class Point {

    // constructor take a 2 dimensional coordinates
    // and sets various base properties for drawing the point
    constructor( x, y ) {
        this.x = x;
        this.y = y;

        this.defaultSize = 20;
        this.size = this.defaultSize;
        this.defaultColor = "black";
        this.color = this.defaultColor;
        this.defaultLineWidth = 1;
        this.lineWidth = this.defaultLineWidth;

        this.defaultSelectedScale = 0.75;   // 75% of size of point
        this.selectedScale = this.defaultSelectedScale;
        this.defaultSelectedColor = "yellow";
        this.selectedColor = this.defaultSelectedColor;
        this.selectedLineWidth = this.lineWidth;
        this.defaultHoverScale = 0.4;       // 40% of size of point
        this.hoverScale = this.defaultHoverScale;
        this.defaulHoverColor = "limegreen";
        this.hoverColor = this.defaultHoverColor;
        this.hoverLineWidth = this.lineWidth;
        this.defaultZoneScale = 4.0;       // radius * this for drawing zone and breach detection
        this.zoneScale = this.defaultZoneScale;
        this.defaultZoneColor = "red";
        this.zoneColor = this.defaultZoneColor;
        this.zoneLineWidth = this.lineWidth;

        this.radius = this.size / 2;    // used frequently so calculate once
    }

    /* Equals method for comparing two points. Equality for a point
    ** means the x and y coordinates must be the same
    **
    ** @param point - the point with which to compare
    ** @returns - true or false based on whether equal or not
    ** @public
    */
    equals( point ) {
        return this.x == point.x && this.y == point.y;
    }
    
    /* Returns the size of the point
    **
    ** @param - none
    ** @returns - the current size value for this point
    ** @public
    */
    getSize() {
        return this.size;
    }

    /* Returns the current scaling for the exclusion zone
    **
    ** @param - none
    ** @returns - the current size value for this point
    ** @public
    */
    getZoneScale() {
        return this.zoneScale;
    }

    /* Draw operation for the point
    **
    ** @param ctx - the canvas context
    ** @param size - optional size of the point or use default
    ** @param color - optional color for the point or use the default
    ** @param linewidth - optional width for line or use the class default
    ** @returns - nothing
    */
    draw( ctx, { inSize = this.defaultSize, inColor = this.defaultColor, inLineWidth = this.lineWidth } = {} ) {

        let size = inSize;
        if ( size != this.size ) {
            this.size = size;
            this.radius = size / 2;
        }
        let color = inColor;
        let lineWidth = inLineWidth;

        // draw point
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
        ctx.fill();
    }

    /* Draw a points exclusion zone
    **
    ** @param ctx - the canvas context
    ** @param scale - optional value by how much to scale up or down the exclusion zone
    ** @param color - optional color for the point or use the default
    ** @param linewidth - optional width for line or use the class default
    ** @returns - nothing
    */
    drawZone( ctx, { inscale = this.defaultZoneScale, incolor = this.defaultZoneColor, inlineWidth = this.lineWidth } = {} ) {

        let zoneScale = inscale;
        let zoneColor = incolor;
        let zoneLineWidth = inlineWidth;

        // draw points exclusion zone
        ctx.beginPath();
        ctx.lineWidth = zoneLineWidth;
        ctx.strokeStyle = zoneColor;
        ctx.arc( this.x + ( zoneLineWidth / 2 ), this.y + ( zoneLineWidth / 2 ), this.radius * zoneScale, 0, Math.PI * 2 );
        ctx.stroke();
    }

    /* Draw selected highlight if this point is currently selected
    **
    ** @param ctx - the canvas context
    ** @param scale - optional value by how much to scale up or down the selection highlight
    ** @param color - optional color for the selection highlight or use the default
    ** @param linewidth - optional width for the selection highlight or use the class default
    ** @returns - nothing
    */
    drawSelected( ctx, { inscale = this.defaultSelectedScale, incolor = this.defaultSelectedColor, inlineWidth = this.lineWidth } = {} ) {

        let selectedScale = inscale;
        let selectedColor = incolor;
        let selectedLineWidth = inlineWidth;

        ctx.beginPath();
        ctx.lineWidth = selectedLineWidth;
        ctx.strokeStyle = selectedColor;
        ctx.arc( this.x+( selectedLineWidth / 2 ), this.y+( selectedLineWidth / 2 ), this.radius * selectedScale, 0, Math.PI * 2 );
        ctx.stroke();
    }

    /* Draw hovering highlight if this point is currently being hovered over
    **
    ** @param ctx - the canvas context
    ** @param scale - optional value by how much to scale up or down the hover highlight
    ** @param color - optional color for the hover highlight or use the default
    ** @param linewidth - optional width for the hover highlight or use the class default
    ** @returns - nothing
    */
    drawHovered( ctx, { inscale = this.defaultHoverScale, incolor = this.defaulHoverColor, inlineWidth = this.lineWidth } = {} ) {

        let hoverScale = inscale;
        let hoverColor = incolor;
        let hoverLineWidth = inlineWidth;

        ctx.beginPath();
        ctx.lineWidth = hoverLineWidth;
        ctx.fillStyle = hoverColor;
        ctx.arc( this.x+( hoverLineWidth / 2 ), this.y+( hoverLineWidth / 2 ), this.radius * hoverScale, 0, Math.PI * 2 );
        ctx.fill();
    }
}