// the parts we have now - replace with JSON?
// (id) part_id, width, height, type (0 = rect, 1 = triangle), style (fill color), text (text color)
var DOCK_PARTS_LIST = [
	/* 0*/{"part_id":"08X","width":5,"height":8,"type":0,"style":"brown","text_style":"white"},
	/* 1*/{"part_id":"20X","width":5,"height":5,"type":0,"style":"brown","text_style":"white"},
	/* 2*/{"part_id":"1232Z-1","width":5,"height":5,"type":1,"style":"brown","text_style":"white"},
	/* 3*/{"part_id":"08X","width":4,"height":8,"type":0,"style":"brown","text_style":"white"},
	/* 4*/{"part_id":"20X","width":4,"height":4,"type":0,"style":"brown","text_style":"white"},
	/* 5*/{"part_id":"1232Z-1","width":4,"height":4,"type":1,"style":"brown","text_style":"white"},
]; 

// (id) x, y 
var DOCK_TOOL_GRID_LIST = [
	/* 0*/{"x":10,"y":10},
	/* 1*/{"x":60,"y":10},
	/* 2*/{"x":110,"y":10},
	/* 3*/{"x":10,"y":80},
	/* 4*/{"x":50,"y":80},
	/* 5*/{"x":90,"y":80},
];



// GLOBALS
var GAME_RUNNING = true;
var GRID_LOCK = true;
var DOCK_SCALE = 10; // world pixels per foot
var WORLD_X = 100; // world width in feet
var WORLD_Y = 80; // world height in feet
var SHORE_HEIGHT = 20; // shoreline depth in feet
var BEACH_HEIGHT = 2; // beach depth in feet
var DOCK_CANVAS = null; 
var DOCK_ELEMENT = null;


// mouse stuff
var SELECTED = -1;
var HOLDING = -1;
var HOLDING_DX = 0;
var HOLDING_DY = 0;



// running total
var parts_list = [
	{"piece_id":1,"orientation":0,"x":0,"y":0},
	{"piece_id":0,"orientation":0,"x":50,"y":50},
	{"piece_id":1,"orientation":0,"x":150,"y":150},
	{"piece_id":0,"orientation":0,"x":200,"y":200},
]; // piece_id, orientation, position_x, position_y


var DOCK_WORLD = {
	INFO_MENU: {
		x: null,
		y: null,
		width: null,
		height: null,
	},
	TOOL_MENU: {
		x: null,
		y: null,
		width: null,
		height: null,
	},
	SELECTED_MENU: {
		x: null,
		y: null,
		width: 120,
		height: 40,
	},

	
	clear_parts_list: function() {
		parts_list = [];
		this.clear();
	},
	find_part: function (x, y) {
		var PARTS_LIST_ID = -1;
		for(var lp=0;lp<parts_list.length;lp++) {
			var PART = parts_list[lp];
			var BASE_PART = DOCK_PARTS_LIST[PART.piece_id];
			
			switch(BASE_PART.type) {
				case 0: // rectangle
					switch(PART.orientation) {
						case 0:
						case 180:
							if((x >= PART.x)&(y >= PART.y)&(x <= PART.x+(BASE_PART.width*DOCK_SCALE))&(y <= PART.y+(BASE_PART.height*DOCK_SCALE))) {
								PARTS_LIST_ID = lp;
							}
							break;
						case 90:
						case 270:
							if((x >= PART.x)&(y >= PART.y)&(x <= PART.x+(BASE_PART.height*DOCK_SCALE))&(y <= PART.y+(BASE_PART.width*DOCK_SCALE))) {
								PARTS_LIST_ID = lp;
							}
							break;
					}
					break;
				case 1: // triangle
					if((x >= PART.x)&(y >= PART.y)&(x <= PART.x+(BASE_PART.width*DOCK_SCALE))&(y <= PART.y+(BASE_PART.height*DOCK_SCALE))) {
						PARTS_LIST_ID = lp;
					}
					break;
			}
		}
		return PARTS_LIST_ID;
	},
	add_new_part: function(DOCK_PART_LIST_ID) {
		parts_list[parts_list.length] = {"piece_id":DOCK_PART_LIST_ID,"orientation": 0,"x": 0,"y": 0}; // add to parts_list
	},
	add_new_part_by_part_id: function(part_id) {
		for(var lp=0;lp<DOCK_PARTS_LIST.length;lp++) {
			var PART = DOCK_PARTS_LIST[lp];
			if(part_id == PART.part_id) {
				parts_list[parts_list.length] = {"piece_id":part_id,"orientation": 0,"x": 0,"y": 0}; // add to parts_list			
			}
		}
	},
	delete_part: function(parts_list_id) {
		if(parts_list_id != -1) {
			if(SELECTED == parts_list_id) {
				SELECTED = -1;
			}
			if(HOLDING == parts_list_id) {
				HOLDING = -1;
				HOLDING_DX = 0;
				HOLDING_DY = 0;
			}
			// parts_list[parts_list_id].piece_id = -1; // hide piece?
			parts_list.splice(parts_list_id,1);// delete piece from parts_list?
		}
	},
	
	clear: function() {
		var world_width = WORLD_X*DOCK_SCALE;
		var world_height = WORLD_Y*DOCK_SCALE;
		
		// water
		DOCK_CANVAS.fillStyle = '#3030b0';
		DOCK_CANVAS.fillRect(0,0,world_width,world_height);
		DOCK_CANVAS.strokeStyle = '#4040c0';
		for(var lp=0;lp<WORLD_Y;lp++) {
			DOCK_CANVAS.moveTo(0,lp*DOCK_SCALE);
			DOCK_CANVAS.lineTo(world_width,lp*DOCK_SCALE);
			DOCK_CANVAS.stroke();
		}
		
		// shoreline
		DOCK_CANVAS.fillStyle = 'tan';
		DOCK_CANVAS.fillRect(0,(WORLD_Y-SHORE_HEIGHT)*DOCK_SCALE,world_width,SHORE_HEIGHT*DOCK_SCALE);
		DOCK_CANVAS.fillStyle = 'green';
		DOCK_CANVAS.fillRect(0,(WORLD_Y-(SHORE_HEIGHT-BEACH_HEIGHT))*DOCK_SCALE,world_width,(SHORE_HEIGHT-BEACH_HEIGHT)*DOCK_SCALE);
		
		// info and other menu
		DOCK_CANVAS.strokeStyle = '1px solid black';
		DOCK_CANVAS.fillStyle = 'white';
		DOCK_CANVAS.fillRect(this.INFO_MENU.x,this.INFO_MENU.y,this.INFO_MENU.width,this.INFO_MENU.height);
		
		// tool menu
		var TOOL_GRID = 8;
		DOCK_CANVAS.fillRect(this.TOOL_MENU.x,this.TOOL_MENU.y,this.TOOL_MENU.width,this.TOOL_MENU.height);
		
		for(var lp=0;lp<DOCK_PARTS_LIST.length;lp++) {
			var PART = DOCK_PARTS_LIST[lp];
			var LOC = DOCK_TOOL_GRID_LIST[lp];

			switch(PART.type) {
				case 0: // rectangle
					DOCK_CANVAS.fillStyle = PART.style;
					DOCK_CANVAS.fillRect(this.TOOL_MENU.x+LOC.x, this.TOOL_MENU.y+LOC.y, PART.width*TOOL_GRID, PART.height*TOOL_GRID);
					DOCK_CANVAS.fillStyle = PART.text_style;
					DOCK_CANVAS.font = '10px sans-serif';
					DOCK_CANVAS.fillText(PART.width+"x"+PART.height,LOC.x+this.TOOL_MENU.x+TOOL_GRID,this.TOOL_MENU.y+LOC.y+2*TOOL_GRID);
					break;
				case 1: // triangle
					DOCK_CANVAS.fillStyle = PART.style;
					DOCK_CANVAS.beginPath();
					DOCK_CANVAS.moveTo(this.TOOL_MENU.x+LOC.x,this.TOOL_MENU.y+LOC.y);
					DOCK_CANVAS.lineTo(this.TOOL_MENU.x+LOC.x,this.TOOL_MENU.y+LOC.y+PART.height*TOOL_GRID);
					DOCK_CANVAS.lineTo(this.TOOL_MENU.x+LOC.x+PART.width*TOOL_GRID,this.TOOL_MENU.y+LOC.y);
					DOCK_CANVAS.fill();
					DOCK_CANVAS.fillStyle = PART.text_style;
					DOCK_CANVAS.font = '10px sans-serif';
					DOCK_CANVAS.fillText(PART.width+"x"+PART.height,this.TOOL_MENU.x+LOC.x+TOOL_GRID,this.TOOL_MENU.y+LOC.y+2*TOOL_GRID);
					break;
			}
		}
		
	},
	render: function() {
		// render all of the things
		for(var lp=0;lp<parts_list.length;lp++) {
			var PART = parts_list[lp];
			
			if(PART.piece_id != -1) {
				var BASE_PART = DOCK_PARTS_LIST[PART.piece_id];
			
				switch(BASE_PART.type) {
					case 0: // rectangle
						DOCK_CANVAS.fillStyle = BASE_PART.style;
						switch(PART.orientation) {
							case 0:
							case 180:
								DOCK_CANVAS.fillRect(PART.x, PART.y, BASE_PART.width*DOCK_SCALE, BASE_PART.height*DOCK_SCALE);
								break;
							case 90:
							case 270:
								DOCK_CANVAS.fillRect(PART.x, PART.y, BASE_PART.height*DOCK_SCALE, BASE_PART.width*DOCK_SCALE);
								break;
						}
						DOCK_CANVAS.fillStyle = BASE_PART.text_style;
						DOCK_CANVAS.font = '10px sans-serif';
						DOCK_CANVAS.fillText(BASE_PART.width+"x"+BASE_PART.height,PART.x+DOCK_SCALE,PART.y+2*DOCK_SCALE);
						break;
					case 1: // triangle
						DOCK_CANVAS.fillStyle = BASE_PART.style;
						switch(PART.orientation) {
							case 0:
							case 90:
							case 180:
							case 270:
								break;
						}
						DOCK_CANVAS.fillStyle = BASE_PART.text_style;
						DOCK_CANVAS.font = '10px sans-serif';
						DOCK_CANVAS.fillText(BASE_PART.width+"x"+BASE_PART.height,PART.x+DOCK_SCALE,PART.y+2*DOCK_SCALE);
						break;
				}
			}
		}
		
		// render SELECTED MENU
		if(SELECTED != -1) {
			var PART = parts_list[SELECTED];
			var BASE_PART = DOCK_PARTS_LIST[PART.piece_id];
			
			switch(BASE_PART.type) {
				case 0: // rectangle
					switch(PART.orientation) {
						case 0:
						case 180:
							this.SELECTED_MENU.x = PART.x + (BASE_PART.width * DOCK_SCALE) - DOCK_SCALE/2;
							this.SELECTED_MENU.y = PART.y + (BASE_PART.height * DOCK_SCALE) - DOCK_SCALE/2;
							break;
						case 90:
						case 270:
							this.SELECTED_MENU.x = PART.x + (BASE_PART.height * DOCK_SCALE) - DOCK_SCALE/2;
							this.SELECTED_MENU.y = PART.y + (BASE_PART.width * DOCK_SCALE) - DOCK_SCALE/2;
							break;
					}
					break;
			}
			
			DOCK_CANVAS.fillStyle = 'rgba(255,255,255,0.5)';
			DOCK_CANVAS.fillRect(this.SELECTED_MENU.x,this.SELECTED_MENU.y,this.SELECTED_MENU.width,this.SELECTED_MENU.height);
		}
	},
	
	animate: function() {
		// do stuff
		// clean up parts that need to be deleted
		
		
		// render
		DOCK_WORLD.clear();
		DOCK_WORLD.render();

		// keep going?
		if(GAME_RUNNING) {
			requestAnimationFrame(DOCK_WORLD.animate);
		}
	},
	
	
	mousedown_info_box: function(x, y) {
		console.log("mousedown infobox");
		this.add_new_part(0); // DOCK_PARTS_LIST_ID - TESTING
	},
	mouseup_info_box: function(x, y) {
		console.log("mouseup infobox");
	},
	mousedown_tool_box: function(x, y) {
		console.log("mousedown toolbox");
	},
	mouseup_tool_box: function(x, y) {
		console.log("mouseup toolbox");
	},
	mousedown_selected_box: function(x, y) {
		//console.log("mousedown selected");
		
		var clicked = parseInt(x / (this.SELECTED_MENU.width / 3)); // 3 buttons?
		
		switch(clicked) {
			case 0: // rotate left
				var ORI = parts_list[SELECTED].orientation;
				
				if(ORI == 0) {
					ORI = 270;
				} else {
					ORI -= 90;
				}
				parts_list[SELECTED].orientation = ORI;
				break;
			case 1: // rotate right
				var ORI = parts_list[SELECTED].orientation;
				
				if(ORI == 270) {
					ORI = 0;
				} else {
					ORI += 90;
				}
				parts_list[SELECTED].orientation = ORI;
				break;
			case 2:
				this.delete_part(SELECTED);
				break;
		}
		
	},
	mousedown_ground: function(x, y) {
		//console.log("mousedown ground");

		var PARTS_LIST_ID = this.find_part(x,y);
		if(PARTS_LIST_ID != -1) { // clicked on a part
			SELECTED = PARTS_LIST_ID;
			HOLDING = PARTS_LIST_ID;
			HOLDING_DX = parts_list[PARTS_LIST_ID].x - x;
			HOLDING_DY = parts_list[PARTS_LIST_ID].y - y;
		} else { // no part under me when I click!
			SELECTED = -1;
			HOLDING = -1;
			HOLDING_DX = 0;
			HOLDING_DY = 0;
		}
	},
	mouseup_ground: function(x, y) {
		//console.log("mouseup ground");
		
		if(HOLDING != -1) {
			HOLDING = -1;
			HOLDING_DX = 0;
			HOLDING_DY = 0;
		}
	},
	mousemove_ground: function(x, y) {
		if(HOLDING != -1) {
			// grid lock?
			if(GRID_LOCK == true) {
				parts_list[HOLDING].x = parseInt((x + HOLDING_DX)/DOCK_SCALE)*DOCK_SCALE;
				parts_list[HOLDING].y = parseInt((y + HOLDING_DY)/DOCK_SCALE)*DOCK_SCALE;
			} else {					
				parts_list[HOLDING].x = x + HOLDING_DX;
				parts_list[HOLDING].y = y + HOLDING_DY;
			}
			
		}
	},
	
	
	start: function() {
		requestAnimationFrame(this.animate);
	},
	
	init: function() {
		// grab context from canvas
		DOCK_ELEMENT = document.getElementById('dock_builder');
		DOCK_CANVAS = DOCK_ELEMENT.getContext('2d');
		
		// resize to fit scale
		DOCK_ELEMENT.setAttribute('width',WORLD_X*DOCK_SCALE+"px");
		DOCK_ELEMENT.setAttribute('height',WORLD_Y*DOCK_SCALE+"px");
		
		// info modal
		this.INFO_MENU.x = (WORLD_X*DOCK_SCALE)-170;
		this.INFO_MENU.y = 10;
		this.INFO_MENU.width = 160;
		this.INFO_MENU.height = 120;
		
		// tool modal
		//DOCK_CANVAS.fillRect(world_width-14*DOCK_SCALE,12*DOCK_SCALE,13*DOCK_SCALE,37*DOCK_SCALE);
		this.TOOL_MENU.x = (WORLD_X*DOCK_SCALE)-170; // +10 for margin
		this.TOOL_MENU.y = 140; // +10 for margin
		this.TOOL_MENU.width = 160;
		this.TOOL_MENU.height = (WORLD_Y*DOCK_SCALE)-150;
		
		// wipe and prepare
		this.clear();
		this.render();
		
		// LISTENERS NEED DIRECT ACCESS TO THE WORLD VARIABLE - 'this' DOES NOT WORK IN LISTENERS!
		DOCK_ELEMENT.addEventListener('mousedown',function(e){
			var local_x = e.clientX - DOCK_ELEMENT.offsetLeft;
			var local_y = e.clientY - DOCK_ELEMENT.offsetTop;
			
			// check if it's in the selected menu
			if((local_x > DOCK_WORLD.SELECTED_MENU.x) && (local_x < DOCK_WORLD.SELECTED_MENU.x + DOCK_WORLD.SELECTED_MENU.width) && (local_y > DOCK_WORLD.SELECTED_MENU.y) && (local_y < DOCK_WORLD.SELECTED_MENU.y + DOCK_WORLD.SELECTED_MENU.height)) {
				DOCK_WORLD.mousedown_selected_box(local_x-DOCK_WORLD.SELECTED_MENU.x,local_y-DOCK_WORLD.SELECTED_MENU.y);
			} else

			// check if it's in the info box
			if((local_x > DOCK_WORLD.INFO_MENU.x) && (local_x < DOCK_WORLD.INFO_MENU.x + DOCK_WORLD.INFO_MENU.width) && (local_y > DOCK_WORLD.INFO_MENU.y) && (local_y < DOCK_WORLD.INFO_MENU.y + DOCK_WORLD.INFO_MENU.height)) {
				DOCK_WORLD.mousedown_info_box(local_x-DOCK_WORLD.INFO_MENU.x,local_y-DOCK_WORLD.INFO_MENU.y);
			} else 

			// check if it's in the toolbox
			if((local_x > DOCK_WORLD.TOOL_MENU.x) && (local_x < DOCK_WORLD.TOOL_MENU.x + DOCK_WORLD.TOOL_MENU.width) && (local_y > DOCK_WORLD.TOOL_MENU.y) && (local_y < DOCK_WORLD.TOOL_MENU.y + DOCK_WORLD.TOOL_MENU.height)) {
				DOCK_WORLD.mousedown_tool_box(local_x-DOCK_WORLD.TOOL_MENU.x,local_y-DOCK_WORLD.TOOL_MENU.y);
			} else {
				DOCK_WORLD.mousedown_ground(local_x,local_y);
			}
			
		});
		DOCK_ELEMENT.addEventListener('mouseup',function(e){
			var local_x = e.clientX - DOCK_ELEMENT.offsetLeft;
			var local_y = e.clientY - DOCK_ELEMENT.offsetTop;
			
			// check if it's in the selected menu
			if((local_x > DOCK_WORLD.SELECTED_MENU.x) && (local_x < DOCK_WORLD.SELECTED_MENU.x + DOCK_WORLD.SELECTED_MENU.width) && (local_y > DOCK_WORLD.SELECTED_MENU.y) && (local_y < DOCK_WORLD.SELECTED_MENU.y + DOCK_WORLD.SELECTED_MENU.height)) {
				//DOCK_WORLD.mouseup_selected_box(local_x-DOCK_WORLD.SELECTED_MENU.x,local_y-DOCK_WORLD.SELECTED_MENU.y);
			} else
				
			// check if it's in the info box
			if((local_x > DOCK_WORLD.INFO_MENU.x) && (local_x < DOCK_WORLD.INFO_MENU.x + DOCK_WORLD.INFO_MENU.width) && (local_y > DOCK_WORLD.INFO_MENU.y) && (local_y < DOCK_WORLD.INFO_MENU.y + DOCK_WORLD.INFO_MENU.height)) {
				DOCK_WORLD.mouseup_info_box(local_x-DOCK_WORLD.INFO_MENU.x,local_y-DOCK_WORLD.INFO_MENU.y);
			} else 

			// check if it's in the toolbox
			if((local_x > DOCK_WORLD.TOOL_MENU.x) && (local_x < DOCK_WORLD.TOOL_MENU.x + DOCK_WORLD.TOOL_MENU.width) && (local_y > DOCK_WORLD.TOOL_MENU.y) && (local_y < DOCK_WORLD.TOOL_MENU.y + DOCK_WORLD.TOOL_MENU.height)) {
				DOCK_WORLD.mouseup_tool_box(local_x-DOCK_WORLD.INFO_MENU.x,local_y-DOCK_WORLD.INFO_MENU.y);
			} else {
				DOCK_WORLD.mouseup_ground(local_x,local_y);
			}
			
		});
		
		DOCK_ELEMENT.addEventListener('mousemove',function(e){
			var local_x = e.clientX - DOCK_ELEMENT.offsetLeft;
			var local_y = e.clientY - DOCK_ELEMENT.offsetTop;
			
			// check if it's in the info box
			if((local_x > DOCK_WORLD.INFO_MENU.x) && (local_x < DOCK_WORLD.INFO_MENU.x + DOCK_WORLD.INFO_MENU.width) && (local_y > DOCK_WORLD.INFO_MENU.y) && (local_y < DOCK_WORLD.INFO_MENU.y + DOCK_WORLD.INFO_MENU.height)) {
				//DOCK_WORLD.mousemove_info_box(local_x-DOCK_WORLD.INFO_MENU.x,local_y-DOCK_WORLD.INFO_MENU.y);
			} else 

			// check if it's in the toolbox
			if((local_x > DOCK_WORLD.TOOL_MENU.x) && (local_x < DOCK_WORLD.TOOL_MENU.x + DOCK_WORLD.TOOL_MENU.width) && (local_y > DOCK_WORLD.TOOL_MENU.y) && (local_y < DOCK_WORLD.TOOL_MENU.y + DOCK_WORLD.TOOL_MENU.height)) {
				//DOCK_WORLD.mousemove_tool_box(local_x-DOCK_WORLD.TOOL_MENU.x,local_y-DOCK_WORLD.TOOL_MENU.y);
			} else {
				DOCK_WORLD.mousemove_ground(local_x,local_y);
			}
			
		});
		
		
		
		// start animation
		//this.start();
	},
	
};
DOCK_WORLD.init();
DOCK_WORLD.start();