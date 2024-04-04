/* Base point class for the graph. Represents a point on a canvas
** with various draw methods for drawing the point, it's exclusion zone
** and wether the point is currently selected or being hovered over
*/

class Point {

    // constructor take a 2 dimensional coordinates
    // and sets various base properties for drawing the point
    constructor( x, y, size, color, lineWidth,
        selectedScale, selectedColor, selectedLineWidth,
        hoverScale, hoverColor, hoverLineWidth,
        zoneScale, zoneColor, zoneLineWidth ) {

        this.x = x;
        this.y = y;

        this.defaultSize = 20;
        this.size = size ? size : this.defaultSize;
        this.defaultColor = "black";
        this.color = color ? color : this.defaultColor;
        this.defaultLineWidth = 1;
        this.lineWidth = lineWidth ? lineWidth : this.defaultLineWidth;

        this.defaultSelectedScale = 0.75;   // 75% of size of point
        this.selectedScale = selectedScale ? selectedScale : this.defaultSelectedScale;
        this.defaultSelectedColor = "yellow";
        this.selectedColor = selectedColor ? selectedColor : this.defaultSelectedColor;
        this.selectedLineWidth = selectedLineWidth ? selectedLineWidth : this.lineWidth;
        this.defaultHoverScale = 0.4;       // 40% of size of point
        this.hoverScale = hoverScale ? hoverScale : this.defaultHoverScale;
        this.defaultHoverColor = "limegreen";
        this.hoverColor = hoverColor ? hoverColor : this.defaultHoverColor;
        this.hoverLineWidth = hoverLineWidth ? hoverLineWidth : this.lineWidth;
        this.defaultZoneScale = 4.0;       // radius * this for drawing zone and breach detection
        this.zoneScale = zoneScale ? zoneScale : this.defaultZoneScale;
        this.defaultZoneColor = "red";
        this.zoneColor = zoneColor ? zoneColor : this.defaultZoneColor;
        this.zoneLineWidth = zoneLineWidth ? zoneLineWidth : this.lineWidth;

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
    ** @returns - nothing
    */
    draw( ctx, customSize = this.size, customColor = this.color ) {

        // draw point
        ctx.beginPath();
        ctx.fillStyle = customColor;
        ctx.arc( this.x, this.y, customSize / 2, 0, Math.PI * 2 );
        ctx.fill();
    }

    /* Draw a points exclusion zone
    **
    ** @param ctx - required canvas context
    ** @param scale - optional value by how much to scale up or down the exclusion zone
    ** @param color - optional color for the point or use the default
    ** @param linewidth - optional width for line or use the class default
    ** @returns - nothing
    */
    drawZone( ctx, customScale = this.zoneScale, customColor = this.zoneColor, customLineWidth = this.lineWidth ) {

        // draw points exclusion zone
        ctx.beginPath();
        ctx.lineWidth = customLineWidth;
        ctx.strokeStyle = customColor;
        ctx.arc( this.x + ( customLineWidth / 2 ), this.y + ( customLineWidth / 2 ), this.radius * customScale, 0, Math.PI * 2 );
        ctx.stroke();
    }

    /* Draw selected highlight if this point is currently selected
    **
    ** @param ctx - required canvas context
    ** @param scale - optional value by how much to scale up or down the selection highlight
    ** @param color - optional color for the selection highlight or use the default
    ** @param linewidth - optional width for the selection highlight or use the class default
    ** @returns - nothing
    */
    drawSelected( ctx, customScale = this.selectedScale, customColor = this.selectedColor, customLineWidth = this.lineWidth ) {

        // highlight point is selected
        ctx.beginPath();
        ctx.lineWidth = customLineWidth;
        ctx.strokeStyle = customColor;
        ctx.arc( this.x+( customLineWidth / 2 ), this.y+( customLineWidth / 2 ), this.radius * customScale, 0, Math.PI * 2 );
        ctx.stroke();
    }

    /* Draw hovering highlight if this point is currently being hovered over
    **
    ** @param ctx - required canvas context
    ** @param scale - optional value by how much to scale up or down the hover highlight
    ** @param color - optional color for the hover highlight or use the default
    ** @param linewidth - optional width for the hover highlight or use the class default
    ** @returns - nothing
    */
    drawHovered( ctx, customScale = this.hoverScale, customColor = this.hoverColor, customLineWidth = this.lineWidth ) {

        ctx.beginPath();
        ctx.lineWidth = customLineWidth;
        ctx.fillStyle = customColor;
        ctx.arc( this.x + ( customLineWidth / 2 ), this.y + ( customLineWidth / 2 ), this.radius * customScale, 0, Math.PI * 2 );
        ctx.fill();
    }
}