function ShapeTool() {
    // Set icon and name
    this.name = "shapeTool";
    
    // Set defaults
    this.icon = "assets/shapeTool-icon.png";
    this.actionBtn = null;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    var mouseDownOutCanvas = false;
    
    // Shape Coordinates
    var startX = null;
	var startY = null;
    var endX = null;
    var endY = null;
    
    // States
    var editMode = false;
    var startSelected = false;
    var endSelected = false;
    
    // Shape options
    var selectedShapeID = "rectangle";
    this.draw = function(){
        // Clear temporary drawings
        updatePixels();
        
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
            if (startX==null){
                startX = mouseX;
                startY = mouseY;
            }
            else if (endX==null)
            {      
                endX=mouseX;
                endY=mouseY;
                editMode=true;
                this.actionBtn.style.display = "block";
                this.actionBtn.innerHTML = "Cancel";
            }
        }
        
        // Shape Editing ------------------------------------------------------------------------------------------------------
        // If user clicks on anchor point
        if (editMode && mouseDown && this.mouseAbove()){
            if (dist(mouseX,mouseY,startX,startY) < 15){
                startSelected=true;
            }
            else if (dist(mouseX,mouseY,endX,endY) < 15){
                endSelected=true;
            }
            else this.applyShape();
        }
        
        // User Drags anchorpoint
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
        
        // Constrain Ends
        if (endX!=null){
            endX = constrain(endX, 0, width);
            endY = constrain(endY, 0, height);
        }
        
        // Draw Shape ---------------------------------------------------------------------------------------------------------
        if (startX!=null && (editMode||(!editMode && this.mouseAbove())))
        { 
            var targetX=mouseX;
            var targetY=mouseY;
            if (endX!=null){
                targetX = endX;
                targetY = endY;
            }
            
            // Draw the seletced shape
            if (selectedShapeID=="rectangle") rect(startX, startY, targetX-startX, targetY-startY);
            if (selectedShapeID=="ellipse") ellipse((startX+targetX)/2, (startY+targetY)/2, targetX-startX, targetY-startY);
            if (selectedShapeID=="triangle") triangle(startX, startY, targetX, startY, (startX+targetX)/2, targetY);
        }
        
        
        // Draw Scaffolding ---------------------------------------------------------------------------------------------------
        if (editMode||(!editMode && this.mouseAbove())){
            push();

            var targetX=mouseX;
            var targetY=mouseY;
            if (endX!=null){
                targetX=endX;
                targetY=endY;         
            }

            fill(0,0,0,0);  
            stroke("black");
            strokeWeight(1);
            if (startX!=null) rect(startX, startY, targetX-startX, targetY-startY); 

            fill("white");
            if (startX!=null) ellipse(startX,startY,15,15);
            if (endX!=null) ellipse(endX,endY,15,15); 
            if (!editMode) ellipse(mouseX,mouseY,15,15); 
            pop(); 
        }     
	};
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    var cancel = function(){
        editMode = false;
        startX=null;
        startY=null;
        endX=null;
        endY=null;
    };
    
    this.applyShape = function(){     
        if (editMode){     
            // Apply selected shape to canvas
            updatePixels();   
            if (selectedShapeID=="rectangle") rect(startX, startY, endX-startX, endY-startY);
            if (selectedShapeID=="ellipse") ellipse((startX+endX)/2, (startY+endY)/2, endX-startX, endY-startY);
            if (selectedShapeID=="triangle") triangle(startX, startY, endX, startY, (startX+endX)/2, endY);
            loadPixels();
        }
        this.actionBtn.innerHTML = "";
        this.actionBtn.style.display = "none";
        cancel();
    };
    
    // Add options
    this.populateOptions = function(){
        strokeWeight(1);

        var options = select(".options").elt;
        
        // Add rectangle button with event listener
        var rectangleButton = document.createElement("button");
        rectangleButton.classList.add("rectangleButton");
        
        // Add ellipse button with event listener
        var ellipseButton = document.createElement("button");
        ellipseButton.classList.add("ellipseButton");
        
        // Add triangle button with event listener
        var triangleButton = document.createElement("button");
        triangleButton.classList.add("triangleButton");
        
        if (selectedShapeID == "rectangle") rectangleButton.classList.add("selectedOption");
        if (selectedShapeID == "ellipse") ellipseButton.classList.add("selectedOption");
        if (selectedShapeID == "triangle") triangleButton.classList.add("selectedOption");
        
        // Add click funtionality to shape buttons
        rectangleButton.addEventListener("click", function(){
            selectedShapeID="rectangle";
            rectangleButton.classList.add("selectedOption");
            ellipseButton.classList.remove("selectedOption");
            triangleButton.classList.remove("selectedOption");
        });
        ellipseButton.addEventListener("click", function(){
            selectedShapeID="ellipse";
            rectangleButton.classList.remove("selectedOption");
            ellipseButton.classList.add("selectedOption");
            triangleButton.classList.remove("selectedOption");
        });
        triangleButton.addEventListener("click", function(){
            selectedShapeID="triangle";
            rectangleButton.classList.remove("selectedOption");
            ellipseButton.classList.remove("selectedOption");
            triangleButton.classList.add("selectedOption");
        });
        
        // Append buttons to options bar
        options.appendChild(rectangleButton);
        options.appendChild(ellipseButton);
        options.appendChild(triangleButton);
        
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
    
    // Clear options
	this.unselectTool = function() {
		select(".options").html("");
        if (!editMode) updatePixels();
        this.applyShape();
	};
}