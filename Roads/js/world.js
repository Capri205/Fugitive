
/* Defines the world in which the envelopes, polygons, segments and points exist
** for drawing the roads on our canvas
*/

class World {

    // takes a graph and optional roadWidth and roundess for smoothing corners
    constructor( graph, roadWidth = 100, roadRoundness = 10 ) {

        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.envelopes = [];
        this.roadBorders = [];

        this.generate();
    }

    /* Generates all of the primitives for roads in the world
    **
    ** @param - none
    ** @returns - nothing
    */
    generate() {

        this.envelopes.length = 0;
        for ( const seg of this.graph.segments ) {
            this.envelopes.push(
                new Envelope( seg, this.roadWidth, this.roadRoundness )
            );
        }

        this.roadBorders = Polygon.union( this.envelopes.map( (e) => e.poly ) );

    }

    /* Draws the roads on our canvas from all of the primitives generated
    **
    ** @param ctx - canvas context
    ** @returns - nothing
    */
    draw( ctx ) {
        for ( const envelope of this.envelopes ) {
            envelope.draw( ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 } );
        }
        for ( const seg of this.graph.segments ) {
            seg.draw( ctx, { customColor: "whitesmoke", customLineWidth: 4, dash: [ 10, 10 ] } );
        }
        for ( const seg of this.roadBorders ) {
            seg.draw( ctx, "white", 5 );
        }

    }
}