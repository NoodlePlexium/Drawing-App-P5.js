function EraserTool(){
	// Set icon and name
	this.icon = "assets/eraser-icon.png";
	this.name = "eraser";
    
    // Set defaults
    this.thicknessSlider = null;
    this.thickness = 25;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    var mouseDownOutCanvas = false;

    // Mouse coordinates
	var previousMouseX = -100;
	var previousMouseY = -100;

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
        if (this.drawing && !mousePressed){
            this.drawing = false;
            previousMouseX = -100;
			previousMouseY = -100;
        }
        
        // If drawing
        if (this.drawing){
            push();
            stroke("white");
            line(previousMouseX, previousMouseY, mouseX, mouseY);
            loadPixels();
            pop();
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }    
        
        // Draw cursor
        push();
        if (!mouseDownOutCanvas && this.mouseAbove()){
            fill("white");
            stroke("black");
            strokeWeight(1);
            ellipse(mouseX, mouseY, this.thickness);
            pop();
        }
	};
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Add options
    this.populateOptions = function(){
        select(".options").html('<p class="option-label">Width</p>');
        var options = select(".options").elt;
        if (options.children.length==1){
            this.thicknessSlider = createSlider(1, 120, this.thickness).parent(options);
        }
	};
    
    // Set stroke equal to thickness slider
    this.updateThickness = function(){
        strokeWeight(this.thicknessSlider.value());
        this.thickness = this.thicknessSlider.value();
    }
    
	// Clear options
	this.unselectTool = function() {
        updatePixels();
		select(".options").html("");
	};
}