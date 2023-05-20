function SprayCanTool() {
    // Set icon and name
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.jpg";
    
    // Set tool defaults
    this.points = 13;
    this.spread = 10;  
    this.spreadSlider = null;

    this.draw = function(){
        // Update spray size to match slider
        this.updateSize();
        
        // Draw number of points specified
        if(mouseIsPressed && this.mouseAbove()){
            for(var i = 0; i < this.points; i++){
                point(random(mouseX-this.spread, mouseX + this.spread), 
                random(mouseY-this.spread, mouseY+this.spread));
            }
        }
    };
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Add options
    this.populateOptions = function(){
        strokeWeight(1);
        select(".options").html('<p class="option-label">Size</p>');
        var options = select(".options").elt;
        if (options.children.length==1){
            this.spreadSlider = createSlider(13, 70, this.spread).parent(options);
        }
	};
    
    // Set stroke equal to thickness slider
    this.updateSize = function(){
        this.spread = this.spreadSlider.value();
        this.points = this.spread;
    };
    
	// Clear options
	this.unselectTool = function() {
		loadPixels();
		select(".options").html("");
	};
}