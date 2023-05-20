function SplinePenTool() {
    // Set icon and name
	this.icon = "assets/spline-icon.png";
	this.name = "splinePenTool";
    
    // Set defaults
    this.thicknessSlider = null;
    this.thickness = 4;
    this.actionBtn = null;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    
    // Tool States
    var editMode = false;
    var applyMode = false;
    var selectedVertex = null;
    var closedShape = false;
    
    var curvePoints=[]

	this.draw = function(){
        
        this.updateThickness();
        updatePixels();
        
        // Set mouse up/down to false
        mouseDown = false;
        mouseUp = false;
        
        // On mouse up
        if (!mouseIsPressed && mousePressed){
            mousePressed = false;
            mouseUp = true;
            
            selectedVertex=null;
        }
        
        // On mouse down
        if (mouseIsPressed && !mousePressed){
            mousePressed = true;
            mouseDown = true;
        }
        
        // If start drawing inside canvas
        if (this.mouseAbove() && mouseDown && !editMode){
            this.drawing = true;
            curvePoints.push([mouseX, mouseY]);
        }
         
        
        // If user is in edit mode
        if (editMode)
        {   
            // Select a curve vertex if mouse is above vertex control point
            if (selectedVertex==null && mouseDown){ 
                for (var i = 0; i < curvePoints.length; i++){
                    if (dist(mouseX,mouseY,curvePoints[i][0],curvePoints[i][1]) < 15){
                        selectedVertex = i;   
                    }
                }
            }
            // If a vertex is selected
            else if (selectedVertex!=null){
                curvePoints[selectedVertex][0]=mouseX;
                curvePoints[selectedVertex][1]=mouseY;
            }
        }
        else{ // Enable first set of options buttons if there are vertices
            if (curvePoints.length>1 && !applyMode){
                this.actionBtn.style.display = "block";
                this.actionBtn.innerHTML = "Confirm";
                this.closeToggle.style.display = "block";
            }
        }
        
        // Draw Curve
        if (curvePoints.length!=0){
            
            push();
            fill(255,255,255,0);
            strokeWeight(this.thickness);
            
            beginShape(); // Create a shape with curve vertices
            curveVertex(curvePoints[0][0],curvePoints[0][1]); // Control point start
            for (var i = 0; i < curvePoints.length; i++) curveVertex(curvePoints[i][0],curvePoints[i][1]); // Add inbetween vertices from coordinate array

            if (closedShape){ // If shape is closed
                if (!editMode && this.mouseAbove()) curveVertex(mouseX,mouseY);
                endShape(CLOSE); 
            } 
            else{ // If shape is open
                if (!editMode && this.mouseAbove()){
                    curveVertex(mouseX,mouseY);
                    curveVertex(mouseX,mouseY);
                }
                else curveVertex(curvePoints[curvePoints.length-1][0],curvePoints[curvePoints.length-1][1]);
                endShape(); 
            } 
            pop();
            
            if (applyMode){ // Apply curve to canvas and reset tool
                loadPixels();
                curvePoints = [];
                applyMode = false;
                this.closeToggle.style.display = "none";
            }
        }
        
        // Draw cursor
        if (editMode||(!editMode && this.mouseAbove())){
            push();
            fill("white");
            stroke("black");
            strokeWeight(1);
            if (!editMode) ellipse(mouseX,mouseY,15,15);
            
            // Draw curve vertices
            for (var i = 0; i < curvePoints.length; i++) ellipse(curvePoints[i][0],curvePoints[i][1],15,15);
            pop();
        }
	};
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Reset tool
    this.cancelCurve = function(){
        updatePixels();
        curvePoints = [];
        this.actionBtn.innerHTML = "";
        this.actionBtn.style.display = "none";
    }
       
    // Add options
    this.populateOptions = function(){
        select(".options").html('<p class="option-label">Width</p>');
        var options = select(".options").elt;
        if (options.children.length==1){
            this.thicknessSlider = createSlider(1, 60, this.thickness).parent(options);
        }
        
        // Create Close Shape Button
        this.closeToggle = document.createElement("button");
        if (closedShape) this.closeToggle.innerHTML = "Open Shape";
        else this.closeToggle.innerHTML = "Close Shape";
        this.closeToggle.style.display="none";
        this.closeToggle.addEventListener("click", function(){
            closedShape=!closedShape;
            if (closedShape) this.innerHTML = "Open Shape";
            else this.innerHTML = "Close Shape";
        });
        
        // Add apply/cancel button with event listener
        this.actionBtn = document.createElement("button");
        this.actionBtn.classList.add("applyButton");
        this.actionBtn.style.display = "none"; 
        
        // Click event
        this.actionBtn.addEventListener("click", function(){
            // While in edit mode - apply curve and hide apply button
            if (editMode){ 
                editMode = false;
                applyMode = true;
                this.innerHTML = "";
                this.style.display = "none";
            }   
            // Not in edit mode - set button text and enter edit mode
            else if (curvePoints.length > 1){ 
                editMode = true;
                this.innerHTML = "Apply Vertices";
            }                              
        });
        
        // Append buttons to options bar
        options.appendChild(this.closeToggle);
        options.appendChild(this.actionBtn);
	};
    
    // Set stroke equal to thickness slider
    this.updateThickness = function(){
        strokeWeight(this.thicknessSlider.value());
        this.thickness = this.thicknessSlider.value();
    };
    
    
    
    
    
    
    
	// Clear options
	this.unselectTool = function() {
		select(".options").html("");
        this.cancelCurve();
	};
}


