function LineToTool(){
    // Set icon and name
	this.icon = "assets/lineTo.jpg";
	this.name = "lineToTool";
    
    // Set defaults
    this.thicknessSlider = null;
    this.actionBtn = null;
    this.thickness = 5;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;

    // Shape Coordinates
	var startX = null;
	var startY = null;
    var endX = null;
    var endY = null;
    
    // Tool states
    var editMode = false;
    var startSelected = false;
    var endSelected = false;

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
        }
        
        // On mouse down
        if (mouseIsPressed && !mousePressed){
            mousePressed = true;
            mouseDown = true;
        }       
        
        // If mouse down inside canvas
        if (mouseDown && this.mouseAbove()){
            if (startX==null){ // Start coord doesn't exist 
                startX = mouseX;
                startY = mouseY;
            }
            else if (endX==null) // End coord doesn't exist - enter edit mode 
            {      
                endX=mouseX;
                endY=mouseY;
                editMode=true;
                this.actionBtn.style.display = "block";
                this.actionBtn.innerHTML = "Cancel";
            }
        }
        
        // If user clicks on anchor point
        if (editMode && mouseDown && this.mouseAbove()){
            if (dist(mouseX,mouseY,startX,startY) < 10){
                startSelected=true;
            }
            else if (dist(mouseX,mouseY,endX,endY) < 10){
                endSelected=true;
            }
            else this.applyLine();
        }
        
        // User Drags Anchorpoint
        if (startSelected){
            if (mousePressed){
                startX=mouseX;
                startY=mouseY;
            }
            else startSelected=false;
        }
        if (endSelected){
            if (mousePressed){
                endX=mouseX;
                endY=mouseY;
            }
            else endSelected=false;
        }
        
        // Constrain end coords to stay on canvas
        if (endX!=null){
            endX = constrain(endX, 0, width);
            endY = constrain(endY, 0, height);
        }
        
        // Draw Line
        if (startX!=null && (editMode||(!editMode && this.mouseAbove())))
        {    
            if (endX==null) line(startX, startY, mouseX, mouseY); 
            else line(startX, startY, endX, endY); 
        }
        
        // Draw Anchorpoints
        if ((editMode||(!editMode && this.mouseAbove()))){
            push();
            fill("white");
            stroke("black");
            strokeWeight(1);

            if (startX!=null) ellipse(startX,startY,15,15);
            if (endX!=null)ellipse(endX,endY,15,15);
            if (!editMode) ellipse(mouseX,mouseY,15,15);    
            pop(); 
        }
	};
    
    // Reset the tool 
    var cancel = function(){
        editMode = false;
        startX=null;
        startY=null;
        endX=null;
        endY=null;
    };
    
    // Ammend the line drawing to canvas
    this.applyLine = function(){     
        if (editMode){
            updatePixels();   
            line(startX, startY, endX, endY);
            loadPixels();
        }
        this.actionBtn.innerHTML = "";
        this.actionBtn.style.display = "none";
        cancel();
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
        
        // Add apply/cancel button with event listener
        this.actionBtn = document.createElement("button");
        this.actionBtn.classList.add("applyButton");
        this.actionBtn.style.display = "none";
        
        this.actionBtn.addEventListener("click", function(){
            editMode = false;
            startX=null;
            startY=null;
            endX=null;
            endY=null;
            this.innerHTML = "";
            this.style.display = "none";
        });
        
        // Append buttons to options bar
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
        this.applyLine();
	};
}

