var GAME = {
	CLOCK: null,
	ELAPSED: null,
	LAST_TICK: null,

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
	CONTROL_HANDLER: null, // (x y fire bomb start select)
	CONTROL_QUEUE: null, // (x y fire bomb start select)
	
	
	//-------- OBJECTS ------------//
	// player
	PLAYER: null,
	PLAYER_COLOR: null,
	PLAYER_FIRE_COOLDOWN: null,
	PLAYER_LIFE_COUNT: null,
	
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
	
	// projectile models
	PROJECTILE_MODELS: null,
	
	
	
	// functions
	init: function() {
		// set up canvas
		this.CANVAS = document.getElementById('game_canvas');
		this.CANVAS_WIDTH = this.PIXEL_SIZE*8;
		this.CANVAS.width = this.CANVAS_WIDTH;
		this.CANVAS.style.width = this.CANVAS_WIDTH + "px";
		this.CANVAS_HEIGHT = this.PIXEL_SIZE*16;
		this.CANVAS.height = this.CANVAS_HEIGHT;
		this.CANVAS.style.height = this.CANVAS_HEIGHT + "px";
		this.CONTEXT = this.CANVAS.getContext('2d',{alpha:false});
		
		
		// CLOCK
		this.CLOCK = new Date().getTime();
		this.LAST_TICK = this.CLOCK;
		

		// CONTROLS
		// set up control handler
		this.CONTROL_HANDLER = [0,0,0,0,0,0]; // (x y fire bomb start select)
		this.CONTROL_QUEUE = [0,0,0,0,0,0]; // (x y fire bomb start select)
		
		
		// PROJECTILE MODELS
		// set up projectile models!
		this.PROJECTILE_MODELS = [
			{ // player shots
				w: 1,
				h: 1,
				ax: 0,
				ay: -0.1,
				r: 255,
				g: 0,
				b: 0,
				delta_r: -1,
				delta_g: 0,
				delta_b: 0
			},
			{ // player bombs
				w: 1,
				h: 1,
				ax: 0,
				ay: -0.02,
				r: 0,
				g: 255,
				b: 0,
				delta_r: 1,
				delta_g: -2,
				delta_b: 2
			}
		];


		
		
		// ANIMATED THINGS
		// set up player
		this.PLAYER = {
			x: 0.0,
			y: 13.0,
			ax: 0.0,
			ay: 0.0,
			fire1: 0, // projectile ID
			fire2: 1, // projectile ID
			f1_timer: 0,
			f2_timer: 0,
			color: {r:160,g:32,b:128},
			accel: 0.07, // pixels/tick
			lives: 3,
			f1_cooldown: 200,
			f2_cooldown: 1000
		};
		
		this.MOBILES = [];
		this.PROJECTILES = [];
		
		
		
		
		// set up handlers!
		this.init_controls();
		
		
		
		// start it all 
		requestAnimationFrame(this.animate);
		this.start();
	},
	init_controls: function() {
		document.addEventListener('keydown',function(e){
			console.log(e.keyCode);
			switch(e.keyCode) {
				case 37: // left
					GAME.CONTROL_HANDLER[0] = -1;
					break;
				case 39: // right
					GAME.CONTROL_HANDLER[0] = 1;
					break;
				case 32: // space = fire
					GAME.CONTROL_HANDLER[2] = 1;					
					break;
				case 38: // up = bomb
					GAME.CONTROL_HANDLER[3] = 1;					
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
				case 32: // space = fire
					GAME.CONTROL_HANDLER[2] = 0;
					break;
				case 38: // up = bomb
					GAME.CONTROL_HANDLER[3] = 0;					
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
	
	create_projectile: function(who,shot) {
		var proj = {
			type: shot, // player projectile ID
			owner: who,
			x: Math.floor(who.x+0.5),
			y: who.y - 0.5,
			ax: this.PROJECTILE_MODELS[0].ax,
			ay: this.PROJECTILE_MODELS[0].ay,
			time: 0
		};
		
		this.PROJECTILES.push(proj);
		console.log(proj);
	},
	
	
	render_player: function() {
		// player - ratcheting position!
		var x = Math.floor(GAME.PLAYER.x);
		var y = Math.floor(GAME.PLAYER.y);
		var ox = (GAME.PLAYER.x%1);
		var oy = (GAME.PLAYER.y%1);
		
		// player color - fading between pixels
		var r1 = (1-ox)*GAME.PLAYER.color.r;
		var g1 = (1-ox)*GAME.PLAYER.color.g;
		var b1 = (1-ox)*GAME.PLAYER.color.b;
		var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
		var r2 = ox*GAME.PLAYER.color.r;
		var g2 = ox*GAME.PLAYER.color.g;
		var b2 = ox*GAME.PLAYER.color.b;
		var color2 = "#"+GAME.color_code(r2)+GAME.color_code(g2)+GAME.color_code(b2);
		
		// render all of it
		GAME.CONTEXT.fillStyle = color1;
		GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*2);	
		GAME.CONTEXT.fillStyle = color2;
		GAME.CONTEXT.fillRect((x+1)*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*2);	
	},
	render_projectiles: function() {
		for(var lp=0;lp<GAME.PROJECTILES.length;lp++) {
			GAME.render_projectile(GAME.PROJECTILES[lp]);
		}
	},
	render_projectile: function(proj) {
		//console.log(proj);
		
		switch(proj.type) {
			case 0: // player shot
			case 1: // player bomb
				// player fire - ratcheting position!
				var x = Math.floor(proj.x);
				var y = Math.floor(proj.y);
				var ox = (proj.x%1);
				var oy = (proj.y%1);
				
				// grab base color
				var base_r = GAME.PROJECTILE_MODELS[proj.type].r;
				var base_g = GAME.PROJECTILE_MODELS[proj.type].g;
				var base_b = GAME.PROJECTILE_MODELS[proj.type].b;
				
				// animate color
				var step = proj.time % 128;
				base_r += step * GAME.PROJECTILE_MODELS[proj.type].delta_r;
				if(base_r > 255) {base_r = 255;}
				if(base_r < 0) {base_r = 0;}
				base_g += step * GAME.PROJECTILE_MODELS[proj.type].delta_g;
				if(base_g > 255) {base_g = 255;}
				if(base_g < 0) {base_g = 0;}
				base_b += step * GAME.PROJECTILE_MODELS[proj.type].delta_b;
				if(base_b > 255) {base_b = 255;}
				if(base_b < 0) {base_b = 0;}
				var color0 = "#"+GAME.color_code(base_r)+GAME.color_code(base_g)+GAME.color_code(base_b);
				
				
				// player fire color - fading between pixels
				var r1 = (1-oy)*base_r;
				var g1 = (1-oy)*base_g;
				var b1 = (1-oy)*base_b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				var r2 = oy*base_r;
				var g2 = oy*base_g;
				var b2 = oy*base_b;
				var color2 = "#"+GAME.color_code(r2)+GAME.color_code(g2)+GAME.color_code(b2);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
				GAME.CONTEXT.fillStyle = color2;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,(y+1)*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);
				break;
		}
	},
	
	
	render: function() {
		GAME.render_background();
		
		switch(GAME.GAME_STATE) {
			case 0: // title
				break;
			case 1: //	demo
				GAME.render_player();
				GAME.render_projectiles();
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
		// add acceleration - x axis
		if(GAME.CONTROL_HANDLER[0] != 0) {
			GAME.PLAYER.ax += GAME.CONTROL_HANDLER[0]*GAME.PLAYER.accel;
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
	},
	move_mobiles: function() {},
	move_mobile: function() {},
	move_projectiles: function() {
		for(var lp=0;lp<GAME.PROJECTILES.length;lp++) {
			GAME.move_projectile(GAME.PROJECTILES[lp]);			
		}
	},
	move_projectile: function(proj) {
		proj.ax += GAME.PROJECTILE_MODELS[proj.type].ax;
		proj.ay += GAME.PROJECTILE_MODELS[proj.type].ay;
		
		proj.x += proj.ax;
		proj.y += proj.ay;
		
		proj.time += GAME.ELAPSED;
	},
	
	dispose_projectiles: function() {
		for(var lp=0;lp<GAME.PROJECTILES.length;lp++) {
			GAME.dispose_projectile(lp);			
		}
	},
	dispose_projectile: function(proj) {
		if(proj.y < 0 || proj.y > 15 || proj.x < 0 || proj.x > 7) {
			delete GAME.PROJECTILES[proj];
		}
	},
	
	// animate needs to refer to GAME instead of this!
	animate: function(time) {
		GAME.ELAPSED = time - GAME.CLOCK;
		GAME.CLOCK = time;
		
		// handle other controls - fire bomb select start
		if(GAME.CONTROL_HANDLER[2] == 1) { // fire
			if(GAME.CONTROL_QUEUE[2] == 0) { // if the button isn't already down!
				if(GAME.CLOCK > GAME.PLAYER.f1_timer) { // timing catch for player shooting!
					GAME.create_projectile(GAME.PLAYER,0);
					GAME.CONTROL_QUEUE[2] = 1;
					GAME.PLAYER.f1_timer = GAME.CLOCK + GAME.PLAYER.f1_cooldown;
				}
			}
		} else {
			GAME.CONTROL_QUEUE[2] = 0; // reset button
		}
		if(GAME.CONTROL_HANDLER[3] == 1) { // bomb
			if(GAME.CONTROL_QUEUE[3] == 0) { // if the button isn't already down!
				if(GAME.CLOCK > GAME.PLAYER.f2_timer) { // timing catch for player shooting!
					GAME.create_projectile(GAME.PLAYER,1);
					GAME.CONTROL_QUEUE[3] = 1;
					GAME.PLAYER.f2_timer = GAME.CLOCK + GAME.PLAYER.f2_cooldown;
				}
			}
		} else {
			GAME.CONTROL_QUEUE[3] = 0; // reset button
		}
		
		
		
		// do things
		GAME.move_player();
		GAME.move_mobiles();
		GAME.move_projectiles();
		
		
		// dispose of things
		GAME.dispose_projectiles();
		
		
		// render things
		GAME.clear();
		GAME.render();
		
		requestAnimationFrame(GAME.animate);
	},
}

GAME.init();