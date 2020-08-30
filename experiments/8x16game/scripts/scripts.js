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
	ARMOR_MODELS: null,
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
				delta_b: -2,
				damage: 1
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
				delta_b: 2,
				damage: 3
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
				delta_b: 1,
				damage: 1
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
				delta_b: 0,
				armor_id: -1,
				boss_model_id: -1

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
				delta_b: 0,
				armor_id: 0,
				boss_model_id: -1

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
				delta_b: 0,
				armor_id: 1,
				boss_model_id: 0
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
				delta_b: 0,
				armor_id: 2,
				boss_model_id: 1

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
				delta_b: 0,
				armor_id: 3,
				boss_model_id: 2

			}
		];
		
		
		// ARMOR MODELS
		this.ARMOR_MODELS = [
			{
				name: 'SIMPLE_SHIP_2_ARMOR',
				segments: 1,
				durability: 2,
				locations: [{x:0,y:0}],
				r: 156,
				g: 132,
				b: 75
			},
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
				durability: 4,
				locations: [{x:0,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:1},{x:2,y:2}],
				r: 156,
				g: 132,
				b: 75
			}
		];

		// BOSS CORE MODELS
		this.BOSS_CORE_MODELS = [
			{
				name: 'BOSS_SHIP_CORE_1',
				segments: 2,
				durability: 5,
				locations: [{x:1,y:0},{x:1,y:1}],
				r: 214,
				g: 222,
				b: 54
			},
			{
				name: 'BOSS_SHIP_CORE_2',
				segments: 2,		
				durability: 5,
				locations: [{x:0,y:0},{x:2,y:0}],
				r: 214,
				g: 222,
				b: 54
			},
			{
				name: 'BOSS_SHIP_CORE_3',
				segments: 2,
				durability: 5,
				locations: [{x:1,y:0},{x:1,y:1}],
				r: 214,
				g: 222,
				b: 54
			}
		];
		// BOSS SECTION MODELS
		this.BOSS_SECTION_MODELS = [
			{
				name: 'BOSS_SHIP_SECTIONS_1',
				segments: 5,
				durability: 2,
				locations: [{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:1,y:2}]
			},
			{
				name: 'BOSS_SHIP_SECTIONS_2',
				segments: 6,
				durability: 2,
				locations: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:2,y:0},{x:2,y:1},{x:2,y:2}]
			},
			{
				name: 'BOSS_SHIP_SECTIONS_3',
				segments: 9,
				durability: 2,
				locations: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:0},{x:2,y:1},{x:2,y:2}]
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
				time: 0,
				hull_life: [1],
				armor_life: [0],
				core_life: [0],
				dead: 0
			},
			{ // test enemy ship #2
				type: 1,
				x: 7,
				y: 0,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0,
				hull_life: [1],
				armor_life: [1],
				core_life: [0],
				dead: 0
			},
			{ // test boss #1
				type: 2,
				x: 0,
				y: 2,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0,
				hull_life: [2,2,2,2,2],
				armor_life: [3,3,3],
				core_life: [5,5],
				dead: 0
			},
			{ // test boss #2
				type: 3,
				x: 5,
				y: 2,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0,
				hull_life: [2,2,2,2,2,2],
				armor_life: [4,4],
				core_life: [5,5],
				dead: 0
			},
			{ // test boss #3
				type: 4,
				x: 2,
				y: 6,
				sx: 0,
				sy: 0,
				ax: 0,
				ay: 0,
				time: 0,
				hull_life: [2,2,2,2,2,2,2,2,2],
				armor_life: [4,4,4,4,4],
				core_life: [5,5],
				dead: 0
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
			//console.log(e.keyCode);
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
			time: 0,
			dead: 0
		};
		
		this.PROJECTILES.push(proj);
		//console.log(proj);
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
				
				if(mob.type == 1) {
					// render armor!
					this.render_armor(mob);
				}
				break;
			case 2: // boss ship #1
			case 3: // boss ship #2
			case 4: // boss ship #3
				// render boss sections!
				this.render_boss_sections(mob);
				// render boss cores!
				this.render_boss_cores(mob);
				// render armor!
				this.render_armor(mob);
				break;
		}
	},
	render_boss_sections: function(mob) {
		var MOB_TYPE = mob.type;
		var MOB_MODEL = GAME.MOBILE_MODELS[MOB_TYPE];
		var BOSS_SECTION_MODEL = GAME.BOSS_SECTION_MODELS[MOB_MODEL.boss_model_id];
		
		for(var lp=0;lp<BOSS_SECTION_MODEL.locations.length;lp++) {
			// check health of section
			if(mob.hull_life[lp]>0) { 
				// render this section
				var x = Math.floor(mob.x) + BOSS_SECTION_MODEL.locations[lp].x;
				var y = Math.floor(mob.y) + BOSS_SECTION_MODEL.locations[lp].y;
				
				// mob color - fading between pixels
				var r1 = GAME.MOBILE_MODELS[mob.type].r;
				var g1 = GAME.MOBILE_MODELS[mob.type].g;
				var b1 = GAME.MOBILE_MODELS[mob.type].b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
			}
			
		}
	},
	render_armor: function(mob) {
		var MOB_TYPE = mob.type;
		var MOB_MODEL = GAME.MOBILE_MODELS[MOB_TYPE];
		var ARMOR_MODEL = GAME.ARMOR_MODELS[MOB_MODEL.armor_id];
		
		for(var lp=0;lp<ARMOR_MODEL.locations.length;lp++) {
			// check health of section
			if(mob.armor_life[lp]>0) { 
				// render this section
				var x = Math.floor(mob.x) + ARMOR_MODEL.locations[lp].x;
				var y = Math.floor(mob.y) + ARMOR_MODEL.locations[lp].y;
				
				// mob color - fading between pixels
				var r1 = ARMOR_MODEL.r;
				var g1 = ARMOR_MODEL.g;
				var b1 = ARMOR_MODEL.b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
			}
			
		}
	},
	render_boss_cores: function(mob) {
		var MOB_TYPE = mob.type;
		var MOB_MODEL = GAME.MOBILE_MODELS[MOB_TYPE];
		var BOSS_CORE_MODEL = GAME.BOSS_CORE_MODELS[MOB_MODEL.boss_model_id];
		
		for(var lp=0;lp<BOSS_CORE_MODEL.locations.length;lp++) {
			// check health of section
			if(mob.core_life[lp]>0) { 
				// render this section
				var x = Math.floor(mob.x) + BOSS_CORE_MODEL.locations[lp].x;
				var y = Math.floor(mob.y) + BOSS_CORE_MODEL.locations[lp].y;
				
				// mob color - fading between pixels
				var r1 = BOSS_CORE_MODEL.r;
				var g1 = BOSS_CORE_MODEL.g;
				var b1 = BOSS_CORE_MODEL.b;
				var color1 = "#"+GAME.color_code(r1)+GAME.color_code(g1)+GAME.color_code(b1);
				
				// render all of it
				GAME.CONTEXT.fillStyle = color1;
				GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
			}
			
		}
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

	dispose_mobiles: function() {
		if(GAME.MOBILES.length > 0) {
			for(var lp=(GAME.MOBILES.length-1);lp>=0;lp--) {
				if(GAME.MOBILES[lp].dead == 1) {
					GAME.MOBILES.splice(lp,1);
				}
			}
		}
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
				if(GAME.PROJECTILES[lp].y < 0 || GAME.PROJECTILES[lp].y > 15 || GAME.PROJECTILES[lp].x < 0 || GAME.PROJECTILES[lp].x > 7 || GAME.PROJECTILES[lp].dead == 1) {
					GAME.PROJECTILES.splice(lp,1);
				}
			}
		}
	},
	
	
	// COLLISION
	collisions: function() {
		// projectiles
		for(var lp=0;lp<this.PROJECTILES.length;lp++) {
			// find owner
			var OWNER = this.PROJECTILES[lp].owner;
			var PROJ_MODEL = this.PROJECTILE_MODELS[this.PROJECTILES[lp].type];
			
			// collide against player?
			if(OWNER != this.PLAYER) {
				if(this.collide_proj_player(lp)) {
					// ENEMY PROJECTILE HIT PLAYER!
					console.log('enemy projectile '+lp+' hit player.');
				}
			}
			
			// collide against mobiles?
			if(OWNER == this.PLAYER) {
				for(var lm=0;lm<this.MOBILES.length;lm++) {
					if(this.collide_proj_armor(lp,lm)) {
						// PLAYER PROJECTILE HIT ARMOR!
						console.log('player projectile hit armor on enemy '+lm+'.');
						this.PROJECTILES[lp].dead = 1;
					}
					if(this.collide_proj_boss_core(lp,lm)) {
						// PLAYER PROJECTILE HIT ENEMY!
						console.log('player projectile hit a core on enemy '+lm+'.');
						this.PROJECTILES[lp].dead = 1;
					}
					if(this.collide_proj_boss_section(lp,lm)) {
						// PLAYER PROJECTILE HIT ENEMY!
						console.log('player projectile hit a section on enemy '+lm+'.');
						this.PROJECTILES[lp].dead = 1;
					}
					if(this.collide_proj_mobile(lp,lm)) {
						// PLAYER PROJECTILE HIT ENEMY!
						console.log('player projectile hit enemy '+lm+'.');
						this.PROJECTILES[lp].dead = 1;
					}
				}
			}
			
		}
	},
	collide_proj_player: function(proj_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y + (PROJ_MODEL.h - 1);
		
		var collided = true;
		if(this.PLAYER.x < TPROJ.x1 || this.PLAYER.x > TPROJ.x2 || this.PLAYER.y < TPROJ.y1 || this.PLAYER.y+1>TPROJ.y2) {
			collided = false;
		}
		
		return collided;
	},
	collide_proj_armor: function(proj_id,mob_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		if(TPROJ.dead == 1) {
			return false;
		}
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y + (PROJ_MODEL.h - 1);
		//console.log(TPROJ.x1+','+TPROJ.y1+' '+TPROJ.x2+','+TPROJ.y2);
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.armor_id < 0) {
			// no armor - do nothing
		} else {
			// has armor
			var ARMOR_MODEL = this.ARMOR_MODELS[MOB_MODEL.armor_id];
			
			for(lp=0;lp<ARMOR_MODEL.locations.length;lp++) {
				var arx = TMOB.x + ARMOR_MODEL.locations[lp].x;
				var ary = TMOB.y + ARMOR_MODEL.locations[lp].y;

				if(arx >= TPROJ.x1 && arx <= TPROJ.x2 && ary >= TPROJ.y1 && ary <= TPROJ.y2) {
					if(this.MOBILES[mob_id].armor_life[lp] > 0) {
						this.MOBILES[mob_id].armor_life[lp] -= PROJ_MODEL.damage;
						collided = true;
					}
				}
			}
		}
		
		return collided;
	},
	collide_proj_boss_core: function(proj_id,mob_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		if(TPROJ.dead == 1) {
			return false;
		}
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y + (PROJ_MODEL.h - 1);
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id < 0) {
			// no cores - do nothing
		} else {
			// check against boss pieces!
			var BOSS_CORE_MODEL = this.BOSS_CORE_MODELS[MOB_MODEL.boss_model_id];
			
			for(lp=0;lp<BOSS_CORE_MODEL.locations.length;lp++) {
				var bsx = TMOB.x + BOSS_CORE_MODEL.locations[lp].x;
				var bsy = TMOB.y + BOSS_CORE_MODEL.locations[lp].y;

				if(bsx >= TPROJ.x1 && bsx <= TPROJ.x2 && bsy >= TPROJ.y1 && bsy <= TPROJ.y2) {
					if(this.MOBILES[mob_id].core_life[lp] > 0) {
						this.MOBILES[mob_id].core_life[lp] -= PROJ_MODEL.damage;
						collided = true;
						
						// check boss life!
						var rem_life = 0;
						for(var life of this.MOBILES[mob_id].core_life) {
							rem_life += life;
						}
						console.log(rem_life);
						if(rem_life < 1) { // BOSS IS DEAD
							this.MOBILES[mob_id].dead = 1;
							console.log('boss '+MOB_MODEL.name+' dead.');
						}
					}
				}
			}
		}
		
		return collided;
	},
	collide_proj_boss_section: function(proj_id,mob_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		if(TPROJ.dead == 1) {
			return false;
		}
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y + (PROJ_MODEL.h - 1);
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id < 0) {
			// no armor
			collided = false;
		} else {
			// check against boss pieces!
			var BOSS_SECTION_MODEL = this.BOSS_SECTION_MODELS[MOB_MODEL.boss_model_id];
			
			for(lp=0;lp<BOSS_SECTION_MODEL.locations.length;lp++) {
				var bsx = TMOB.x + BOSS_SECTION_MODEL.locations[lp].x;
				var bsy = TMOB.y + BOSS_SECTION_MODEL.locations[lp].y;

				if(bsx >= TPROJ.x1 && bsx <= TPROJ.x2 && bsy >= TPROJ.y1 && bsy <= TPROJ.y2) {
					if(this.MOBILES[mob_id].hull_life[lp] > 0) {
						this.MOBILES[mob_id].hull_life[lp] -= PROJ_MODEL.damage;
						collided = true;
					}
				}
			}
		}
		
		return collided;
	},
	collide_proj_mobile: function(proj_id,mob_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		if(TPROJ.dead == 1) {
			return false;
		}
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y + (PROJ_MODEL.h - 1);
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id > -1) {
			// it's a boss - do nothing
		} else {
			// check against simple ship hull
			TMOB.x1 = TMOB.x;
			TMOB.y1 = TMOB.y;
			TMOB.x2 = TMOB.x + (MOB_MODEL.w - 1);
			TMOB.y2 = TMOB.y + (MOB_MODEL.h - 1);
			
			if(TMOB.x2 < TPROJ.x1 || TMOB.x1 > TPROJ.x2 || TMOB.y2 < TPROJ.y1 || TMOB.y1 > TPROJ.y2) {
				collided = false;
			} else {
				this.MOBILES[mob_id].hull_life[0] -= PROJ_MODEL.damage;
				
				if(this.MOBILES[mob_id].hull_life[0] < 1) {
					this.MOBILES[mob_id].dead = 1;
					console.log('enemy '+MOB_MODEL.name+' dead.');
				}
				collided = true;
			}
		}
		return collided;
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
		
		
		// collisions
		GAME.collisions();
		
		
		// dispose of things
		GAME.dispose_projectiles();
		GAME.dispose_mobiles();
		
		// render things
		GAME.clear();
		GAME.render();
		
		requestAnimationFrame(GAME.animate);
	},
}

GAME.init();