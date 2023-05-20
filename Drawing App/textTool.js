let fontDict = null

function TextTool() {
    // Set icon and name
    this.name = "textTool";
    this.icon = "assets/textTool-icon.png";
    
    // Set defaults
    this.text = "Type...";
    this.fontSizeSlider = null;
    this.fontSize = 20;
    var sel = null;
    
    // Tool States
    var backSpacePressed = false;   
    var removeCharTimeStamp = 0;
    var backSpaceDownTimeStamp = 0;
    var cursorBlinkTimeStamp = 0;
    var cursorVisible = true;
    
    // Mouse actions
    var mouseUp = false
    var mouseDown = false;
    var mousePressed = false;
    
    // Load font options
    font1 = loadFont('fonts/Marcellus/Marcellus-Regular.ttf');
    font2 = loadFont('fonts/Roboto/Roboto-Regular.ttf');
    font3 = loadFont('fonts/Poppins/Poppins-Regular.ttf');
    font4 = loadFont('fonts/Ubuntu/Ubuntu-Regular.ttf');
    font5 = loadFont('fonts/Orbitron/Orbitron-Regular.ttf');
    fontDict = {Marcellus : font1, Roboto : font2, Poppins : font3, Ubuntu : font4, Orbitron : font5};
    var usingFont = fontDict.Marcellus;
    
    this.draw = function (){
        // Clear temporary drawings
        updatePixels();
        
        // Update font size
        this.updateFontSize();
        
        // Get current time
        var time = Date.now()
        
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
        
        // If mouse down inside canvas - apply text to canvas
		if (mouseDown && this.mouseAbove()){    
            updatePixels();
            textAlign(CENTER);
            textFont(usingFont);
            text(this.text, mouseX, mouseY);
            loadPixels();  
        }
        // Draw temporary text and cursor 
        else if (this.mouseAbove()){ 
            
            // Draw temporary text
            textAlign(CENTER);
            textFont(usingFont);
            text(this.text, mouseX, mouseY);
            
            // Check if blinking cursor is visible or hidden
            if (time - cursorBlinkTimeStamp > 600){
                cursorVisible = !cursorVisible;  
                cursorBlinkTimeStamp = time;
            }
            
            // If cursor is visible - draw line
            if (cursorVisible){
                push();
                strokeWeight(2);
                var bounds = usingFont.textBounds(this.text, mouseX, mouseY);
                line(bounds.x + bounds.w + 0.1*this.fontSize, bounds.y, bounds.x + bounds.w + 0.1*this.fontSize, bounds.y + bounds.h);
                pop();
            }
        }
        
        // Remove 1 char if backspace is held for long enough and 0.1 seconds have passed since last removal
        if (time - removeCharTimeStamp > 50 && time - backSpaceDownTimeStamp > 600 && this.text.length > 0 && backSpacePressed){
            this.unType();
            removeCharTimeStamp = time; // Set timestamp to current time
        }
    };
    
    // Check if mouse is above canvas
    this.mouseAbove = function(){
        if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) return true;
        else return false;
    };
    
    // Add options
    this.populateOptions = function(){
        var options = select(".options").elt;
        
        // Create font size label
        var fontSizeLabel = createElement("p", "Font Size").parent(options)
        fontSizeLabel.addClass("option-label")
        this.fontSizeSlider = createSlider(12, 400, this.fontSize).parent(options);
        strokeWeight(1);
        
        // Font dropdown
        sel = createSelect().parent(options);
        sel.option('Marcellus');
        sel.option('Roboto');
        sel.option('Poppins');
        sel.option('Ubuntu');
        sel.option('Orbitron');
        sel.changed(SelectFont);
	};
    
    // Clear options
	this.unselectTool = function() {
		loadPixels();
		select(".options").html("");
	};
    
    // Set font size equal to slider
    this.updateFontSize = function(){
        textSize(this.fontSizeSlider.value());
        this.fontSize = this.fontSizeSlider.value();
    };
    
    // Select Font
    SelectFont = function(){
        usingFont = fontDict[sel.value()];
    }
    
    // Adds one char 
    this.type = function(key){
        this.text = this.text.concat(key);
    };
    
    // Removes one char 
    this.unType = function(){
        this.text = this.text.slice(0,-1);
    };
    
    // Backspace button down 
    this.backSpaceDown = function(){
        this.unType();
        backSpacePressed = true;
        backSpaceDownTimeStamp = Date.now();
    };
    
    // Backspace button release
    this.backSpaceUp = function(){
        backSpacePressed = false;
    };
}