var GAME = {
	CLOCK: 0,
	ELAPSED: 0,
	LAST_TICK: 0,

	CANVAS: null,
	CONTEXT: null,
	GAME_ON: true,
	GAME_STATE: 0,// 0=title,demo,game intro,stage intro,stage,waiting to respawn,game end lose,game end win,game off

	STAGE_COUNTER: 0, // which stage!
	STAGE_SECTION_COUNTER: 0, // which section of stage!
	STAGE_TICK: 0, // next tick time

	PAUSED: false,
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
	
	// particles
	// x,y,sx,sy,r,g,b,d_r,d_g,d_b,life
	PARTICLES: null,
	
	
	//-------- MODELS ------------//
	// title model
	TITLE_MODELS: null,
	
	// mobile models
	MOBILE_MODELS: null,
	
	// enemy grid models
	GRID_MODELS: null,
	
	// stage models
	STAGE_MODELS: null,
	WAVE_MODELS: null,
	
	// boss models
	BOSS_MODELS: null,
	ARMOR_MODELS: null,
	BOSS_CORE_MODELS: null,
	
	// projectile models
	PROJECTILE_MODELS: null,
	EXPLOSION_MODELS: null,
	
	
	
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
		this.CLOCK = 0;
		this.LAST_TICK = this.CLOCK;
		this.ELAPSED = 0;
		

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
				sy: -30, // 30px/s
				r: 228,
				g: 75,
				b: 164,
				delta_r: 228,
				delta_g: 0,
				delta_b: 0,
				damage: 1
			},
			{ // player bombs
				w: 1,
				h: 1,
				sx: 0,
				sy: -10, // 10px/s
				r: 0,
				g: 255,
				b: 0,
				delta_r: 255,
				delta_g: 0,
				delta_b: 0,
				damage: 4
			},
			{ // boss shots
				w: 1,
				h: 1,
				sx: 0,
				sy: 0.2,
				r: 242,
				g: 135,
				b: 64,
				delta_r: 200,
				delta_g: 200,
				delta_b: 64,
				damage: 1
			}
		];
		
		this.EXPLOSION_MODELS = [
			{
				name: 'SMALL_EXPLOSION',
				particles: [
					{ ex: -1, ey: 0,  sx: -20, sy: 0,   r: 140, g: 140, b: 255, delta_r:   0, delta_g:   0, delta_b:  40, life:  30 }, // left
					{ ex: 1,  ey: 0,  sx: 20,  sy: 0,   r: 140, g: 140, b: 255, delta_r:   0, delta_g:   0, delta_b:  40, life:  30 }, // right
					{ ex: 0,  ey: -1, sx: 0,   sy: -20, r: 140, g: 140, b: 255, delta_r:   0, delta_g:   0, delta_b:  40, life:  30 }, // up
					{ ex: 0,  ey: 1,  sx: 0,   sy: 20,  r: 140, g: 140, b: 255, delta_r:   0, delta_g:   0, delta_b:  40, life:  30 }  // down
				]
			},
			{
				name: 'BIG_EXPLOSION',
				particles: [
					{ ex: -1, ey: 0,  sx: -20, sy: 0,   r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // left
					{ ex: 1,  ey: 0,  sx: 20,  sy: 0,   r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // right
					{ ex: 0,  ey: -1, sx: 0,   sy: -20, r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // up
					{ ex: 0,  ey: 1,  sx: 0,   sy: 20,  r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // down
					{ ex: -1, ey: -1, sx: -10, sy: -10, r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // ul
					{ ex: 1,  ey: -1, sx: 10,  sy: -10, r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // ur
					{ ex: -1, ey: 1,  sx: -10, sy: 10,  r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }, // dl
					{ ex: 1,  ey: 1,  sx: 10,  sy: 10,  r: 100, g: 100, b: 255, delta_r:   0, delta_g:   0, delta_b:  60, life: 200 }  // dr
				]
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
				sy: 5,
				r: 33,
				g: 163,
				b: 85,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0,
				armor_id: -1,
				boss_model_id: -1,
				hull_life: 1
			},
			{
				name: 'SIMPLE_SHIP_2',
				w: 1,
				h: 1,
				ax: 0,
				ay: 0,
				sx: 0,
				sy: 4,
				r: 223,
				g: 167,
				b: 49,
				delta_r: 0,
				delta_g: 0,
				delta_b: 0,
				armor_id: 0,
				boss_model_id: -1,
				hull_life: 2
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
				boss_model_id: 0,
				hull_life: -1
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
				boss_model_id: 1,
				hull_life: -1

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
				boss_model_id: 2,
				hull_life: -1

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
		
		this.WAVE_MODELS = [
			{ // 0: simple #1
				types: [0,0,0,0],
				locations: [{x:1,y:1},{x:2,y:4},{x:4,y:3},{x:6,y:5}]
			},
			{ // 1: simple #2
				types: [0,0,0,0],
				locations: [{x:1,y:1},{x:2,y:3},{x:3,y:5},{x:4,y:2}]
			},
			{ // 2: simple #3
				types: [0,0,0,0],
				locations: [{x:3,y:1},{x:3,y:5},{x:5,y:3},{x:5,y:6}]
			},
			{ // 3: simple #4
				types: [0,0,0,0],
				locations: [{x:1,y:1},{x:3,y:5},{x:4,y:3},{x:6,y:1}]
			},
			{ // 4: invasion #1
				types: [0,0,0,0,0,0,1,1,1,1,1,1],
				locations: [{x:1,y:1},{x:5,y:1},{x:4,y:3},{x:3,y:5},{x:2,y:7},{x:6,y:7},{x:3,y:1},{x:2,y:3},{x:6,y:3},{x:1,y:5},{x:5,y:5},{x:4,y:7}]
			},
			{ // 5: invasion #2
				types: [0,0,0,0,0,0,1,1,1,1,1,1],
				locations: [{x:4,y:1},{x:3,y:3},{x:6,y:3},{x:1,y:5},{x:4,y:5},{x:3,y:7},{x:1,y:1},{x:6,y:1},{x:1,y:3},{x:6,y:5},{x:1,y:7},{x:6,y:7}]
			},
			{ // 6: boss #1
				types: [2],
				locations: [{x:2,y:1}]
			},
			{ // 7: boss #2
				types: [3],
				locations: [{x:2,y:1}]
			},
			{ // 8: boss #3
				types: [4],
				locations: [{x:2,y:1}]
			},
		];
		this.STAGE_MODELS = [
			{
				name: 'STAGE 1',
				intro_length: 2000,
				waves: [0,1,2,3,4,6]
			},
			{
				name: 'STAGE 2',
				intro_length: 2000,
				waves: [0,3,2,1,5,7]
			},
			{
				name: 'STAGE 3',
				intro_length: 2000,
				waves: [3,2,1,0,5,6]
			},
			{
				name: 'STAGE 4',
				intro_length: 2000,
				waves: [3,1,0,2,4,7]
			},
			{
				name: 'STAGE 5',
				intro_length: 2000,
				waves: [0,1,2,3,4,5,8]
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
			accel: 0.1, // pixels/s/ms
			lives: 0,
			f1_cooldown: 200,
			f2_cooldown: 1500,
			dead: 0
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
		this.PARTICLES = [];
		
		
		
		
		// set up handlers!
		this.init_controls();
		
		
		
		// start it all 
		this.start();
	},
	init_controls: function() {
		document.addEventListener('keydown',function(e){
			//console.log(e.keyCode);
			switch(e.keyCode) {
				case 37: // left
					if(GAME.GAME_STATE == 4) {
						GAME.CONTROL_HANDLER[0] = -1;
					}
					break;
				case 39: // right
					if(GAME.GAME_STATE == 4) {
						GAME.CONTROL_HANDLER[0] = 1;
					}
					break;
				case 32: // space = fire
					switch(GAME.GAME_STATE) {
						// start game on these states
						case 0:
						case 1:
							GAME.start_game();
							break;
						// fire on these states
						case 4:
							GAME.CONTROL_HANDLER[2] = 1;
							break;
						// ignore on the rest
						default:
							break;
					}
					break;
				case 38: // up = bomb
					if(GAME.GAME_STATE == 4) {
						GAME.CONTROL_HANDLER[3] = 1;
					}
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
		GAME.GAME_STATE = 0;
		GAME.STAGE_TICK = GAME.CLOCK + 10000;
		
		requestAnimationFrame(this.animate);
	},
	start_game: function() {
		console.log('start game');
		// clear queues
		// do this later after testing!
		
		// reset default game starting values
		this.PLAYER.lives = 3;
		this.STAGE_COUNTER = 0;
		
		// start game intro movie
		this.GAME_STATE = 2;
		this.STAGE_TICK = this.CLOCK + 5000;
	},
	start_stage: function() {
		console.log('start stage '+this.STAGE_COUNTER);
		// reset stage section counter and first spawn timer to 3s from the start of the level!
		this.MOBILES = [];
		this.STAGE_SECTION_COUNTER = -1;
		this.GAME_STATE = 3;
		this.STAGE_TICK = this.CLOCK + this.STAGE_MODELS[this.STAGE_COUNTER].intro_length;
	},

	clear: function() {
		GAME.CONTEXT.clearRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
	},
	render_title: function() {
		GAME.CONTEXT.fillStyle = '#808000';
		GAME.CONTEXT.fillRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
	},
	render_intro: function() {
		GAME.CONTEXT.fillStyle = '#00ff00';
		GAME.CONTEXT.fillRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
	},
	render_game_over: function() {
		// later
	},
	render_game_win: function() {
		// later
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
	create_explosion: function(ex,ey,explosion_model_id) {
		var EXP_MODEL = this.EXPLOSION_MODELS[explosion_model_id];
		for(var lp=0;lp<EXP_MODEL.particles.length;lp++) {
			// create a particle
			var part = {
				x: ex + EXP_MODEL.particles[lp].ex,
				y: ey + EXP_MODEL.particles[lp].ey,
				sx: EXP_MODEL.particles[lp].sx,
				sy: EXP_MODEL.particles[lp].sy,
				r: EXP_MODEL.particles[lp].r,
				g: EXP_MODEL.particles[lp].g,
				b: EXP_MODEL.particles[lp].b,
				delta_r: EXP_MODEL.particles[lp].delta_r,
				delta_g: EXP_MODEL.particles[lp].delta_g,
				delta_b: EXP_MODEL.particles[lp].delta_b,
				life: EXP_MODEL.particles[lp].life,
				time: 0
			};
			
			this.PARTICLES.push(part);
			console.log(part);
		}
	},
	create_mobile: function(mx,my,mobile_model_id) {
		var MOBILE_MODEL = this.MOBILE_MODELS[mobile_model_id];
		
		if(MOBILE_MODEL.armor_id > -1) {
			var ARMOR_MODEL = this.ARMOR_MODELS[MOBILE_MODEL.armor_id];
			var armor_life = [];
			for(var lp=0;lp<ARMOR_MODEL.locations.length;lp++) {
				armor_life[armor_life.length] = ARMOR_MODEL.durability;
			}
		} else {
			var armor_life = [0];
		}
		
		if(MOBILE_MODEL.boss_model_id > -1) {
			var BOSS_SECTION_MODEL = this.BOSS_SECTION_MODELS[MOBILE_MODEL.boss_model_id];
			var BOSS_CORE_MODEL = this.BOSS_CORE_MODELS[MOBILE_MODEL.boss_model_id];
			var hull_life = [];
			var core_life = [];
			for(var lp=0;lp<BOSS_SECTION_MODEL.locations.length;lp++) {
				hull_life[hull_life.length] = BOSS_SECTION_MODEL.durability;
			}
			for(var lp=0;lp<BOSS_CORE_MODEL.locations.length;lp++) {
				core_life[core_life.length] = BOSS_CORE_MODEL.durability;
			}
		} else {
			var hull_life = [MOBILE_MODEL.hull_life];
			var core_life = [0];
		}
		
		var mob = {
			type: mobile_model_id,
			x: mx,
			y: my,
			sx: MOBILE_MODEL.sx,
			sy: MOBILE_MODEL.sy,
			ax: 0,
			ay: 0,
			time: 0,
			hull_life: hull_life,
			armor_life: armor_life,
			core_life: core_life,
			dead: 0
			
		};
		
		this.MOBILES.push(mob);
		console.log(mob);
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
				var step = Math.cos((proj.time % 360)/180*Math.PI + Math.PI/2);
				base_r += step * (GAME.PROJECTILE_MODELS[proj.type].delta_r - base_r);
				if(base_r > 255) {base_r = 255;}
				if(base_r < 0) {base_r = 0;}
				base_g += step * (GAME.PROJECTILE_MODELS[proj.type].delta_g - base_g);
				if(base_g > 255) {base_g = 255;}
				if(base_g < 0) {base_g = 0;}
				base_b += step * (GAME.PROJECTILE_MODELS[proj.type].delta_b - base_b);
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
	render_particles: function() {
		for(part of GAME.PARTICLES) {
			GAME.render_particle(part);
		}
	},
	render_particle: function(part) {
		var x = Math.floor(part.x);
		var y = Math.floor(part.y);
		//var ox = (part.x%1);
		//var oy = (part.y%1);
		
		// grab base color
		var base_r = part.r;
		var base_g = part.g;
		var base_b = part.b;
		
		// animate color
		var step = part.time / part.life;
		base_r += step * (part.delta_r - base_r);
		if(base_r > 255) {base_r = 255;}
		if(base_r < 0) {base_r = 0;}
		base_g += step * (part.delta_g - base_g);
		if(base_g > 255) {base_g = 255;}
		if(base_g < 0) {base_g = 0;}
		base_b += step * (part.delta_b - base_b);
		if(base_b > 255) {base_b = 255;}
		if(base_b < 0) {base_b = 0;}
		var color0 = "#"+GAME.color_code(base_r)+GAME.color_code(base_g)+GAME.color_code(base_b);
		
		
		// render all of it
		GAME.CONTEXT.fillStyle = color0;
		GAME.CONTEXT.fillRect(x*GAME.PIXEL_SIZE,y*GAME.PIXEL_SIZE,GAME.PIXEL_SIZE,GAME.PIXEL_SIZE);	
	},
	
	
	
	
	render: function() {
		GAME.render_background();
		
		switch(GAME.GAME_STATE) {
			case 0: // title
				GAME.render_title();
				break;
			case 2: // game intro
				GAME.render_intro();
				break;
			case 1: // demo
			case 3: // stage intro
			case 4: // stage 
				GAME.render_player();
				GAME.render_projectiles();
				GAME.render_mobiles();
				GAME.render_particles();
				break;
			case 5: // waiting to respawn
				GAME.render_projectiles();
				GAME.render_mobiles();
				GAME.render_particles();
				break;
			case 6: // game end lose
				GAME.render_game_over();
				break;
			case 7: // game end win
				GAME.render_game_win();
			case 8: // game off
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
			GAME.PLAYER.sx += GAME.PLAYER.ax * GAME.ELAPSED / 1000;
		} else {
			GAME.PLAYER.sx /= 2;
		}
		
		// move
		GAME.PLAYER.x += GAME.PLAYER.sx * GAME.ELAPSED;
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
		
		mob.x += mob.sx * GAME.ELAPSED / 1000;
		mob.y += mob.sy * GAME.ELAPSED / 1000;
		
		mob.time += GAME.ELAPSED;
		
		if(mob.x < 0 || mob.x > 7 || mob.y < 0 || mob.y > 15) {
			mob.dead = 1;
		}
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
		
		proj.x += proj.sx * GAME.ELAPSED / 1000;
		proj.y += proj.sy * GAME.ELAPSED / 1000;
		
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
	
	
	move_particles: function() {
		if(GAME.PARTICLES.length > 0) {
			for(part of GAME.PARTICLES) {
				GAME.move_particle(part);
			}
		}
	},
	move_particle: function(part) {
		part.x += part.sx * GAME.ELAPSED / 1000;
		part.y += part.sy * GAME.ELAPSED / 1000;
		
		part.time += GAME.ELAPSED;
		
		if(part.time > part.life) {
			part.dead = 1; // kill it if it outlives its intent
		}
	},
	dispose_particles: function() {
		if(GAME.PARTICLES.length > 0) {
			for(var lp=(GAME.PARTICLES.length-1);lp>=0;lp--) {
				if(GAME.PARTICLES[lp].y < 0 || GAME.PARTICLES[lp].y > 15 || GAME.PARTICLES[lp].x < 0 || GAME.PARTICLES[lp].x > 7 || GAME.PARTICLES[lp].dead == 1) {
					GAME.PARTICLES.splice(lp,1);
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
		
		// mobiles
		if(this.GAME_STATE == 4 && this.MOBILES.length > 0) {
			//console.log(this.MOBILES);
			for(var lm=0;lm<this.MOBILES.length;lm++) {
				if(this.collide_player_mobile(lm)) {
					console.log('enemy '+lm+' hit player.');
				}
			}
		}
		
	},
	collide_proj_player: function(proj_id) {
		var TPROJ = this.PROJECTILES[proj_id];
		var PROJ_MODEL = this.PROJECTILE_MODELS[TPROJ.type];
		TPROJ.x1 = Math.floor(TPROJ.x);
		TPROJ.y1 = Math.floor(TPROJ.y);
		TPROJ.x2 = TPROJ.x1 + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y1 + (PROJ_MODEL.h - 1);
		
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
		TPROJ.x2 = TPROJ.x1 + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y1 + (PROJ_MODEL.h - 1);
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
		TPROJ.x2 = TPROJ.x1 + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y1 + (PROJ_MODEL.h - 1);
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id < 0) {
			// no cores - do nothing
		} else {
			// check against boss pieces!
			var BOSS_CORE_MODEL = this.BOSS_CORE_MODELS[MOB_MODEL.boss_model_id];
			
			for(lp=0;lp<BOSS_CORE_MODEL.locations.length;lp++) {
				var bsx = Math.floor(TMOB.x) + BOSS_CORE_MODEL.locations[lp].x;
				var bsy = Math.floor(TMOB.y) + BOSS_CORE_MODEL.locations[lp].y;

				if(bsx >= TPROJ.x1 && bsx <= TPROJ.x2 && bsy >= TPROJ.y1 && bsy <= TPROJ.y2) {
					if(this.MOBILES[mob_id].core_life[lp] > 0) {
						// damage
						this.MOBILES[mob_id].core_life[lp] -= PROJ_MODEL.damage;
						if(this.MOBILES[mob_id].core_life[lp] < 0) {
							this.MOBILES[mob_id].core_life[lp] = 0;
						}
						
						collided = true;
						
						// check boss life!
						var rem_life = 0;
						for(var life of this.MOBILES[mob_id].core_life) {
							rem_life += life;
						}
						if(rem_life < 1) { // BOSS IS DEAD
							this.MOBILES[mob_id].dead = 1;
							console.log('boss '+MOB_MODEL.name+' is dead.');
							this.create_explosion(TPROJ.x1,TPROJ.y1,1); // big explosion
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
	collide_player_mobile: function(mob_id) {
		var TPLAYER = this.PLAYER;
		if(TPLAYER.dead == 1) {
			return false;
		}
		TPLAYER.x1 = Math.floor(TPLAYER.x);
		TPLAYER.y1 = Math.floor(TPLAYER.y);
		TPLAYER.x2 = TPLAYER.x1;
		TPLAYER.y2 = TPLAYER.y1 + 1;
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id > -1) {
			// it's a boss - do nothing
		} else {
			// check against simple ship hull
			TMOB.x1 = Math.floor(TMOB.x);
			TMOB.y1 = Math.floor(TMOB.y);
			TMOB.x2 = TMOB.x1 + (MOB_MODEL.w - 1);
			TMOB.y2 = TMOB.y1 + (MOB_MODEL.h - 1);
			
			if(TMOB.x2 < TPLAYER.x1 || TMOB.x1 > TPLAYER.x2 || TMOB.y2 < TPLAYER.y1 || TMOB.y1 > TPLAYER.y2) {
				collided = false;
			} else {
				// damage to mobile
				this.MOBILES[mob_id].hull_life[0] -= 5;
				
				if(this.MOBILES[mob_id].hull_life[0] < 1) {
					this.MOBILES[mob_id].dead = 1;
					console.log('enemy #'+mob_id+' dead.');
					this.create_explosion(Math.floor((TMOB.x1+TMOB.x2)/2),Math.floor((TMOB.y1+TMOB.y2)/2),0);
				}
				
				// damage to player
				this.PLAYER.dead = 1;
				this.PLAYER.lives -= 1;
				this.create_explosion(TPLAYER.x1,TPLAYER.y1,1);
				console.log('player dead');
				
				if(this.PLAYER.lives < 0) {
					// game is over!
					console.log('player out of lives');
					this.GAME_STATE = 6; // game over!
				} else {
					this.GAME_STATE = 5; // waiting to respawn!
					this.PLAYER.RESPAWN_TIME = this.CLOCK + 1000;
				}
				
				
				collided = true;
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
		TPROJ.x2 = TPROJ.x1 + (PROJ_MODEL.w - 1);
		TPROJ.y2 = TPROJ.y1 + (PROJ_MODEL.h); // make projectiles taller for collision?
		
		var TMOB = this.MOBILES[mob_id];
		var MOB_MODEL = this.MOBILE_MODELS[TMOB.type];
		
		var collided = false;
		
		if(MOB_MODEL.boss_model_id > -1) {
			// it's a boss - do nothing
		} else {
			// check against simple ship hull
			TMOB.x1 = Math.floor(TMOB.x);
			TMOB.y1 = Math.floor(TMOB.y);
			TMOB.x2 = TMOB.x1 + (MOB_MODEL.w - 1);
			TMOB.y2 = TMOB.y1 + (MOB_MODEL.h - 1);
			
			if(TMOB.x2 < TPROJ.x1 || TMOB.x1 > TPROJ.x2 || TMOB.y2 < TPROJ.y1 || TMOB.y1 > TPROJ.y2) {
				collided = false;
			} else {
				this.MOBILES[mob_id].hull_life[0] -= PROJ_MODEL.damage;
				
				if(this.MOBILES[mob_id].hull_life[0] < 1) {
					this.MOBILES[mob_id].dead = 1;
					console.log('enemy '+MOB_MODEL.name+' dead.');
					this.create_explosion(TPROJ.x1,TPROJ.y1,0);
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
		
		// title screen done! roll demo!
		if(GAME.GAME_STATE == 0 && GAME.CLOCK > GAME.STAGE_TICK) {
			console.log('start demo');
			GAME.GAME_STATE = 1;
			GAME.STAGE_TICK = GAME.CLOCK + 6000;
		}
		
		// demo done! return to title screen!
		if(GAME.GAME_STATE == 1 && GAME.CLOCK > GAME.STAGE_TICK) {
			console.log('back to title');
			GAME.GAME_STATE = 0;
			GAME.STAGE_TICK = GAME.CLOCK + 12000;
		}
		
		// game intro done! start stage intro!
		if(GAME.GAME_STATE == 2 && GAME.CLOCK > GAME.STAGE_TICK) {
			console.log('start stage intro');
			GAME.start_stage();
		}
		
		// stage intro done! start action!
		if(GAME.GAME_STATE == 3 && GAME.CLOCK > GAME.STAGE_TICK) {
			console.log('start action');
			GAME.GAME_STATE = 4;
			GAME.STAGE_TICK = GAME.CLOCK + 1;
		}
		
		// respawn timer done! respawn!
		if(GAME.GAME_STATE == 5 && GAME.CLOCK > GAME.STAGE_TICK) {
			console.log('respawn!');
			GAME.GAME_STATE = 4;
			GAME.STAGE_TICK = GAME.CLOCK + 2000;
			GAME.PLAYER.dead = 0;
		}
		
		// game over screen done! return to title!
		if((GAME.GAME_STATE == 6 || GAME.GAME_STATE ==  7) && GAME.CLOCK > GAME.STAGE_TICK) {
			GAME.GAME_STATE = 0;
			GAME.STAGE_TICK = GAME.CLOCK + 3000;
		}
		
		// stage tick during game!
		if(GAME.GAME_STATE == 4 && GAME.CLOCK > GAME.STAGE_TICK) {
			// stage tick!
			console.log('stage tick');
			GAME.STAGE_TICK = GAME.CLOCK + 2000;
			
			
			
			// add next stage of minions?
			if(GAME.MOBILES.length < 1) {
				GAME.STAGE_SECTION_COUNTER++;
				console.log('next section: '+GAME.STAGE_SECTION_COUNTER);
				
				if(GAME.STAGE_SECTION_COUNTER >= GAME.STAGE_MODELS[GAME.STAGE_COUNTER].waves.length) {
					// reset section counter
					GAME.STAGE_SECTION_COUNTER = 0;
					
					// new stage
					GAME.STAGE_COUNTER++;
					console.log('next stage: '+GAME.STAGE_COUNTER);
					
					if(GAME.STAGE_COUNTER >= GAME.STAGE_MODELS.length) {
						// end of game, you win!
						GAME.GAME_STATE = 7;
						GAME.STAGE_TICK = GAME.CLOCK + 15000;
						console.log('YOU WIN!');
					} else {
						GAME.start_stage();
					}
				} else {
					// spawn stuff!
					console.log('spawn stuff');
					
					var STAGE_MODEL = GAME.STAGE_MODELS[GAME.STAGE_COUNTER];
					var WAVE_MODEL = GAME.WAVE_MODELS[STAGE_MODEL.waves[GAME.STAGE_SECTION_COUNTER]];
					
					for(var lp=0;lp<WAVE_MODEL.types.length;lp++) {
						GAME.create_mobile(WAVE_MODEL.locations[lp].x,WAVE_MODEL.locations[lp].y,WAVE_MODEL.types[lp]);
					}
				}
			}
		}
		
		
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
		GAME.move_particles();
		
		
		// collisions
		GAME.collisions();
		
		
		// dispose of things
		GAME.dispose_projectiles();
		GAME.dispose_mobiles();
		GAME.dispose_particles();
		
		
		// render things
		GAME.clear();
		GAME.render();
		
		
		// more animation frames!
		requestAnimationFrame(GAME.animate);
	},
}

GAME.init();