function MirrorDrawTool() {
    // Set icon and name
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.jpg";

	// Set Defaults
	this.axis = "x";
	this.lineOfSymmetry = width / 2;
    var thicknessSlider = null;
    var thickness = 25;
	var self = this;
    
    // Mouse coordinates
	var previousMouseX = -1;
	var previousMouseY = -1;
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    var mouseDownOutCanvas = false;

	this.draw = function() {       
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
            previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
            previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
        }
        
        // Stop drawing
        if (this.drawing && !mousePressed || !this.mouseAbove()){
            this.drawing = false;
            previousMouseX = -100;
			previousMouseY = -100;
            previousOppositeMouseX = -100;
			previousOppositeMouseY = -100;
        }
        
        // Draw
        if (this.drawing){
            line(previousMouseX, previousMouseY, mouseX, mouseY);
            previousMouseX = mouseX;
            previousMouseY = mouseY;

            //these are for the mirrored drawing the other side of the
            //line of symmetry
            var oX = this.calculateOpposite(mouseX, "x");
            var oY = this.calculateOpposite(mouseY, "y");
            line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
            previousOppositeMouseX = oX;
            previousOppositeMouseY = oY;
            loadPixels();
        }    
                   
        // Render cursor
        push();
        if (!mouseDownOutCanvas && this.mouseAbove()){
            fill("white");
            stroke("black");
            strokeWeight(1);
            ellipse(mouseX, mouseY, this.thickness);
        }
        pop();
        
        
		// Draw line of symmetry
		push();
		strokeWeight(3);
		stroke("black");
		if (this.axis == "x") line(width / 2, 0, width / 2, height);
		else line(0, height / 2, width, height / 2);
		pop();
	};

	this.calculateOpposite = function(n, a) {
		// If the axis isn't the one being mirrored return the same value
		if (a != this.axis) {
			return n;
		}

		// If n is less than the line of symmetry return a coorindate
		// that is far greater than the line of symmetry by the distance from
		// n to that line.
		if (n < this.lineOfSymmetry) {
			return this.lineOfSymmetry + (this.lineOfSymmetry - n);
		}

		// Otherwise a coordinate that is smaller than the line of symmetry
		// by the distance between it and n.
		else {
			return this.lineOfSymmetry - (n - this.lineOfSymmetry);
		}
	};
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Set stroke equal to thickness slider
    this.updateThickness = function(){
        strokeWeight(this.thicknessSlider.value());
        this.thickness = this.thicknessSlider.value();
    };

	// Clear options
	this.unselectTool = function() {
		updatePixels();
		select(".options").html("");
	};

	// Add Options
	this.populateOptions = function() {
        strokeWeight(1);
        
        var options = select(".options").elt;
        
        // Add direction button
        var directionButton = createElement("button", "Make Horizontal").parent(options)
        directionButton.id("directionButton")
        
        // Add slider
        var thicknessLabel = createElement("p" ,"Width").parent(options);
        thicknessLabel.addClass("option-label")
        this.thicknessSlider = createSlider(1, 120, thickness).parent(options);
        
		// Click handlers
		select("#directionButton").mouseClicked(function() {
			var button = select("#" + this.elt.id);
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = height / 2;
				button.html('Make Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = width / 2;
				button.html('Make Horizontal');
			}
		});
	};
}