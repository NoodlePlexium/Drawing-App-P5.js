// Global variables that will store the toolbox colour palette
// and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;

let Font;
function preload() {
  Font = loadFont('fonts/Marcellus/Marcellus-Regular.ttf');
}

function setup() {

	// Create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();
    
    // Create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");
    select('.wrapper').style("height", "100vh");

	// Create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new MirrorDrawTool());
    toolbox.addTool(new EraserTool());
    toolbox.addTool(new ShapeTool());
    toolbox.addTool(new TextTool());
    toolbox.addTool(new SplinePenTool());
	background(255);
    
    // Set the font
    textFont(Font);
    
    // Set the fill
    fill("black");
}

function draw() {
	// Call the draw function of the selected tool.
    toolbox.selectedTool.draw();
}

function keyPressed(){
    
    // Backspace key pressed when using the text tool
    if (toolbox.selectedTool.name == "textTool"){
        if (keyCode == 8) toolbox.selectedTool.backSpaceDown();
    }
}

function keyReleased(){
    
    // Backspace key released when using the text tool
    if (toolbox.selectedTool.name == "textTool"){
        if (keyCode == 8) toolbox.selectedTool.backSpaceUp();
    }
}

function keyTyped(){
    
    // Key typed when using the text tool
    if (toolbox.selectedTool.name == "textTool"){
        console.log(toolbox.selectedTool);
        toolbox.selectedTool.type(key);
    }
}