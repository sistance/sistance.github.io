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
	BOSS_ARMOR_MODELS: null,
	BOSS_CORE_MODELS: null,
	
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
				sx: 0,
				sy: -0.66,
				r: 228,
				g: 75,
				b: 164,
				delta_r: -3,
				delta_g: -1,
				delta_b: -2
			},
			{ // player bombs
				w: 1,
				h: 1,
				sx: 0,
				sy: -0.2,
				r: 0,
				g: 255,
				b: 0,
				delta_r: 2,
				delta_g: -2,
				delta_b: 2
			},
			{ // boss shots
				w: 1,
				h: 1,
				sx: 0,
				sy: 0.2,
				r: 242,
				g: 135,
				b: 64,
				delta_r: 4,
				delta_g: 2,
				delta_b: 1
			}
		];
		
		// MOBILE MODELS
		this.MOBILE_MODELS = [
			{
				name: 'SIMPLE_SHIP_1',
				w: 1,
				h: 1,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 0,
				r: 33,
				g: 163,
				b: 85,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0
			},
			{
				name: 'SIMPLE_SHIP_2',
				w: 1,
				h: 1,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 0,
				r: 223,
				g: 167,
				b: 49,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0
			},
			{
				name: 'BOSS_SHIP_1',
				w: 3,
				h: 3,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 0,
				r: 227,
				g: 55,
				b: 99,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0
			},
			{
				name: 'BOSS_SHIP_2',
				w: 3,
				h: 3,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 0,
				r: 227,
				g: 55,
				b: 99,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0
			},
			{
				name: 'BOSS_SHIP_3',
				w: 3,
				h: 3,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 0,
				r: 227,
				g: 55,
				b: 99,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0
			}
		];
		
		
		// ARMOR MODELS
		this.BOSS_ARMOR_MODELS = [
			{
				name: 'BOSS_SHIP_ARMOR_1',
				segments: 3,
				durability: 3,
				locations: [{x:0,y:1},{x:1,y:2},{x:2,y:1}],
				r: 156,
				g: 132,
				b: 75
			},
			{
				name: 'BOSS_SHIP_ARMOR_2',
				segments: 2,
				durability: 4,
				locations: [{x:0,y:2},{x:2,y:2}],
				r: 156,
				g: 132,
				b: 75
			},
			{
				name: 'BOSS_SHIP_ARMOR_3',
				segments: 5,
				durability: 6,
				locations: [{x:0,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:1},{x:2,y:2}],
				r: 156,
				g: 132,
				b: 75
			}
		];
		// CORE MODELS
		this.BOSS_CORE_MODELS = [
			{
				name: 'BOSS_SHIP_CORE_1',
				segments: 2,
				locations: [{x:1,y:0},{x:1,y:1}],
				r: 214,
				g: 222,
				b: 54
			},
			{
				name: 'BOSS_SHIP_CORE_2',
				segments: 2,		
				locations: [{x:0,y:0},{x:2,y:0}],
				r: 214,
				g: 222,
				b: 54
			},
			{
				name: 'BOSS_SHIP_CORE_3',
				segments: 2,
				locations: [{x:1,y:0},{x:1,y:1}],
				r: 214,
				g: 222,
				b: 54
			}
		];
		
		
		// ANIMATED THINGS
		// set up player
		this.PLAYER = {
			x: 0.0,
			y: 13.0,
			sx: 0.0,
			sy: 0.0,
			ax: 0.0,
			ay: 0.0,
			fire1: 0, // projectile ID
			fire2: 1, // projectile ID
			f1_timer: 0,
			f2_timer: 0,
			color: {r:96,g:44,b:126},
			accel: 0.07, // pixels/tick
			lives: 3,
			f1_cooldown: 200,
			f2_cooldown: 1500
		};
		
		this.MOBILES = [
			{ // test enemy ship
				type: 0,
				x: 0,
				y: 0,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0
			},
			{ // test enemy ship
				type: 1,
				x: 7,
				y: 0,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0
			},
			{ // test enemy ship
				type: 2,
				x: 0,
				y: 2,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0
			},
			{ // test enemy ship
				type: 3,
				x: 5,
				y: 2,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0
			},
			{ // test enemy ship
				type: 4,
				x: 2,
				y: 6,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0
			},
		];
		
		
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
			sx: this.PROJECTILE_MODELS[0].sx,
			sy: this.PROJECTILE_MODELS[0].sy,
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
	render_mobiles: function() {
		for(mob of GAME.MOBILES) {
			GAME.render_mobile(mob);
		}
	},
	render_mobile: function(mob) {
		// 
		switch(mob.type) {
			case 0: // simple ship #1
			case 1: // simple ship #2
				// ship - ratcheting position!
				var x = Math.floor(mob.x);
				var y = Math.floor(mob.y);
				var w = GAME.MOBILE_MODELS[mob.type].w;
				var h = GAME.MOBILE_MODELS[mob.type].h;
				
				// mob color - fading between pixels
				var r1 = GAME.MOBILE_MODELS[mob.type].r;
				var g1 = GAME.MOBILE_MODELS[mob.type].g;
				var b1 = GAME.MOBILE_MODELS[mob.type].b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*w,GAME.PIXEL_SIZE*h);	
				break;
			case 2: // boss ship #1
				// ship - ratcheting position!
				var x = Math.floor(mob.x);
				var y = Math.floor(mob.y);
				var w = GAME.MOBILE_MODELS[mob.type].w;
				var h = GAME.MOBILE_MODELS[mob.type].h;
				
				// mob color - fading between pixels
				var r1 = GAME.MOBILE_MODELS[mob.type].r;
				var g1 = GAME.MOBILE_MODELS[mob.type].g;
				var b1 = GAME.MOBILE_MODELS[mob.type].b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,(y+1)*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*w,GAME.PIXEL_SIZE);	
				GAME.CONTEXT.fillRect((x+1)*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*h);
				
				// render boss armor!
				this.render_armor(mob);
				break;
			case 3: // boss ship #2
				// ship - ratcheting position!
				var x = Math.floor(mob.x);
				var y = Math.floor(mob.y);
				var w = GAME.MOBILE_MODELS[mob.type].w;
				var h = GAME.MOBILE_MODELS[mob.type].h;
				
				// mob color - fading between pixels
				var r1 = GAME.MOBILE_MODELS[mob.type].r;
				var g1 = GAME.MOBILE_MODELS[mob.type].g;
				var b1 = GAME.MOBILE_MODELS[mob.type].b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*h);	
				GAME.CONTEXT.fillRect((x+2)*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*h);
				
				// render boss armor!
				this.render_armor(mob);
				break;
			case 4: // boss ship #3
				// ship - ratcheting position!
				var x = Math.floor(mob.x);
				var y = Math.floor(mob.y);
				var w = GAME.MOBILE_MODELS[mob.type].w;
				var h = GAME.MOBILE_MODELS[mob.type].h;
				
				// mob color - fading between pixels
				var r1 = GAME.MOBILE_MODELS[mob.type].r;
				var g1 = GAME.MOBILE_MODELS[mob.type].g;
				var b1 = GAME.MOBILE_MODELS[mob.type].b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE*w,GAME.PIXEL_SIZE*h);	
				
				// render boss armor!
				this.render_armor(mob);
				break;
		}
	},
	render_armor: function(mob) {
		
	},
	render_projectiles: function() {
		for(proj of GAME.PROJECTILES) {
			GAME.render_projectile(proj);
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
				GAME.render_mobiles();
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
			GAME.PLAYER.ax = GAME.CONTROL_HANDLER[0]*GAME.PLAYER.accel;
		} else {
			GAME.PLAYER.ax = 0;
		}
		
		// add acceleration
		if(GAME.PLAYER.ax != 0) {
			GAME.PLAYER.sx += GAME.PLAYER.ax;
		} else {
			GAME.PLAYER.sx /= 2;
		}
		
		// move
		GAME.PLAYER.x += GAME.PLAYER.sx;
		if(GAME.PLAYER.x < 0) {
			GAME.PLAYER.x = 0;
			GAME.PLAYER.sx = 0;
		}
		if(GAME.PLAYER.x > 7) {
			GAME.PLAYER.x = 7;
			GAME.PLAYER.sx = 0;
		}
	},
	move_mobiles: function() {
		if(GAME.MOBILES.length > 0) {
			for(mob of GAME.MOBILES) {
				GAME.move_mobile(mob);
			}
		}
	},
	move_mobile: function(mob) {
		mob.sx = GAME.MOBILE_MODELS[mob.type].sx;
		mob.sy = GAME.MOBILE_MODELS[mob.type].sy;
		
		mob.x += mob.sx;
		mob.y += mob.sy;
		
		mob.time += GAME.ELAPSED;
	},
	move_projectiles: function() {
		if(GAME.PROJECTILES.length > 0) {
			for(proj of GAME.PROJECTILES) {
				GAME.move_projectile(proj);
			}
		}
	},
	move_projectile: function(proj) {
		proj.sx = GAME.PROJECTILE_MODELS[proj.type].sx;
		proj.sy = GAME.PROJECTILE_MODELS[proj.type].sy;
		
		proj.x += proj.sx;
		proj.y += proj.sy;
		
		proj.time += GAME.ELAPSED;
	},
	
	dispose_projectiles: function() {
		if(GAME.PROJECTILES.length > 0) {
			for(var lp=(GAME.PROJECTILES.length-1);lp>=0;lp--) {
				if(GAME.PROJECTILES[lp].y < 0 || GAME.PROJECTILES[lp].y > 15 || GAME.PROJECTILES[lp].x < 0 || GAME.PROJECTILES[lp].x > 7) {
					GAME.PROJECTILES.splice(lp,1);
				}
			}
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