var GAME = {
	CANVAS: null,
	CONTEXT: null,
	GAME_ON: true,
	GAME_STATE: 1,// 0=title,demo,menu,level intro,level,level end,game end,game off
	PAUSED: true,
	CANVAS_WIDTH: null,
	CANVAS_HEIGHT: null,
	
	// defaults
	PIXEL_SIZE: 40,
	
	
	//-------- CONTROLS -----------//
	CONTROLS: null, // (x y fire bomb start select)
	
	
	//-------- OBJECTS ------------//
	// player
	PLAYER: null,
	PLAYER_COLOR: null,
	LIFE_COUNT: null,
	
	// mobiles
	MOBILES: null,
	
	// projectiles
	PROJECTILES: null,
	
	
	//-------- MODELS ------------//
	// title model
	TITLE_MODELS: null,
	
	// mobile models
	MOBILE_MODELS: null,
	
	// enemy grid models
	GRID_MODELS: null,
	
	// boss models
	BOSS_MODELS: null,
	
	
	
	// functions
	init: function() {
		this.CANVAS = document.getElementById('game_canvas');
		this.CANVAS_WIDTH = this.PIXEL_SIZE*8;
		this.CANVAS.width = this.CANVAS_WIDTH;
		this.CANVAS.style.width = this.CANVAS_WIDTH + "px";
		this.CANVAS_HEIGHT = this.PIXEL_SIZE*16;
		this.CANVAS.height = this.CANVAS_HEIGHT;
		this.CANVAS.style.height = this.CANVAS_HEIGHT + "px";
		this.CONTEXT = this.CANVAS.getContext('2d',{alpha:false});
		

		// set up control handler
		this.CONTROL_HANDLER = [0,0,0,0,0,0];

		
		// set up player
		this.PLAYER = {
			x: 0.0,
			y: 14.0,
			ax: 0.0,
			ay: 0.0
		};
		this.PLAYER_COLOR = {r:255,g:0,b:0};
		this.PLAYER_ACCEL = 0.1; // pixels/tick
		this.LIFE_COUNT = 3;
		
		
		
		// set up handlers!
		this.init_controls();
		
		
		
		// start it all 
		requestAnimationFrame(this.animate);
		this.start();
	},
	init_controls: function() {
		document.addEventListener('keydown',function(e){
			//console.log(e.keyCode);
			switch(e.keyCode) {
				case 37: // left
					GAME.CONTROL_HANDLER[0] = -1;
					break;
				case 39: // right
					GAME.CONTROL_HANDLER[0] = 1;
					break;
			}
		});
		document.addEventListener('keyup',function(e){
			//console.log(e.keyCode);
			switch(e.keyCode) {
				case 37: // left
				case 39: // right
					GAME.CONTROL_HANDLER[0] = 0;
					break;
			}
		});
	
	},
	start: function() {
		
		
		// animate!
	},
	start_game: function() {},
	start_level: function() {},
	finish_level: function() {},
	finish: function() {},

	clear: function() {
		GAME.CONTEXT.clearRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
	},
	render_title: function() {
		GAME.CONTEXT.fillStyle = 'white';
		
	},
	render_background: function() {
		// background
		GAME.CONTEXT.fillStyle = '#000000';
		GAME.CONTEXT.fillRect(0,0,GAME.CANVAS_WIDTH,GAME.CANVAS_HEIGHT);
	},
	color_code: function(color) {
		buf = Math.floor(color).toString(16);
		if(buf.length < 2) {
			buf = "0" + buf;
		}
		return buf;
	},
	render_player: function() {
		// player - ratcheting position!
		var x = Math.floor(GAME.PLAYER.x);
		var y = Math.floor(GAME.PLAYER.y);
		var ox = (GAME.PLAYER.x%1);
		var oy = (GAME.PLAYER.y%1);
		
		// player color - fading between pixels
		var r1 = (1-ox)*GAME.PLAYER_COLOR.r;
		var g1 = (1-ox)*GAME.PLAYER_COLOR.g;
		var b1 = (1-ox)*GAME.PLAYER_COLOR.b;
		var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
		var r2 = ox*GAME.PLAYER_COLOR.r;
		var g2 = ox*GAME.PLAYER_COLOR.g;
		var b2 = ox*GAME.PLAYER_COLOR.b;
		var color2 = "#"+GAME.color_code(r2)+GAME.color_code(g2)+GAME.color_code(b2);
		
		// render all of it
		GAME.CONTEXT.fillStyle = color1;
		GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
		GAME.CONTEXT.fillStyle = color2;
		GAME.CONTEXT.fillRect((x+1)*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
	},
	render: function() {
		GAME.render_background();
		
		switch(GAME.GAME_STATE) {
			case 0: // title
				break;
			case 1: //	demo
				GAME.render_player();
				break;
			case 2: //
			case 3: //
			case 4: //
			case 5: //
			case 6: //
			case 7: //
				break;
		}
	},
	
	move_player: function() {
		// add acceleration
		if(GAME.CONTROL_HANDLER[0] != 0) {
			GAME.PLAYER.ax += GAME.CONTROL_HANDLER[0]*GAME.PLAYER_ACCEL;
		} else {
			GAME.PLAYER.ax /= 2;
		}
		
		// move
		GAME.PLAYER.x += GAME.PLAYER.ax;
		if(GAME.PLAYER.x < 0) {
			GAME.PLAYER.x = 0;
			GAME.PLAYER.ax = 0;
		}
		if(GAME.PLAYER.x > 7) {
			GAME.PLAYER.x = 7;
			GAME.PLAYER.ax = 0;
		}
		
		console.log(GAME.PLAYER.x);
	},
	move_mobiles: function() {
		
	},
	
	// animate needs to refer to GAME instead of this!
	animate: function() {
		// do things
		GAME.move_player();
		GAME.move_mobiles();
		
		
		// render things
		GAME.clear();
		GAME.render();
		
		requestAnimationFrame(GAME.animate);
	},
}

GAME.init();