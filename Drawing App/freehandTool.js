function FreehandTool(){
	// Set icon and name
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";
    
    // Set tool defaults
    this.thicknessSlider = null;
    this.thickness = 5;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    var mouseDownOutCanvas = false;

    // Mouse coordinates
	var previousMouseX = -100;
	var previousMouseY = -100;
    
    // Save initial canvas state
    loadPixels();

	this.draw = function(){     
        // Clear temporary drawings
        updatePixels();
        
        // Update stroke weight
        this.updateThickness();
        
        // Set mouse up/down to false
        mouseDown = false;
        mouseUp = false;
        
        // On mouse up
        if (!mouseIsPressed && mousePressed){
            mousePressed = false;
            mouseUp = true;
            mouseDownOutCanvas = false;
        }
        
        // On mouse down
        if (mouseIsPressed && !mousePressed){
            mousePressed = true;
            mouseDown = true;
            mouseDownOutCanvas=!this.mouseAbove();
        }
        
        // If start drawing inside canvas
        if (this.mouseAbove() && mouseDown){
            this.drawing = true;
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }
        
        // Stop drawing
        if (this.drawing && !mousePressed || !this.mouseAbove()){
            this.drawing = false;
            previousMouseX = -100;
			previousMouseY = -100;
        }
        
        // Draw
        if (this.drawing){
            line(previousMouseX, previousMouseY, mouseX, mouseY);
            loadPixels();
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }    
                   
        // Render cursor
        if (!mouseDownOutCanvas && this.mouseAbove()){
            push();
            fill("white");
            stroke("black");
            strokeWeight(1);
            ellipse(mouseX, mouseY, this.thickness);
            pop();
        }
	};
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Add options
    this.populateOptions = function(){
        select(".options").html('<p class="option-label">Width</p>');
        var options = select(".options").elt;
        if (options.children.length==1){
            this.thicknessSlider = createSlider(1, 60, this.thickness).parent(options); // Create thickness slider
        }
	};
    
    // Set stroke equal to thickness slider
    this.updateThickness = function(){
        strokeWeight(this.thicknessSlider.value());
        this.thickness = this.thicknessSlider.value();
    };
    
	// Clear options
	this.unselectTool = function() {
		select(".options").html("");
	};
}