var GAME_WORLD = {
	game_state: -1, // -1: not started yet, 0: loading, 1:start intro, 2: menu_screen,
	last_tick: 0, // next animation tick time
	water_frame: 0, // 0-7 for water palette animation
	water_tick: 0, // next water animation tick

	// engine pieces ----------------------------------------------------------------
	canvas: null, // game canvas element
	gfx: null, // game canvas 2D context
	control_defs: null,
	controls: null,
	sprite_defs: null,
	tile_defs: null,
	map_defs: null,
	object_defs: null,
	npc_defs: null,
	fx_defs: null,

	// game objects -----------------------------------------------------------------
	player: null,
	objects: null,
	npcs: null,
	fx: null,
	scripts: null, // script GUID, tick time, pointer, actions // for default talk scripts, use NPC guid	
	
	// fetch sprite data --------------------
	get_sprite_data: function() {
		// set up controls' key codes!
		this.control_defs = {
			up: 'KeyW',
			down: 'KeyS',
			left: 'KeyA',
			right: 'KeyD',
			jump: 'Space',
			fire1: 'Digit1',
			fire2: 'Digit2',
			fire3: 'Digit3',
			run: '',
			float_on: 'F1',
			float_off: 'F2',
		};
		
		// set up sprite defs
		this.sprite_defs = {
			list: [
				{ // sprite 0
					name:'default_man_idle',
					// stance/facing/frames
					frames:[
						[ // stance 0 - idle
							[ // facing 0 - right
								[ // frame 0
									// left, top, right, bottom, origin_x, origin_y, c_left, c_top, c_right, c_bottom
									4,1,11,15,7,15,5,1,10,15,
								], // frame 0
								//{}, // frame 1
							], // facing 0 - right
							[ // facing 1 - left
								[ // frame 0
									// left, top, right, bottom, origin_x, origin_y, c_left, c_top, c_right, c_bottom
									21,1,28,15,24,15,22,1,27,15,
								], // frame 0
								//{}, // frame 1
							], // facing 1 - left
						], // stance 0 - idle
						[ // stance 1 - walking
							[ // facing - right
								[ // frame 0
									// left, top, right, bottom, origin_x, origin_y
									4,33,11,47,7,47,5,33,10,47,
								], // frame 0
								[ // frame 1
									// left, top, right, bottom, origin_x, origin_y
									22,33,25,47,23,47,21,33,26,47,
								], // frame 1
								[ // frame 2
									// left, top, right, bottom, origin_x, origin_y
									36,33,43,47,39,47,37,33,42,47,
								], // frame 2
								[ // frame 3
									// left, top, right, bottom, origin_x, origin_y
									54,33,57,47,55,47,53,33,58,47,
								], // frame 3
							], // facing - right
							[ // facing - left
								[ // frame 0
									// left, top, right, bottom, origin_x, origin_y
									116,33,123,47,119,47,117,33,122,47,
								], // frame 0
								[ // frame 1
									// left, top, right, bottom, origin_x, origin_y
									102,33,105,47,103,47,101,33,106,47,
								], // frame 1
								[ // frame 2
									// left, top, right, bottom, origin_x, origin_y
									84,33,91,47,87,47,85,33,90,47,
								], // frame 2
								[ // frame 3
									// left, top, right, bottom, origin_x, origin_y
									70,33,73,47,71,47,69,33,74,47,
								], // frame 3
							], // facing - left
						], // stance 1 - walking
					],
				
				},
				
				// object sprites?
				{	// sprite 1
					name: 'gold_key',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									72,109,79,111,75,111,72,109,79,111
								]
							]
						]
					],
				},
				{	// sprite 2
					name: 'silver_key',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									80,109,87,111,83,111,80,109,87,111
								]
							]
						]
					],
				},
				{	// sprite 3
					name: 'magic_key',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									88,109,95,111,91,111,88,109,95,111
								]
							]
						]
					],
				},
				{	// sprite 4
					name: 'axe',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									0,106,6,111,3,111,0,106,6,111
								]
							]
						]
					],
				},
				{	// sprite 5
					name: 'hammer',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									8,105,14,111,11,111,8,105,14,111
								]
							]
						]
					],
				},
				{	// sprite 6
					name: 'knife',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									16,106,21,111,18,111,16,106,21,111
								]
							]
						]
					],
				},
				{	// sprite 7
					name: 'gun',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									24,106,31,111,27,111,24,106,31,111
								]
							]
						]
					],
				},
				{	// sprite 8
					name: 'crowbar',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									32,107,38,111,35,111,32,107,38,111
								]
							]
						]
					],
				},
				{	// sprite 9
					name: 'crate',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									48,104,55,111,48,111,48,104,55,111
								]
							]
						]
					],
				},
				{	// sprite 10
					name: 'chest',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									57,106,62,111,59,111,57,106,62,111
								],
								[ // frame 1
									57,96,61,103,59,103,57,96,61,103
								]
							]
						],
					],
				},
				{	// sprite 11
					name: 'chair',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									48,117,53,127,50,127,48,117,53,127
								]
							],
							[ // facing 1
								[ // frame 0
									58,117,63,127,61,127,58,117,63,127
								]
							],
						]
					],
				},
				{	// sprite 12
					name: 'table',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									65,120,86,127,75,127,65,120,86,127
								]
							]
						]
					],
				},
				{	// sprite 13
					name: 'yellow_arrow',
					frames: [
						[ // stance 0
							[ // facing 0 (up)
								[ // frame 0
									17,57,21,62,19,62,17,57,21,62
								]
							],
							[ // facing 1 (down)
								[ // frame 0
									26,57,30,62,28,62,26,57,30,62
								]
							],
							[ // facing 2 (left)
								[ // frame 0
									33,58,38,62,35,62,33,58,38,62
								]
							],
							[ // facing 3 (right)
								[ // frame 0
									41,58,46,62,44,62,41,58,46,62
								]
							],
						]
					],
				},
				{	// sprite 14
					name: 'stove',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									88,117,95,127,91,127,88,117,95,127
								]
							]
						]
					],
				},
				{	// sprite 15
					name: 'refrigerator',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									88,129,95,143,91,143,88,129,95,143
								]
							]
						]
					],
				},
				{	// sprite 16
					name: 'dresser',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									80,129,87,143,83,143,80,129,87,143
								]
							]
						]
					],
				},
				{	// sprite 17
					name: 'counter',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									72,136,79,143,75,143,72,136,79,143
								]
							]
						]
					],
				},
				{	// sprite 18
					name: 'fire',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									48,56,55,63,51,63,48,56,55,63
								],
								[ // frame 1
									56,56,63,63,59,63,56,56,63,63
								],
								[ // frame 2
									64,56,71,63,67,63,64,56,71,63
								],
								[ // frame 3
									72,56,79,63,75,63,72,56,79,63
								],
							],
						]
					],
				},
				{	// sprite 19
					name: 'shovel',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									40,104,47,111,40,111,40,104,47,111
								]
							]
						]
					],
				},
				{	// sprite 20
					name: 'door_up',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									8,112,15,127,8,127,8,112,15,127
								],
								[ // frame 1
									0,112,7,127,0,127,0,112,7,127
								],
							]
						]
					],
				},
				{	// sprite 21
					name: 'door_down',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									24,112,31,127,24,127,24,112,31,127
								],
								[ // frame 1
									16,112,23,127,16,127,16,112,23,127
								],
							]
						]
					],
				},
				{	// sprite 22
					name: 'Snake',
					frames: [
						[ // stance 0
							[ // facing 0
								[ // frame 0
									1,57,6,63,3,63,1,57,6,63
								],
							], 
							[ // facing 1
								[ // frame 0
									9,57,14,63,11,63,9,57,14,63
								],
							],
						],
						[ // stance 1
							[ // facing 0
								[ // frame 0
									1,57,6,63,3,63,1,57,6,63
								],
								[ // frame 0
									1,57,6,63,3,63,1,57,6,63
								],
								[ // frame 0
									1,57,6,63,3,63,1,57,6,63
								],
								[ // frame 0
									1,57,6,63,3,63,1,57,6,63
								],
							], 
							[ // facing 1
								[ // frame 0
									9,57,14,63,11,63,9,57,14,63
								],
								[ // frame 0
									9,57,14,63,11,63,9,57,14,63
								],
								[ // frame 0
									9,57,14,63,11,63,9,57,14,63
								],
								[ // frame 0
									9,57,14,63,11,63,9,57,14,63
								],
							],
						],
					],
				},
			],
		};
		this.tile_defs = {
			list: [
		/* xx */ //{ name: '',frame: [x,y], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/*  0 */ { name: 'empty_space',frame: [0,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/*  1 */ { name: 'ground_concrete', frame: [0,88], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/*  2 */ { name: 'ground_gravel', frame: [8,88], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/*  3 */ { name: 'water_animated', frame: [0,96], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false, animate: {dir:1} },
		/*  4 */ { name: 'bridge_wood_left', frame: [0,80], slope_left: true, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/*  5 */ { name: 'bridge_wood_platform', frame: [8,80], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/*  6 */ { name: 'bridge_wood_right', frame: [16,80], slope_left: false, slope_right: true, can_climb: false, solid: false, stand_on: false },
		/*  7 */ { name: 'ground_gravel_grassy', frame: [72,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/*  8 */ { name: 'ground_gravel_paved', frame: [88,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/*  9 */ { name: 'ground_concrete_paved', frame: [80,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 10 */ { name: 'handrail_wood_left', frame: [0,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 11 */ { name: 'handrail_wood', frame: [8,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 12 */ { name: 'handrail_wood_right', frame: [16,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 13 */ { name: 'background_concrete', frame: [80,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 14 */ { name: 'background_gravel', frame: [88,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 15 */ { name: 'door_up_open_top', frame: [0,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 16 */ { name: 'door_up_open_bottom', frame: [0,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 17 */ { name: 'door_up_closed_top', frame: [8,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 18 */ { name: 'door_up_closed_bottom', frame: [8,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 19 */ { name: 'door_down_open_top', frame: [16,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 20 */ { name: 'door_down_open_bottom', frame: [16,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 21 */ { name: 'door_down_closed_top', frame: [24,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 22 */ { name: 'door_down_closed_bottom', frame: [24,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 23 */ { name: 'ground_red_brick', frame: [16,88], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 24 */ { name: 'ground_brown_brick', frame: [24,88], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 25 */ { name: 'ground_red_brick_paved',frame: [96,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 26 */ { name: 'ground_brown_brick_paved',frame: [104,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 27 */ { name: 'background_red_brick',frame: [96,56], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 28 */ { name: 'background_brown_brick',frame: [104,56], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 29 */ { name: 'ground_wood_paved',frame: [112,72], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 30 */ { name: 'background_wood',frame: [112,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 31 */ { name: 'ladder_wood',frame: [48,80], slope_left: false, slope_right: false, can_climb: true, solid: false, stand_on: false },
		/* 32 */ { name: 'ladder_metal',frame: [56,80], slope_left: false, slope_right: false, can_climb: true, solid: false, stand_on: false },
		/* 33 */ { name: 'background_red_brick_bottom',frame: [96,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 34 */ { name: 'background_brown_brick_bottom',frame: [104,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },		
		/* 35 */ { name: 'ground_concrete_left',frame: [72,80], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 36 */ { name: 'ground_concrete_right',frame: [80,80], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 37 */ { name: 'ground_gravel_left',frame: [88,80], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 38 */ { name: 'ground_gravel_right',frame: [96,80], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 39 */ { name: 'ladder_wood_top',frame: [48,72], slope_left: false, slope_right: false, can_climb: true, solid: false, stand_on: true },
		/* 40 */ { name: 'ladder_metal_top',frame: [56,72], slope_left: false, slope_right: false, can_climb: true, solid: false, stand_on: true },
		/* 41 */ { name: 'lava_animated', frame: [16,96], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false, animate: {dir:1} },
		/* 42 */ { name: 'goo_animated', frame: [32,96], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false, animate: {dir:1} },
		/* 43 */ { name: 'fence_white',frame: [96,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 44 */ { name: 'fence_brown',frame: [104,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 45 */ { name: 'window_dark',frame: [0,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 46 */ { name: 'window_light',frame: [8,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 47 */ { name: 'roof_gray_middle',frame: [8,152], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 48 */ { name: 'roof_gray_left',frame: [0,144], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 49 */ { name: 'roof_gray_top',frame: [8,144], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 50 */ { name: 'roof_gray_right',frame: [16,144], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 51 */ { name: 'roof_red_middle',frame: [32,152], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 52 */ { name: 'roof_red_left',frame: [24,144], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 53 */ { name: 'roof_red_top',frame: [32,144], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 54 */ { name: 'roof_red_right',frame: [40,144], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 55 */ { name: 'chimney_red',frame: [8,136], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 56 */ { name: 'chimney_brown',frame: [16,136], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 57 */ { name: 'bush_topleft',frame: [152,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 58 */ { name: 'bush_top',frame: [160,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 59 */ { name: 'bush_topright',frame: [168,112], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 60 */ { name: 'bush_left',frame: [152,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 61 */ { name: 'bush_middle',frame: [160,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 62 */ { name: 'bush_right',frame: [168,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 63 */ { name: 'bridge_metal_left', frame: [24,80], slope_left: true, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 64 */ { name: 'bridge_metal_platform', frame: [32,80], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/* 65 */ { name: 'bridge_metal_right', frame: [40,80], slope_left: false, slope_right: true, can_climb: false, solid: false, stand_on: false },
		/* 66 */ { name: 'handrail_metal_left', frame: [24,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 67 */ { name: 'handrail_metal', frame: [32,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 68 */ { name: 'handrail_metal_right', frame: [40,72], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 69 */ { name: 'roof_aqua_middle',frame: [56,152], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 70 */ { name: 'roof_aqua_left',frame: [48,144], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 71 */ { name: 'roof_aqua_top',frame: [56,144], slope_left: false, slope_right: false, can_climb: false, solid: true, stand_on: true },
		/* 72 */ { name: 'roof_aqua_right',frame: [64,144], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 73 */ { name: 'background_tan_siding',frame: [120,56], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 74 */ { name: 'background_tan_siding_bottom',frame: [120,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 75 */ { name: 'stairs_concrete_small',frame: [32,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/* 76 */ { name: 'stairs_concrete_left',frame: [40,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/* 77 */ { name: 'stairs_concrete_middle',frame: [48,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/* 78 */ { name: 'stairs_concrete_right',frame: [56,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: true },
		/* 79 */ { name: 'tree_trunk_small',frame: [160,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 80 */ { name: 'fence_metal',frame: [112,120], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 81 */ { name: 'fence_chain_top_left',frame: [96,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 82 */ { name: 'fence_chain_top',frame: [104,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 83 */ { name: 'fence_chain_top_right',frame: [112,128], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 84 */ { name: 'fence_chain_left',frame: [96,136], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 85 */ { name: 'fence_chain_middle',frame: [104,136], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 86 */ { name: 'fence_chain_right',frame: [112,136], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 87 */ { name: 'background_white_siding',frame: [128,56], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 88 */ { name: 'background_white_siding_bottom',frame: [128,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 89 */ { name: 'ground_brick_red_left',frame: [104,80], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 90 */ { name: 'ground_brick_red_right',frame: [112,80], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 91 */ { name: 'ground_brick_brown_left',frame: [120,80], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 92 */ { name: 'ground_brick_brown_right',frame: [128,80], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 93 */ { name: 'ground_gravel_grass_left',frame: [136,80], slope_left: true, slope_right: false, can_climb: false, solid: true, stand_on: false },
		/* 94 */ { name: 'ground_gravel_grass_right',frame: [144,80], slope_left: false, slope_right: true, can_climb: false, solid: true, stand_on: false },
		/* 95 */ { name: 'background_brown_siding',frame: [136,56], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* 96 */ { name: 'background_brown_siding_bottom',frame: [136,64], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
		/* xx */ //{ name: '',frame: [x,y], slope_left: false, slope_right: false, can_climb: false, solid: false, stand_on: false },
			],
		};
		
		this.object_defs = {
			list: [
		/*  0 */ { type: 'item', name: 'Gold Key',	sprite: 1, flags: ['gold_key','gravity'],},
		/*  1 */ { type: 'item', name: 'Silver Key', sprite: 2, flags: ['silver_key','gravity'],},
		/*  2 */ { type: 'item', name: 'Mythic Key', sprite: 3, flags: ['orange_key','gravity'],},
		/*  3 */ { type: 'item', name: 'Axe', sprite: 4, flags: ['axe','gravity'],},
		/*  4 */ { type: 'item', name: 'Hammer', sprite: 5, flags: ['hammer','gravity'],},
		/*  5 */ { type: 'item', name: 'Knife', sprite: 6, flags: ['knife','gravity'],},
		/*  6 */ { type: 'item', name: 'Gun', sprite: 7, flags: ['gun','gravity'],},
		/*  7 */ { type: 'item', name: 'Crowbar', sprite: 8, flags: ['crowbar','gravity'],},
		/*  8 */ { type: 'furniture', name: 'Crate', sprite: 9, flags: ['stand_on','solid','gravity'],},
		/*  9 */ { type: 'furniture', name: 'Chest', sprite: 10, flags: ['gravity'],},
		/* 10 */ { type: 'furniture', name: 'Chair', sprite: 11, flags: ['gravity'],},
		/* 11 */ { type: 'furniture', name: 'Table', sprite: 12, flags: ['stand_on','gravity'],},
		/* 12 */ { type: 'furniture', name: 'Stove', sprite: 14, flags: ['stand_on','gravity'],},
		/* 13 */ { type: 'furniture', name: 'Refrigerator', sprite: 15, flags: ['gravity'],},
		/* 14 */ { type: 'furniture', name: 'Dresser', sprite: 16, flags: ['gravity'],},
		/* 15 */ { type: 'furniture', name: 'Counter', sprite: 17, flags: ['stand_on','gravity'],},
		/* 16 */ { type: 'obstacle', name: 'Fire', sprite: 18, flags: ['fire_damage','animated','gravity'],},
		/* 17 */ { type: 'item', name: 'Shovel', sprite: 19, flags: ['shovel','gravity'],},
		/* 18 */ { type: 'furniture', name: 'Door Up', sprite: 20, flags: [],},
		/* 19 */ { type: 'furniture', name: 'Door Down', sprite: 21, flags: [],},
			],
		};
		
		this.npc_defs = {
			list: [
		/*  0 */ {
					name: 'Person',
					race: 'Human',
					sprite: 0,
					flags: ['speaks','gravity'],
					hp: 10,
				},
		/*  1 */ {
					name: 'Snake',
					race: 'Snake',
					sprite: 22,
					flags: ['aggressive'],
					hp: 5,
				},
		/* xx */ //{},
			],
		};
		
		this.map_defs = {
			list: [{
				name: 'test_map',
				tile_grid:[ // each tile has background/structural/foreground layers
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[14,0,0,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,5,0],	[0,0,39,0],	[0,0,5,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[14,0,0,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,31,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[13,0,5,0],	[13,0,5,0],	[13,0,5,0],	[0,0,0,0],	[0,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0], [14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,31,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[13,0,0,0],	[13,0,0,0],	[13,0,0,0],	[0,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0], [14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[0,0,0,10],	[0,0,0,11],	[0,0,31,11],[0,0,0,11],	[0,0,0,11],	[0,0,0,11],	[0,0,0,11],	[13,0,0,12],[13,0,0,0],	[13,0,0,0],	[14,0,0,0],	[14,0,0,0],[14,0,0,0],	[14,0,5,0],	[14,0,7,0],	[0,0,2,0], 	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],[14,0,0,0],	[0,0,2,0],	],
					[[0,0,0,0],	[0,0,0,0],	[13,0,4,0],	[0,0,5,0],	[0,0,5,0],	[0,0,5,0],	[0,0,5,0],	[0,0,5,0],	[0,0,5,0],	[13,0,6,0],	[13,0,0,12],[13,0,0,0],	[14,0,0,0],	[14,0,0,0],[14,0,0,0],	[14,0,0,0],	[14,0,2,0],	[0,0,2,0],	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],[14,0,0,0],	[0,0,2,0],	],
					[[0,0,7,0],	[0,0,7,0],	[0,0,9,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[0,0,0,0],	[13,0,0,0],	[13,0,6,0],	[13,0,0,0],	[0,0,7,0],	[0,0,7,0],	[0,0,7,0],	[0,0,7,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,2,0],	[0,0,2,0],	[0,0,1,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[0,0,9,0],	[0,0,9,0],	[0,0,9,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[[0,0,2,0],	[0,0,2,0],	[0,0,1,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[3,0,0,0],	[0,0,1,0],	[0,0,1,0],	[0,0,1,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0], 	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
				],
				events:[
					{
						guid: 'DOOROPENx0000',
						type: 'door_up',
						tile_x: 21,
						tile_y: 7,
						one_time: false,
						hidden: false,
						locked: true, // true
						key_item: 2, // 2 magic key
						key_special: -1,
						target: {
							map: 1,
							x: 60,
							y: 71,
						},
					},
					{
						guid: 'DOOROPENx0001',
						type: 'door_down',
						tile_x: 13,
						tile_y: 7,
						one_time: false,
						hidden: false,
						locked: true,
						key_item: 1,
						key_special: -1,
						target: {
							map: 2,
							x: 43,
							y: 135,
						},
					},
					{
						guid: 'EXITx0001',
						type: 'touch_exit',
						tile_x: 0,
						tile_y: 7,
						one_time: false,
						hidden: false,
						locked: false,
						key_item: -1,
						key_special: -1,
						target: {
							map: 2,
							x: 388,
							y: 175,
						},
					},
					{
						guid: 'CHESTLOOTx0000',
						type: 'chest_open',
						tile_x: -1,
						tile_y: -1,
						one_time: true,
						hidden: false,
						locked: true,
						key_item: 0,
						key_special: -1,
						loot: [3], // axe?
						loot_money: 10,
					},
					{
						guid: 'TALKNPCx0000',
						type: 'speak_npc',
						one_time: true,
						locked: true,
						speech_script: ['Thank you, traveler!','That snake was keeping me from getting the keys I dropped.','With those you should be able to move forward!','Take these too; they will help you on your way.'],
						key_event_ids: ['OBJx0000'], // KILLNPCx0001
						loot: [7], // crowbar?
						loot_money: 20,
					},
					{
						guid: 'TALKNPCx0001',
						type: 'speak_npc',
						one_time: false,
						locked: true,
						speech_script: ['Thank you, traveler!'],
						key_event_ids: ['TALKNPCx0000'],
						loot: [],
						loot_money: 0,
					},
				],
				objects:[
					{
						guid: 'CHESTx0000',
						unique: true,
						no_respawn: true,
						loc_x: 75,
						loc_y: 31,
						facing: 0,
						thing_id: 9,
						collides: false,
						open_event: 'CHESTLOOTx0000',
					},
					{
						guid: 'CRATEx0000',
						unique: true,
						no_respawn: true,
						loc_x: 43,
						loc_y: 79,
						facing: 0,
						thing_id: 8,
						collides: true,
					},
					{
						guid: 'CRATEx0001',
						unique: true,
						no_respawn: true,
						loc_x: 51,
						loc_y: 79,
						facing: 0,
						thing_id: 8,
						collides: true,
					},
					{
						guid: 'DOORx0000',
						unique: true,
						no_respawn: true,
						loc_x: 168,
						loc_y: 63,
						facing: 0,
						thing_id: 18,
						collides: false,
						open_event: 'DOOROPENx0000',
					},
					{
						guid: 'DOORx0001',
						unique: true,
						no_respawn: true,
						loc_x: 104,
						loc_y: 63,
						facing: 0,
						thing_id: 19,
						collides: false,
						open_event: 'DOOROPENx0001',
					},
				],
				npcs:[
					{
						name: 'Guard',
						guid: 'NPCx0000',
						unique: true,
						no_respawn: false,
						loc_x: 117,
						loc_y: 63,
						facing: 1,
						npc_id: 0,
						aggressive: false,
						default_speech: ['Hello, traveler.','You can climb the ledge by jumping again when you\'re close enough to reach it!'],
						talk_events: ['TALKNPCx0001','TALKNPCx0000'],
					},
				],
			},{
				name: 'cave house',
				tile_grid: [
					[	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0], [0,0,2,0],	],
					[	[0,0,2,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0],	[14,0,0,0], [0,0,2,0],	],
					[	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	[0,0,2,0],	],
				],
				events: [
					{
						guid: 'DOOROPENx0002',
						type: 'door_down',
						tile_x: 7,
						tile_y: 8,
						one_time: false,
						hidden: false,
						locked: false,
						key_item: -1,
						key_special: -1,
						target: {
							map: 0,
							x: 172,
							y: 63,
						},
					},
					{
						guid: 'AGGRONPCx0001',
						type: 'npc_aggroed',
						one_time: true,
						locked: false,
						key_event_ids: [],
					},
					{
						guid: 'KILLNPCx0001',
						type: 'npc_killed',
						one_time: true,
						locked: false,
						key_event_ids: [],
						loot: [],
						loot_money: 0,
					},
				],
				objects: [
					{
						guid: 'OBJx0000',
						unique: true,
						no_respawn: true,
						loc_x: 12,
						loc_y: 71,
						facing: 0,
						thing_id: 0,
						collides: true,
					},				
					{
						guid: 'OBJx0001',
						unique: true,
						no_respawn: true,
						loc_x: 20,
						loc_y: 71,
						facing: 0,
						thing_id: 1,
						collides: true,
					},				
					{
						guid: 'DOORx0002',
						unique: true,
						no_respawn: true,
						loc_x: 56,
						loc_y: 71,
						facing: 0,
						thing_id: 19,
						collides: true,
						open_event: 'DOOROPENx0000',
					},				
				],
				npcs: [
					{
						guid: 'NPCx0001',
						name: 'Solid Snake',
						unique: true,
						no_respawn: false,
						loc_x: 38,
						loc_y: 71,
						facing: 0,
						npc_id: 1, // snake
						aggressive: true,
						aggro_event: 'AGGRONPCx0001',
						kill_event: 'KILLNPCx0001',
					},
				],
			}
			//,{
			//	name: '',
			//	tile_grid: [],
			//	events: [],
			//	objects: [],
			//	npcs: [],
			//}
			],
		};
		
		// map 2
		GAME_WORLD.map_defs.list[2] = {"name":"2nd St North","tile_grid":[[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[56,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[56,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,57,0],[0,0,58,0],[0,0,59,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[56,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[50,0,60,0],[0,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,45,0,0],[95,0,0,0],[95,0,0,0],[95,45,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[73,45,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,45,0,0],[73,0,0,0],[0,0,60,0],[0,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[0,0,60,0],[79,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,60,0],[79,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,45,0,0],[95,45,0,0],[95,45,0,0],[95,45,0,0],[95,45,0,0],[95,45,0,0],[95,0,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[47,0,0,0],[87,0,0,0],[87,0,0,0],[87,45,0,0],[87,45,0,0],[87,45,0,0],[87,0,0,0],[87,0,17,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,57,0],[0,0,58,0],[0,0,59,0],[0,0,0,0],[48,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,60,0],[79,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,45,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,11],[87,0,0,11],[87,0,0,11],[87,0,0,11],[87,0,18,0],[87,0,0,11],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,60,0],[0,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[73,45,0,0],[73,45,0,0],[73,45,0,0],[73,45,0,0],[73,45,0,0],[73,45,0,0],[73,0,17,0],[73,45,0,0],[0,0,60,0],[79,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,5,0],[87,0,5,0],[87,0,5,0],[87,0,5,0],[87,0,77,0],[87,0,5,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,60,0],[0,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,0,0],[73,0,18,0],[73,0,0,0],[0,0,60,0],[79,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,7,0],[0,0,8,0],[0,0,8,0],[0,0,8,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[13,0,7,0],[13,0,7,0],[13,0,94,0],[13,0,0,0],[13,0,0,0],[13,0,0,0],[13,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,77,0],[88,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,60,0],[0,0,61,0],[0,0,62,0],[0,0,0,0],[0,0,0,0],[74,0,0,0],[74,0,0,0],[74,0,0,0],[74,0,0,0],[74,0,0,0],[74,0,0,0],[74,0,77,0],[74,0,0,0],[0,0,0,0],[79,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,2,0],[0,0,8,0],[0,0,8,0],[0,0,8,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0]]],"events":[{"guid":"DOOR_2_TO_0","type":"door_up","tile_x":5,"tile_y":16,"one_time":0,"locked":0,"key_item":-1,"key_special":-1,"target":{"map":0,"x":107,"y":63},"hidden":1},{"guid":"SIDE_2_TO_0","type":"touch_exit","tile_x":49,"tile_y":21,"one_time":false,"hidden":false,"locked":false,"key_item":-1,"key_special":-1,"target":{"map":0,"x":12,"y":63}},{"guid":"SIDE_2_TO_3","type":"touch_exit","tile_x":0,"tile_y":20,"one_time":false,"hidden":false,"locked":false,"key_item":-1,"key_special":-1,"target":{"map":3,"x":384,"y":167}},{"guid":"DOOR_2_TO_4","type":"door_up","tile_x":47,"tile_y":21,"one_time":false,"hidden":false,"locked":false,"key_item":-1,"key_special":-1,"target":{"map":4,"x":10,"y":175}}],"objects":[{"guid":"OBJx0002","unique":true,"no_respawn":true,"loc_x":163,"loc_y":159,"facing":0,"thing_id":2,"collides":true}],"npcs":[]};
		
		GAME_WORLD.map_defs.list[3] = {"name":"2nd St North","tile_grid":[[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[70,0,0,0],[71,0,0,0],[71,0,0,0],[72,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[70,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[72,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[70,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[72,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,45,0],[95,0,0,0],[95,0,0,0],[95,0,45,0],[95,0,0,0],[71,0,0,0],[71,0,0,0],[72,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[63,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[69,0,0,0],[69,0,0,0],[69,0,0,0],[72,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[49,0,0,0],[49,0,0,0],[49,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,8,0],[0,0,8,0],[0,0,8,0],[0,0,7,0],[1,0,7,0],[88,0,94,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[48,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[50,0,0,0],[48,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[47,0,0,0],[50,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[13,0,94,0],[13,0,0,0],[13,0,0,0],[13,0,0,0],[13,0,0,0],[13,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,45,0],[95,0,0,0],[95,0,17,0],[95,0,0,0],[95,0,45,0],[95,0,0,0],[95,0,45,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[13,0,7,0],[13,0,94,0],[13,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,18,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[95,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,45,0],[87,0,0,0],[87,0,17,0],[87,0,0,0],[87,0,45,0],[87,0,45,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[96,0,94,0],[96,0,0,0],[96,0,0,0],[96,0,77,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[96,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,18,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[87,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[13,0,94,0],[13,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,77,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[88,0,0,0],[0,0,0,0],[0,0,0,0],[88,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[88,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0]]],"events":[{"guid":"SIDE_3_TO_2","type":"touch_exit","tile_x":49,"tile_y":20,"one_time":false,"hidden":false,"locked":false,"key_item":-1,"key_special":-1,"target":{"map":2,"x":10,"y":167}}],"objects":[],"npcs":[]};		
		
		
		GAME_WORLD.map_defs.list[4] = {"name":"Birch St","tile_grid":[[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0],[0,0,7,0]],[[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0],[0,0,2,0]]],"events":[{"guid":"SIDE_4_TO_2","type":"touch_exit","tile_x":0,"tile_y":21,"one_time":false,"hidden":false,"locked":false,"key_item":-1,"key_special":-1,"target":{"map":2,"x":380,"y":175}}],"objects":[],"npcs":[]};
	},
	
	
	// fetch sprite data --------------------
	// game objects -----------------------------------------------------------------
	
	
	// functions --------------------------------------------------------------------
	// find map tile under
	find_tile_under: function(obj) {
		var tx = Math.floor(obj.loc.x / 8);
		var ty = Math.floor((obj.loc.y + 1) / 8);
		var tile_array = this.map_defs.list[this.player.loc.map].tile_grid[ty][tx];
		var tile_id = tile_array[2]; // foreground tile!
		return this.tile_defs.list[tile_id];
	},
	// find map tile here
	find_tile_behind: function(obj) {
		var tx = Math.floor(obj.loc.x / 8);
		var ty = Math.floor(obj.loc.y / 8);
		var tile_array = this.map_defs.list[this.player.loc.map].tile_grid[ty][tx];
		var tile_id = tile_array[2]; // foreground tile!
		return this.tile_defs.list[tile_id];
	},
	// find event here
	find_event_behind: function(obj) {
		var tx = Math.floor(obj.loc.x / 8);
		var ty = Math.floor(obj.loc.y / 8);
		var event_array = this.map_defs.list[this.player.loc.map].events;
		for(evt of event_array) {
			if(evt.tile_x == tx && evt.tile_y == ty) {
				return evt;
			}
		}
		return null;
	},
	// find objects here
	find_objects_behind: function(obj) {
		var object_list = [];
		var objects = this.objects;
		for(obj of objects) {
			if(this.player.precollide_to_object(obj)) {
				object_list.push(obj);
			}
		}
		return object_list;
	},
	// find NPCs here
	find_npcs_behind: function(obj) {
		var npc_list = [];
		var npcs = this.npcs;
		for(npc of npcs) {
			if(this.player.precollide_to_npc(npc)) {
				npc_list.push(npc);
			}
		}
		return npc_list;
	},	



	
	// find NPCs by guid
	find_npc_by_guid: function(guid) {
		var found_npc = null;
		
		for(npc of this.npcs) {
			if(npc.guid == guid) {
				found_npc = npc;
			}
		}
		return found_npc;
	},

	// find events by guid
	find_map_event_by_guid: function(guid) {
		var found_event = null;
		var this_map = this.map_defs.list[this.player.loc.map];
		
		for(event of this_map.events) {
			if(event.guid == guid) {
				found_event = event;
			}
		}
		return found_event;
	},
	
	
	// player inventory
	player_add_item: function(thing_id,guid) {
		this.player.inventory.push({thing_id:thing_id,guid:guid});
	},
	player_can_consume: function(key_item) {
		var can_consume = false;
		var inv = this.player.inventory;
		var consume_ID = -1;
		
		for(lp in inv) {
			var item = inv[lp];
			if(key_item == item.thing_id) {
				can_consume = true;
				consume_ID = lp;
			}
		}
		if(can_consume) {
			this.player.inventory.splice(consume_ID,1);
		}
		
		// found the item
		return can_consume;
	},
	player_is_carrying_special: function(key_special) {
		var is_carrying_special = false;
		var inv = this.player.inventory;
		
		for(lp in inv) {
			var item = inv[lp];
			if(key_item == item.thing_id) {
				is_carrying_special = true;
			}
		}
		
		// found the item
		return is_carrying_special;
	},
	



	// player events
	player_check_event: function(evt) {
		var has_event = false;
		
		if(typeof this.player.EVENTS[evt.guid] != 'undefined') {
			has_event = true;
		}
		
		return has_event;
	},
	player_add_event: function(evt) {
		this.player.EVENTS[evt.guid] = true;
	},



	
	// check if an event's key events are satisfied
	is_event_satisfied: function(evt) {
		var satisfied = false;
		var number_satisfied = 0;
		
		if(evt.locked != true) { // if the event isn't locked, automatically pass
			satisfied = true;
		} else { 
			// check key event IDs
			for(evt_id of evt.key_event_ids) {
				if(typeof this.player.EVENTS[evt_id] != 'undefined') {
					number_satisfied++;
				}
			}
			
			// count passes - if not 100%, fail altogether
			if(number_satisfied == evt.key_event_ids.length) {
				satisfied = true;
			}
		}
		
		// send results
		return satisfied;
	},



	//scripts
	// find active script by GUID
	find_active_script_by_guid: function(guid) {
		for(script of this.scripts) {
			if(script.guid == guid) {
				return script;
			}
		}
		return null;
	},
	find_active_script_by_owner: function(guid) {
		for(script of this.scripts) {
			if(script.owner == guid) {
				return script;
			}
		}
		return null;
	},
	
	
	// queueing up scripts
	add_default_npc_speech_script: function(npc,time) {
		// for default talk scripts, use NPC guid
		
		if(!this.find_active_script_by_guid(npc.guid)) {
			var new_script = {
				type: 'npc_default_speech',
				guid: npc.guid,
				owner: npc.guid,
				next_tick: time + 5000,
				tick_progress: 0, // percentage for fading!
				pointer: 0,
				persist: false,
				actions: npc.default_speech,
			};
			this.scripts.push(new_script);
		}
	},
	add_npc_talk_script: function(npc,evt,time) {
		if(!this.find_active_script_by_guid(evt.guid) && !this.find_active_script_by_owner(npc.guid)) {
			//console.log('add_npc_talk_script');
			var new_script = {
				type: 'talk_script',
				guid: evt.guid,
				owner: npc.guid,
				next_tick: time + 5000,
				tick_progress: 0, // percentage for fading!
				pointer: 0,
				persist: false,
				actions: evt.speech_script,
				loot: evt.loot,
				loot_money: evt.loot_money,
			};
			this.scripts.push(new_script);

			
			// loot!
			// get items
			var item_buf = '';
			//this.object_defs
			if(typeof evt.loot != 'undefined') {
				for(item_id of evt.loot) {
					this.player_add_item({thing_id:item_id,guid:evt.guid});
					
					item_buf += this.object_defs.list[item_id].name+', ';
				}
				if(item_buf != "") {
					item_buf = item_buf.substr(0,item_buf.length-2)
				}
			}
			// add money
			var money_buf = '';
			if(typeof evt.loot_money != 'undefined') {
				if(evt.loot_money > 0) {
					this.player.money += evt.loot_money;
					money_buf = evt.loot_money+' dollars';
				}
			}
			
			// add script for gaining the items/money if there are any!
			if(item_buf != '' || money_buf != '') {
				var loot_script_text = npc.name+' gave you ';
				if(item_buf != '' && money_buf != '') {
					loot_script_text += item_buf + ' and ' + money_buf;
				} else if(item_buf != '') {
					loot_script_text += item_buf;
				} else {
					loot_script_text += money_buf;
				}
				loot_script_text += '.';
				
				var loot_script = {
					type: 'loot_message',
					guid: evt.guid,
					owner: evt.guid,
					next_tick: time + 5000,
					tick_progress: 0, // percentage for fading!
					pointer: 0,
					persist: false,
					actions: [loot_script_text],
				};
				console.log(loot_script);
				this.scripts.push(loot_script);
			}
		}
	},	
	
	
	
	// clear canvas
	clearCanvas: function() {
		if(true) {
			// night
			this.gfx.fillStyle = 'rgba(20,20,20,1)';
		} else {
			// day
			this.gfx.fillStyle = 'rgba(200,230,255,1)';
		}
		
		this.gfx.fillRect(0,0,this.canvas.width,this.canvas.height);
	},
	// render all the things
	renderAll: function() {
		this.clearCanvas();
		this.renderBackground();
		this.renderMap();
		this.renderObjects(0);
		this.renderNpcs();
		this.renderPlayer();
		this.renderObjects(1);
		this.renderForeground();
		this.renderEffects();
		this.renderElements();
		this.renderConversations();
		this.renderHUD();
		
		if(this.EDITOR != null) {
			this.EDITOR.render();
		}
	},
	// render the background
	renderBackground: function() {
		var this_grid = this.map_defs.list[this.player.loc.map].tile_grid;
		var source_image = document.getElementById('game_tiles');
		
		for(var lrow=0;lrow<this_grid.length;lrow++) {
			for(var lcol=0;lcol<this_grid[lrow].length;lcol++) {
				// background layer
				var this_tile = this_grid[lrow][lcol];
				var tile_def = this.tile_defs.list[this_tile[0]];
				var aframe = tile_def.frame;
				var loc_x = lcol * 8;
				var loc_y = lrow * 8;
				
				if(typeof tile_def.animate != 'undefined') { // water animation!
					if(tile_def.animate.dir == 1) {
						this.gfx.drawImage(source_image,aframe[0]+(7-this.water_frame),aframe[1],8,8,loc_x,loc_y,8,8);
					}
					else if(tile_def.animate.dir == -1) {
						this.gfx.drawImage(source_image,aframe[0]+this.water_frame,aframe[1],8,8,loc_x,loc_y,8,8);
					}
				} else {
					this.gfx.drawImage(source_image,aframe[0],aframe[1],8,8,loc_x,loc_y,8,8);
				}
				
				
				// background decoration layer
				if(this_tile[1] > 0) {
					tile_def = this.tile_defs.list[this_tile[1]];
					aframe = tile_def.frame;
					
					if(typeof tile_def.animate != 'undefined') { // water animation!
						if(tile_def.animate.dir == 1) {
							this.gfx.drawImage(source_image,aframe[0]+(7-this.water_frame),aframe[1],8,8,loc_x,loc_y,8,8);
						}
						else if(tile_def.animate.dir == -1) {
							this.gfx.drawImage(source_image,aframe[0]+this.water_frame,aframe[1],8,8,loc_x,loc_y,8,8);
						}
					} else {
						this.gfx.drawImage(source_image,aframe[0],aframe[1],8,8,loc_x,loc_y,8,8);
					}
				}
			}
		}
		
	},
	// render the structure/map
	renderMap: function() {
		var this_map = this.map_defs.list[this.player.loc.map];
		var this_grid = this_map.tile_grid;
		var source_image = document.getElementById('game_tiles');
		
		for(var lrow=0;lrow<this_grid.length;lrow++) {
			for(var lcol=0;lcol<this_grid[lrow].length;lcol++) {
				var this_tile = this_grid[lrow][lcol];
				if(this_tile[2] > 0) {
					var tile_def = this.tile_defs.list[this_tile[2]];
					var aframe = tile_def.frame;
					var loc_x = lcol * 8;
					var loc_y = lrow * 8;
					
					// find animated tiles?
					if(typeof tile_def.animate != 'undefined') { // water animation!
						if(tile_def.animate.dir == 1) {
							this.gfx.drawImage(source_image,aframe[0]+(7-this.water_frame),aframe[1],8,8,loc_x,loc_y,8,8);
						}
						else if(tile_def.animate.dir == -1) {
							this.gfx.drawImage(source_image,aframe[0]+this.water_frame,aframe[1],8,8,loc_x,loc_y,8,8);
						}
					} else {
						this.gfx.drawImage(source_image,aframe[0],aframe[1],8,8,loc_x,loc_y,8,8);
					}
				}
			}
		}
	},
	// render objects
	renderObjects: function(where) {
		// where: 0 = map, 1 = foreground
		if(this.objects.length > 0) {
			var source_image = document.getElementById('game_tiles');
			for(obj of this.objects) {
				if((obj.thing_id != 19 && where == 0) || (obj.thing_id == 19 && where == 1)) { // map layer OR - 19 = door down, the only object that renders after the player (so far)
					//var aframe = this.object_defs.list[obj.thing_id].sprite_frame;
					var this_sprite = this.sprite_defs.list[this.object_defs.list[obj.thing_id].sprite];
					var aframe = this_sprite.frames[0][0][obj.frame];
					var s_width = aframe[2] - aframe[0] + 1;
					var s_height = aframe[3] - aframe[1] + 1;
					var loc_x = obj.loc.x - (aframe[4] - aframe[0]); // origin_x - left
					var loc_y = obj.loc.y - (aframe[5] - aframe[1]); // origin_y - top
					this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_x,loc_y,s_width,s_height);
				}
			}
		}
	},
	cleanObjects: function() {
		// destroy objects if they're supposed to be gone
		for(lp in GAME_WORLD.objects) {
			if(GAME_WORLD.objects[lp].DESTROY_THIS) {
				// initiate destroy affect?
				
				
				
				
				// remove object
				GAME_WORLD.objects.splice(lp,1);
			}
		}
	},
	// render objects
	renderNpcs: function() {
		if(this.npcs.length > 0) {
			var source_image = document.getElementById('game_tiles');
			for(npc of this.npcs) {
				//var aframe = this.object_defs.list[npc.thing_id].sprite_frame;
				//var this_sprite = this.sprite_defs.list[this.object_defs.list[npc.thing_id].sprite];
				var this_sprite = this.sprite_defs.list[this.npc_defs.list[npc.npc_id].sprite];
				var aframe = this_sprite.frames[0][npc.facing][npc.frame];
				var s_width = aframe[2] - aframe[0] + 1;
				var s_height = aframe[3] - aframe[1] + 1;
				var loc_x = npc.loc.x - (aframe[4] - aframe[0]); // origin_x - left
				var loc_y = npc.loc.y - (aframe[5] - aframe[1]); // origin_y - top
				this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_x,loc_y,s_width,s_height);
			}
		}
	},
	cleanNpcs: function() {
		// destroy objects if they're supposed to be gone
		for(lp in GAME_WORLD.npcs) {
			if(GAME_WORLD.npcs[lp].DESTROY_THIS) {
				// initiate destroy affect?
				
				
				
				
				// remove object
				GAME_WORLD.npcs.splice(lp,1);
			}
		}
	},
	// render the player sprite
	renderPlayer: function() {
		var source_image = document.getElementById('game_tiles');

		// drawimage test
		// stance facing frame!

		// get stance
		var this_stance = this.player.stance;
		var this_frame = this.player.frame;
		
		// change displayed stance
		if(this.player.falling) {
			this_stance = 0;
			this_frame = 0;
		}
		
		var aframe = this.sprite_defs.list[this.player.sprite_id].frames[this_stance][this.player.facing][this_frame];
		var s_width = aframe[2] - aframe[0] + 1;
		var s_height = aframe[3] - aframe[1] + 1;
		var loc_lx = this.player.loc.x - (aframe[4] - aframe[0]); // origin_x - left
		var loc_rx = this.player.loc.x - (aframe[4] - aframe[2]); // origin_x - right
		var loc_y = this.player.loc.y - (aframe[5] - aframe[1]); // origin_y - top
		var b_y = this.player.loc.y - (aframe[5] - aframe[3]); // origin_y - bottom
		this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,loc_y,s_width,s_height);
		
		//// red box for frame "boundaries"
		//this.gfx.strokeStyle = 'red';
		//this.gfx.strokeRect(loc_lx,loc_y,(loc_rx-loc_lx),(b_y-loc_y));
		//// cyan dot on origin?
		//this.gfx.strokeStyle = 'cyan';
		//this.gfx.strokeRect(this.player.loc.x,this.player.loc.y,1,1);
	},
	// render the foreground tiles
	renderForeground: function() {
		var this_grid = this.map_defs.list[this.player.loc.map].tile_grid;
		var source_image = document.getElementById('game_tiles');
		
		for(var lrow=0;lrow<this_grid.length;lrow++) {
			for(var lcol=0;lcol<this_grid[lrow].length;lcol++) {
				var this_tile = this_grid[lrow][lcol];
				if(this_tile[3] > 0) {
					var aframe = this.tile_defs.list[this_tile[3]].frame;
					var loc_x = lcol * 8;
					var loc_y = lrow * 8;
					
					this.gfx.drawImage(source_image,aframe[0],aframe[1],8,8,loc_x,loc_y,8,8);
				}
			}
		}
	},
	renderEffects: function() {
		// not yet
	},
	renderElements: function() {
		var source_image = document.getElementById('game_tiles');
		
		// proximity to doors?
		var this_map_events = this.map_defs.list[this.player.loc.map].events;
		for(evt of this_map_events) {
			if(!evt.hidden) {
				if(evt.type == "door_up") {
					var loc_x = evt.tile_x * 8 + 4;
					var loc_y = evt.tile_y * 8 + 7;
					
					var dx = loc_x - this.player.loc.x;
					var dy = loc_y - this.player.loc.y;
					var dist = Math.sqrt(dx*dx + dy*dy);
					if(dist < 16) {
						loc_y -= 16;
						
						if(evt.locked && !this.player_check_event(evt)) {
							// find the unlock item sprite from the object def
							var obj = this.object_defs.list[evt.key_item];
							var aframe = this.sprite_defs.list[obj.sprite].frames[0][0][0];
							this.gfx.fillStyle = "rgba(192,0,0,0.2)";
						} else {
							var aframe = this.sprite_defs.list[13].frames[0][0][0]; // arrow up							
							this.gfx.fillStyle = "rgba(0,0,0,0)";
						}
						
						// render door up icon
						var s_width = aframe[2] - aframe[0] + 1;
						var s_height = aframe[3] - aframe[1] + 1;
						var loc_lx = loc_x - (aframe[4] - aframe[0]); // origin_x - left
						var loc_rx = loc_x - (aframe[4] - aframe[2]); // origin_x - right
						var nloc_y = loc_y - (aframe[5] - aframe[1]); // origin_y - top
						var b_y = loc_y - (aframe[5] - aframe[3]); // origin_y - bottom
						this.gfx.fillRect(loc_lx-1,nloc_y-1,s_width+2,s_height+2);
						this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,nloc_y,s_width,s_height);
					}
				}
				if(evt.type == "door_down") {
					var loc_x = evt.tile_x * 8 + 4;
					var loc_y = evt.tile_y * 8 + 7;
					
					var dx = loc_x - this.player.loc.x;
					var dy = loc_y - this.player.loc.y;
					var dist = Math.sqrt(dx*dx + dy*dy);
					if(dist < 16) {
						loc_y += 8;
						
						if(evt.locked && !this.player_check_event(evt)) {
							// find the unlock item sprite from the object def
							var obj = this.object_defs.list[evt.key_item];
							var aframe = this.sprite_defs.list[obj.sprite].frames[0][0][0];
							this.gfx.fillStyle = "rgba(192,0,0,0.2)";
						} else {
							var aframe = this.sprite_defs.list[13].frames[0][1][0]; // arrow up							
							this.gfx.fillStyle = "rgba(0,0,0,0)";
						}
						
						// render door down icon
						var s_width = aframe[2] - aframe[0] + 1;
						var s_height = aframe[3] - aframe[1] + 1;
						var loc_lx = loc_x - (aframe[4] - aframe[0]); // origin_x - left
						var loc_rx = loc_x - (aframe[4] - aframe[2]); // origin_x - right
						var nloc_y = loc_y - (aframe[5] - aframe[1]); // origin_y - top
						var b_y = loc_y - (aframe[5] - aframe[3]); // origin_y - bottom
						this.gfx.fillRect(loc_lx-1,nloc_y-1,s_width+2,s_height+2);
						this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,nloc_y,s_width,s_height);
					}
				}
				if(evt.type == "touch_exit") {
					if(evt.tile_x == 0 || evt.tile_x == 49) {
						var loc_x = evt.tile_x * 8 + 4;
						var loc_y = evt.tile_y * 8 + 7;
						
						var dx = loc_x - this.player.loc.x;
						var dy = loc_y - this.player.loc.y;
						var dist = Math.sqrt(dx*dx + dy*dy);
						if(dist < 16) {
							var facing_dir = 1;
							loc_y -= 16;
							if(evt.tile_x == 0) {
								facing_dir = 2;
							} else if(evt.tile_x == 49) {
								facing_dir = 3;
							}
							var aframe = this.sprite_defs.list[13].frames[0][facing_dir][0]; // arrow one direction
							var s_width = aframe[2] - aframe[0] + 1;
							var s_height = aframe[3] - aframe[1] + 1;
							var loc_lx = loc_x - (aframe[4] - aframe[0]); // origin_x - left
							var loc_rx = loc_x - (aframe[4] - aframe[2]); // origin_x - right
							var nloc_y = loc_y - (aframe[5] - aframe[1]); // origin_y - top
							var b_y = loc_y - (aframe[5] - aframe[3]); // origin_y - bottom
							this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,nloc_y,s_width,s_height);
						}
					}
				}
			}
		}
		
		// proximity to chests?
		var this_map_objects = this.map_defs.list[this.player.loc.map].objects;
		for(obj of this_map_objects) {
			if(typeof obj.open_event != 'undefined') { // has open event - some kind of container?
				for(evt of this_map_events) { // find open event
					if(evt.guid == obj.open_event) {
						if(evt.type == 'chest_open') {
							if(!this.player_check_event(evt)) { // 
								// show the key needed to open the chest?
								var loc_x = obj.loc_x;
								var loc_y = obj.loc_y;
								
								var dx = loc_x - this.player.loc.x;
								var dy = loc_y - this.player.loc.y;
								var dist = Math.sqrt(dx*dx + dy*dy);
								if(dist < 16) {
									loc_y += 8;
									
									// render chest down icon
									var objd = this.object_defs.list[evt.key_item];
									var aframe = this.sprite_defs.list[objd.sprite].frames[0][0][0];
									var s_width = aframe[2] - aframe[0] + 1;
									var s_height = aframe[3] - aframe[1] + 1;
									var loc_lx = loc_x - (aframe[4] - aframe[0]); // origin_x - left
									var loc_rx = loc_x - (aframe[4] - aframe[2]); // origin_x - right
									var nloc_y = loc_y - (aframe[5] - aframe[1]); // origin_y - top
									var b_y = loc_y - (aframe[5] - aframe[3]); // origin_y - bottom
									this.gfx.fillStyle = "rgba(192,0,0,0.2)";
									this.gfx.fillRect(loc_lx-1,nloc_y-1,s_width+2,s_height+2);
									this.gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,nloc_y,s_width,s_height);
								}
							}
						}
					}
				}
			}
		}

	},
	
	
	// render the HUD
	renderHUD: function() { // this didn't work - pixel sizes prevent it - figure out another way!
		this.gfx.fillStyle = '#000000';
		this.gfx.fillRect(386,2,12,12);
		this.gfx.fillRect(370,2,12,12);
		this.gfx.strokeStyle = '#ff0000';
		this.gfx.strokeRect(386,2,12,12);
		this.gfx.strokeRect(370,2,12,12);
	},
	
	// render conversations
	renderConversations: function() {
		for(script of this.scripts) {
			if(script.type == "npc_default_speech") {
				var frame = script.pointer;
				var progress = script.tick_progress;

				var npc = this.find_npc_by_guid(script.owner);
				var loc_x = npc.loc.x;
				var loc_y = npc.loc.y - 16;
				
				this.gfx.font = '8px sans-serif';
				this.gfx.fillStyle = 'rgba(255,255,255,'+(1.00-script.tick_progress)+')';
				this.gfx.strokeStyle = 'rgba(128,128,128,'+(1.00-script.tick_progress)+')';
				this.gfx.beginPath();
				this.gfx.moveTo(loc_x,loc_y);
				this.gfx.lineTo(20, 14);
				this.gfx.stroke();
				this.gfx.fillText(script.actions[frame],10,10);
			}
			if(script.type == "talk_script") {
				var frame = script.pointer;
				var progress = script.tick_progress;

				var npc = this.find_npc_by_guid(script.owner);
				var loc_x = npc.loc.x;
				var loc_y = npc.loc.y - 16;
				
				this.gfx.font = '8px sans-serif';
				this.gfx.fillStyle = 'rgba(255,255,255,'+(1.00-script.tick_progress)+')';
				this.gfx.strokeStyle = 'rgba(128,128,128,'+(1.00-script.tick_progress)+')';
				this.gfx.beginPath();
				this.gfx.moveTo(loc_x,loc_y);
				this.gfx.lineTo(20, 14);
				this.gfx.stroke();
				this.gfx.fillText(script.actions[frame],10,10);
			}
			if(script.type == "loot_message") {
				var frame = script.pointer;
				var progress = script.tick_progress;

				this.gfx.font = '8px sans-serif';
				this.gfx.fillStyle = 'rgba(255,255,0,'+(1.00-script.tick_progress)+')';
				this.gfx.fillText(script.actions[frame],10,20);
			}
		}
	},
	// functions --------------------------------------------------------------------
	
	
	
	// animation loop ---------------------------------------------------------------
	moveAll: function(time) {
		var elapsed = time - GAME_WORLD.last_tick;
		
		// move all the things!
		
		// move player
		this.movePlayer(time);
	},
	
	transition_to_map: function(new_map) {
		// clean out objects
		this.objects = [];
		
		// add new objects
		var map_objects = this.map_defs.list[new_map].objects;
		
		for(obj of map_objects) {
			// check if object should spawn
			// this.player_check_event(obj)
			if(((obj.no_respawn) && !this.player_check_event(obj)) || (!obj.no_respawn)) {
				var this_frame = 0;
				if(typeof obj.open_event != 'undefined') {
					if(typeof this.player.EVENTS[obj.open_event] != 'undefined') {
						this_frame = 1;
					}
				}
				
				this.objects.push({
					DESTROY_THIS: false,
					type: obj.type,
					guid: obj.guid,
					thing_id: obj.thing_id,
					unique: obj.unique,
					no_respawn: obj.no_respawn,
					collides: obj.collides,
					stance: 0,
					facing: obj.facing,
					frame: this_frame,
					next_animate_tick: 0,
					open_event: obj.open_event,
					loc: {
						map: new_map,
						x: obj.loc_x,
						y: obj.loc_y,
					},
					vel: {x:0,y:0},
					accel: {x:0,y:0},
				});
			}
		}
		
		// clean out npcs
		this.npcs = [];
		
		// add new npcs
		var map_npcs = this.map_defs.list[new_map].npcs;
		
		for(npc of map_npcs) {
			// check if NPC should spawn
			if(((npc.no_respawn) && !this.player_check_event(npc)) || (!npc.no_respawn)) {
				var this_frame = 0;
				if(typeof npc.open_event != 'undefined') {
					if(typeof this.player.EVENTS[npc.open_event] != 'undefined') {
						this_frame = 1;
					}
				}
				
				this.npcs.push({
					DESTROY_THIS: false,
					name: npc.name,
					guid: npc.guid,
					npc_id: npc.npc_id,
					unique: npc.unique,
					no_respawn: npc.no_respawn,
					stance: 0,
					facing: npc.facing,
					frame: this_frame,
					next_animate_tick: 0,
					default_speech: npc.default_speech,
					talk_events: npc.talk_events,
					aggro_event: npc.aggro_event,
					kill_event: npc.kill_event,
					loc: {
						map: new_map,
						x: npc.loc_x,
						y: npc.loc_y,
					},
					vel: {x:0,y:0},
					accel: {x:0,y:0},
				});
			}
		}
		
		
		// clean out scripts? revisit later for persist scripts
		this.scripts = [];
		
		
		// update map number and name!
		document.getElementById('editor_map').value = this.player.loc.map;
		document.getElementById('editor_map_name').value = this.map_defs.list[this.player.loc.map].name;
		
	},
	
	movePlayer: function(time){
		var elapsed = time - GAME_WORLD.last_tick;
		var dx = 0;
		var dy = 0;
		
		// check controls
		if(this.controls.sprint == 1) {
			this.player.sprinting = true;
		}
		if(this.controls.sprint == 0) {
			this.player.sprinting = false;
		}
		if(this.controls.left == 1) {
			dx = -1;
			this.player.facing = 1;
			this.player.stance = 1;
		}
		if(this.controls.right == 1) {
			dx = 1;
			this.player.facing = 0;
			this.player.stance = 1;
		}
		if(this.controls.left == 1 && this.controls.right == 1) {
			dx = 0;
			this.player.stance = 0;
			this.player.frame = 0;
		}
		if(this.controls.left == 0 && this.controls.right == 0) {
			dx = 0;
			this.player.stance = 0;
			this.player.frame = 0;
		}
		if(this.controls.up == 1) {
			dy = -1;
		}
		if(this.controls.down == 1) {
			dy = 1;
		}
		if(this.controls.up == 1 && this.controls.down == 1) {
			dy = 0;
		}
		if(this.controls.float_on == 1) {
			this.player.FLOATING = false;
		}
		if(this.controls.float_off == 1) {
			this.player.FLOATING = true;
		}


		// find tile and edge information
		var tx = Math.floor(this.player.loc.x / 8);
		var ty = Math.floor(this.player.loc.y / 8);
		var mx = Math.floor(this.player.loc.x % 8);
		var my = Math.floor(this.player.loc.y % 8);
		var tile_behind = this.find_tile_behind(this.player);
		var tile_under = this.find_tile_under(this.player);


		// handle UP control
		if(this.controls.up == 1) {
			// check for NPC to talk to?
			var npcs_behind = this.find_npcs_behind(this.player);
			if(npcs_behind.length > 0) {
				//console.log(npcs_behind);
				for(npc of npcs_behind) {
					var did_talk_event = false;
					if(npc.talk_events) {
						for(tk_evt_id of npc.talk_events) {
							var evt = this.find_map_event_by_guid(tk_evt_id);
							if(this.is_event_satisfied(evt)) {
								if(evt.one_time == true && this.player_check_event(evt)) {
									// do nothing - one time events don't trigger another time
									if(this.find_active_script_by_guid(evt.guid)) { // check if it's still active
										did_talk_event = true;
									}
								} else {
									if(!this.find_active_script_by_guid(evt.guid)) {
										if(evt.one_time == true) {
											this.player_add_event(evt);
										}
										this.add_npc_talk_script(npc,evt,time);
									}
									did_talk_event = true;
								}
							}
						}
					}
					if(!did_talk_event && npc.default_speech) {
						this.add_default_npc_speech_script(npc,time);
					}
				}
			}
			
			// check for door up?
			var event_behind = this.find_event_behind(this.player);	
			if(event_behind != null) {
				if(event_behind.type == 'door_up') {
					var has_key = false;
					
					if(event_behind.key_item > -1) {
						if(!this.player_check_event(event_behind)) {
							if(this.player_can_consume(event_behind.key_item)) {
								has_key = true;
								this.player_add_event(event_behind);
							}
						} else {
							has_key = true;
						}
					} 
					if(event_behind.key_special > -1) {
						if(this.player_is_carrying_special(event_behind.key_special)) {
							if(!this.player_check_event(event_behind)) {
								has_key = true;
								this.player_add_event(event_behind);
							} else {
								has_key = true;
							}
						}
					}
					
					// check if we can open this door
					if((!event_behind.locked) || (event_behind.locked && has_key)) {					
						this.player.loc.map = event_behind.target.map;
						this.player.loc.x = event_behind.target.x;
						this.player.loc.y = event_behind.target.y;
						this.transition_to_map(this.player.loc.map);
						this.player.slope_left = false;
						this.player.slope_right = false;
						this.player.falling = false;
						this.player.vel.x = 0;
						this.player.vel.y = 0;
						this.player.accel.x = 0;
						this.player.accel.y = 0;
					}
				}
			}
			
			
			// handle stairs?
			if(this.player.slope_left) {
				dx = 1;
				this.player.facing = 0;
				this.player.stance = 1;
			}
			if(this.player.slope_right) {
				dx = -1;
				this.player.facing = 1;
				this.player.stance = 1;
			}
			if(tile_behind.slope_left && !this.player.slope_left) {
				this.player.slope_left = true;
				this.player.facing = 0;
				this.player.stance = 1;
				this.player.falling = false;
				var ty = Math.floor(this.player.loc.y / 8) * 8 + 7;
				this.player.loc.y = ty - (mx + 1);
				dx = 1;
			}
			if(tile_behind.slope_right && !this.player.slope_right) {
				this.player.slope_right = true;
				this.player.facing = 1;
				this.player.stance = 1;
				this.player.falling = false;
				var ty = Math.floor(this.player.loc.y / 8) * 8 + 7;
				this.player.loc.y = ty - (8 - mx);
				dx = -1;
			}



			// handle ladder?
			if(this.player.climbing) {
				dy = -1;
				this.player.falling = false;
			}
			if(tile_behind.can_climb && !this.player.climbing) {
				dy = -1;
				dx = 0;
				this.player.accel.x = 0;
				this.player.vel.x = 0;
				this.player.vel.y = 0;
				this.player.falling = false;
				this.player.climbing = true;
			}
		}
		if(this.controls.down == 1) {
			// door down
			var event_behind = this.find_event_behind(this.player);	
			if(event_behind != null) {
				if(event_behind.type == 'door_down') {
					var has_key = false;
					
					if(event_behind.key_item > -1) {
						if(!this.player_check_event(event_behind)) {
							if(this.player_can_consume(event_behind.key_item)) {
								has_key = true;
								this.player_add_event(event_behind);
							}
						} else {
							has_key = true;
						}
					} 
					if(event_behind.key_special > -1) {
						if(this.player_is_carrying_special(event_behind.key_special)) {
							if(!this.player_check_event(event_behind)) {
								has_key = true;
								this.player_add_event(event_behind);
							} else {
								has_key = true;
							}
						}
					}
					
					// check if we can open this door
					if((!event_behind.locked) || (event_behind.locked && has_key)) {
						this.player.loc.map = event_behind.target.map;
						this.player.loc.x = event_behind.target.x;
						this.player.loc.y = event_behind.target.y;
						this.transition_to_map(this.player.loc.map);
						this.player.slope_left = false;
						this.player.slope_right = false;
						this.player.falling = false;
						this.player.vel.x = 0;
						this.player.vel.y = 0;
						this.player.accel.x = 0;
						this.player.accel.y = 0;
					}
				}
			}
			
			
			// check for chest?
			var objects_behind = this.find_objects_behind(this.player);
			var all_events = this.map_defs.list[this.player.loc.map].events;
			for(obj of objects_behind) {
				var objd = this.object_defs.list[obj.thing_id];
				for(evt of all_events) {
					if(typeof obj.open_event !='undefined') {
						if(evt.guid == obj.open_event) {
							// open chest?
							if((!evt.locked) || (evt.locked && this.player_can_consume(evt.key_item))) {
								 if(!this.player_check_event(evt)) {
									this.player_add_event(evt);
									obj.frame = 1;
									
									// loot chest!
									if(evt.loot.length > 0) {
										for(lt of evt.loot) {
											this.player_add_item(lt,evt.guid);
										}
									}
								 } else {
									 // nothing happens?
								 }
							} else {
								// nothing happens?
							}
						}
					}
				}
			}
			
			
			
			// handle stairs?
			if(this.player.slope_left) {
				dx = -1;
				this.player.facing = 1;
				this.player.stance = 1;
			}
			if(this.player.slope_right) {
				dx = 1;
				this.player.facing = 0;
				this.player.stance = 1;
			}
			if(tile_under.slope_left && !this.player.slope_left && !this.player.falling) {
				this.player.slope_left = true;
				this.player.facing = 1;
				this.player.stance = 1;
				this.player.falling = false;
				var ty = Math.floor(this.player.loc.y / 8) * 8 + 7;
				this.player.loc.y = ty + (7 - mx) + 1;
				dx = -1;
			}
			if(tile_under.slope_right && !this.player.slope_right && !this.player.falling) {
				this.player.slope_right = true;
				this.player.facing = 0;
				this.player.stance = 1;
				this.player.falling = false;
				var ty = Math.floor(this.player.loc.y / 8) * 8 + 7;
				this.player.loc.y = ty + mx + 1;
				dx = 1;
			}



			// handle ladder down?
			if(this.player.climbing) {
				dy = 1;
				this.player.falling = false;
			}
			if(tile_under.can_climb && !this.player.climbing) {
				dy = 1;
				dx = 0;
				this.player.accel.x = 0;
				this.player.vel.x = 0;
				this.player.vel.y = 0.5;
				this.player.falling = false;
				this.player.climbing = true;
			}
		}
		
		
		// check for jump
		if(this.controls.jump == 1) {
			if(!this.player.falling) {
				//console.log('jumped');
				this.player.falling = true;
				this.player.slope_left = false;
				this.player.slope_right = false;
				this.player.climbing = false;
				
				if(this.controls.down == 0) { // if not holding down
					this.player.vel.y = -1; // -1;
					if(Math.abs(this.player.vel.x) > 500/1000) {
						if(this.player.high_jump) {
							this.player.vel.y = -1.3;
						} else {
							this.player.vel.y = -1.17; // -1.15;
						}
					}
				} else {
					if(tile_under.stand_on && !tile_under.solid) { // jump down if ground has stand_on but not solid!
						this.player.vel.y = 1;
					}
				}
			}
		}
		
		
		
		
		// horizontal acceleration
		if(dx != 0) { // is accelerating
			if(this.player.falling == true) {
				this.player.accel.x = dx * (elapsed / 1000) * (50 / 1000);
			} else { // ground acceleration
				this.player.accel.x = dx * (elapsed / 1000) * (100 / 1000);			
			}
		} else { // stopped accelerating
			this.player.accel.x = 0;
		}
		
		// vertical acceleration - controlled?
		if(this.player.flying || this.player.climbing || this.player.FLOATING) { // player is flying or climbing
			if(dy != 0) { // is accelerating
				this.player.accel.y = dy * (elapsed / 1000) * (1400 / 1000);
			} else { // stopped accelerating
				this.player.accel.y = 0;
			}
		// vertical acceleration - falling?
		} else if(this.player.falling == true) { // player is falling
			if(!this.player.FLOATING) { // immortal float?
				this.player.accel.y = (elapsed / 1000) * (2500 / 1000);
			}
		} else {
			this.player.accel.y = 0;
		}
		
		
		
		
		// velocity x
		if(this.player.accel.x != 0) { // accelerating? go faster!
			this.player.vel.x += (this.player.accel.x * elapsed);
			if(this.player.sprinting == true) {
				if(this.player.vel.x < -900/1000) {
					this.player.vel.x = -900/1000; // 900/1000 running speed 
				}
				if(this.player.vel.x > 900/1000) {
					this.player.vel.x = 900/1000;
				}
			} else {
				if(this.player.vel.x < -500/1000) {
					this.player.vel.x = -500/1000; // 450/1000 walking speed 
				}
				if(this.player.vel.x > 500/1000) {
					this.player.vel.x = 500/1000;
				}
			}
		} else { // stopped accelerating/moving? apply friction!
			if(!this.player.falling) {
				this.player.vel.x /= 2;
			}
		}
		
		// velocity y
		if(this.player.accel.y != 0) { // accelerating? go faster!
			this.player.vel.y += this.player.accel.y;
			if(this.player.vel.y < -550/1000 && this.player.climbing) {
				this.player.vel.y = -550/1000;
			}
			if(this.player.vel.y > 550/1000 && this.player.climbing) {
				this.player.vel.y = 550/1000;
			}
		} else { // stopped accelerating/moving? apply friction!
			this.player.vel.y /= 2;
		}
		
		
		
		
		// COLLISION
		// check ceiling!
		if(this.player.vel.y < 0) {
			this.player.collide_to_ceiling();
		}
		
		// check boundaries
		this.player.collide_to_boundaries();
		
		// check wall
		this.player.collide_to_wall();

		// check objects!
		this.player.collide_to_objects();
		
		// check collision to events - for tile triggers/map exits
		this.player.collide_to_events();


		// location x
		this.player.loc.x += this.player.vel.x;
		
		// location y - controlled
		if(this.player.flying || this.player.falling || this.player.climbing) {
			this.player.loc.y += this.player.vel.y;
		} else if(this.player.slope_left || this.player.slope_right) {
			if(this.player.slope_left) {
				if(this.player.vel.x > 0) {
					this.player.loc.y -= Math.abs(this.player.vel.x);
				} else {
					this.player.loc.y += Math.abs(this.player.vel.x);
				}
			} else if(this.player.slope_right) {
				if(this.player.vel.x < 0) {
					this.player.loc.y -= Math.abs(this.player.vel.x);
				} else {
					this.player.loc.y += Math.abs(this.player.vel.x);
				}
			}
		}


		
		// check falling/climbing/stairs state
		if(this.player.falling) {
			// check if we're going to land
			this.player.collide_to_floor();
		} else if (this.player.climbing) {
			// check if still on ladder
			this.player.climbing_ladder();
			if(!this.player.climbing) {
				if(this.player.vel.y < 0) {
					this.player.loc.y -= 1;
				} else {
					this.player.standing_on_floor();
				}
			}
			if(this.player.vel.y > 0) {
				this.player.standing_on_floor();
			}
		} else if(this.player.slope_left || this.player.slope_right) {
			// check if still on stairs
			this.player.climbing_stairs();
			if(!this.player.slope_left && !this.player.slope_right) { // if we reached the top of the stairs and there aren't any more stairs
				this.player.loc.y -= 1;
				this.player.loc.x += Math.sign(this.player.vel.x);
				this.player.standing_on_floor();
			} else {
				// figure the Y coordinate for the stair we're on??? (maybe not necessary)
			}
		} else {
			// check if still on the ground
			this.player.standing_on_floor();
			
			// check if climbing ramp
			if(this.player.starting_left_ramp) {
				this.player.starting_left_ramp = false;
				this.player.slope_left = true;
			}
			if(this.player.starting_right_ramp) {
				this.player.starting_right_ramp = false;
				this.player.slope_right = true;
			}
		}
	},
	
	animateAll: function(time) {
		// water animation - setup
		if(GAME_WORLD.water_tick == 0) {
			GAME_WORLD.water_tick = time;
		}
		
		// water animation - handling
		if(time > GAME_WORLD.water_tick) {
			GAME_WORLD.water_frame += 1;
			if(GAME_WORLD.water_frame > 7) {
				GAME_WORLD.water_frame -= 8;
			}
			
			// 200ms water animation time
			GAME_WORLD.water_tick = time + 200; 
		}
		
		
		// animate all the things!
		this.animatePlayer(time);
		this.animateNpcs(time);
		this.animateObjects(time);
		this.animateConversations(time);
	},
	
	animatePlayer: function(time) {
		// player animation - setup
		if(this.player.next_animate_tick == 0) {
			this.player.next_animate_tick = time + 120;
		}
		var elapsed = time - GAME_WORLD.last_tick;
		
		switch(this.player.stance) {
			case 0: // idle
				break;
			case 1: // walking/running
				if(time > this.player.next_animate_tick) {
					this.player.frame++;
					if(this.player.frame > 3) {
						this.player.frame = 0;
					}
					
					// if moving faster than 330/1000 pix/ms
					if(this.player.slope_left || this.player.slope_right) {
						this.player.next_animate_tick = time + 150;
					} else if(Math.abs(this.player.vel.x) > 500/1000) {
						this.player.next_animate_tick = time + 120;
					} else {
						this.player.next_animate_tick = time + 180;
					}
				}
				break;
		}
	},
	animateNpcs: function(time) {
		for(npc of this.npcs) {
			var npc_def = this.npc_defs.list[npc.npc_id];
			if(npc_def.flags.indexOf('inanimate') < 0) {
				this.animateNpc(npc,time);
			}
			
		}
	},
	animateNpc: function(obj,time) {
		// player animation - setup
		if(obj.next_animate_tick == 0) {
			obj.next_animate_tick = time + 120;
		}
		var elapsed = time - GAME_WORLD.last_tick;
		
		switch(obj.stance) {
			case 0: // idle
				break;
			case 1: // walking/running
				if(time > obj.next_animate_tick) {
					obj.frame++;
					if(obj.frame > 3) {
						obj.frame = 0;
					}
					
					// if moving faster than 330/1000 pix/ms
					if(obj.slope_left || obj.slope_right) {
						obj.next_animate_tick = time + 150;
					} else if(Math.abs(obj.vel.x) > 500/1000) {
						obj.next_animate_tick = time + 120;
					} else {
						obj.next_animate_tick = time + 180;
					}
				}
				break;
		}
	},
	animateObjects: function(time) {
		for(obj of this.objects) {
			var obj_def = this.object_defs.list[obj.thing_id];
			if(obj_def.flags.indexOf('animated') > -1) {
				this.animateObject(obj,time);
			}
		}
	},
	animateObject: function(obj,time) {
		var obj_def = this.object_defs.list[obj.thing_id];
		if(obj.next_animate_tick == 0) {
			obj.next_animate_tick = time + 200;
		}
		
		if(time > obj.next_animate_tick) {
			var frame_count = GAME_WORLD.sprite_defs.list[obj_def.sprite].frames[obj.stance][obj.facing].length;
			obj.frame++;
			if(obj.frame>=frame_count) {
				obj.frame = 0;
			}

			obj.next_animate_tick = time + 200;
		}
	},
	cleanConversations: function() {
		for(lp in this.scripts) {
			if(this.scripts[lp].DESTROY_THIS && !this.scripts[lp].persist) {
				this.scripts.splice(lp,1);
			}
		}
	},
	animateConversations: function(time) {
		for(script of this.scripts) {
			if(script.type == "npc_default_speech" || script.type == "talk_script" || script.type == "loot_message") {
				if(time > script.next_tick) {
					if(script.pointer < (script.actions.length - 1)) {
						script.pointer++;
						script.next_tick = time + 5000;
					} else {
						script.DESTROY_THIS = true;
					}
				} else {
					var last_time = script.next_tick - 5000;
					var dif = time - last_time;
					var pct = dif / 5000;
					script.tick_progress = pct;
				}
			}
		}
	},


	
	game_loop: function(time) {
		// everything animation - setup
		if(GAME_WORLD.last_tick == 0) {
			GAME_WORLD.last_tick = time;
		}
		
		// move everything!
		GAME_WORLD.moveAll(time);
		
		// deal with collisions with objects
		GAME_WORLD.cleanObjects();
		GAME_WORLD.cleanNpcs();
		
		// dispose of finished conversations
		GAME_WORLD.cleanConversations();
		
		// animate everything!
		GAME_WORLD.animateAll(time);
		
		// redraw everything!
		GAME_WORLD.renderAll();
		
		// update last 
		GAME_WORLD.last_tick = time;
		
		// request next frame!
		if(GAME_WORLD.game_state != 99) {
			window.requestAnimationFrame(GAME_WORLD.game_loop);
		}
	},
	// animation loop ---------------------------------------------------------------
	
	

	// init game - this needs to be last!
	init: function() {
		// get data
		this.get_sprite_data();
		
		// set up canvas
		this.canvas = document.getElementById('game_canvas');
		this.canvas.width = 400;//800;
		this.canvas.height = 192;//384;
		this.tileset = document.getElementById('game_tiles');
		this.gfx = this.canvas.getContext('2d');
		//this.canvas.style.width = "";
		//this.canvas.style.height = "";
		
		
		// EDITOR STUFF!!! ---------------------------------------------------------------------------------------------------------
		this.EDITOR = {
			draw_mode: 1, // 0 - erase, 1 - draw
			draw_layer: 0, // 0 - background, 1 - world, 2 - foreground
			tile_selected: 0, // tile ID
			object_selected: 0, // object ID
			npc_selected: 0, // NPC ID
			scale: 4,
			view_events: false,
			MOUSEDOWN_LEFT: false,
			MOUSEDOWN_RIGHT: false,
			mouse_clicked: {
				x: 0,
				y: 0,
			},
			canvas: null,
			gfx: null,
			object_canvas: null,
			object_gfx: null,
		}; // editor added stuff
		this.EDITOR.canvas = document.getElementById('editor_canvas');
		this.EDITOR.canvas.width = 8 * 8;
		this.EDITOR.canvas.height = 20 * 8;
		this.EDITOR.object_canvas = document.getElementById('object_canvas');
		this.EDITOR.object_canvas.width = 50 * 8;
		this.EDITOR.object_canvas.height = 2 * 8;
		this.EDITOR.gfx = this.EDITOR.canvas.getContext('2d');
		this.EDITOR.object_gfx = this.EDITOR.object_canvas.getContext('2d');
		// launch event editor
		this.EDITOR.edit_event = function(evt,tile_map,tile_x,tile_y) {
			if(evt != null) { // edit existing event
				// plug values into fields
				document.getElementById('editor_event_guid').value = evt.guid;
				document.getElementById('editor_event_type').value = evt.type;
				document.getElementById('editor_event_tile_x').value = evt.tile_x;
				document.getElementById('editor_event_tile_y').value = evt.tile_y;
				document.getElementById('editor_event_one_time').value = evt.one_time?1:0;
				document.getElementById('editor_event_hidden').value = evt.hidden?1:0;
				document.getElementById('editor_event_locked').value = evt.locked?1:0;
				document.getElementById('editor_event_key_item').value = evt.key_item;
				document.getElementById('editor_event_key_special').value = evt.key_special;
				document.getElementById('editor_event_target_map').value = evt.target.map;
				document.getElementById('editor_event_target_x').value = evt.target.x;
				document.getElementById('editor_event_target_y').value = evt.target.y;
				
				// show modal
				document.getElementById('editor_event_modal').style.display = "block";
			} else { // edit new event
				// plug values into fields
				document.getElementById('editor_event_guid').value = "";
				document.getElementById('editor_event_type').value = "";
				document.getElementById('editor_event_tile_x').value = tile_x;
				document.getElementById('editor_event_tile_y').value = tile_y;
				document.getElementById('editor_event_one_time').value = 0;
				document.getElementById('editor_event_hidden').value = 0;
				document.getElementById('editor_event_hidden').value = 0;
				document.getElementById('editor_event_locked').value = 0;
				document.getElementById('editor_event_key_item').value = -1;
				document.getElementById('editor_event_key_special').value = -1;
				document.getElementById('editor_event_target_map').value = 0;
				document.getElementById('editor_event_target_x').value = 0;
				document.getElementById('editor_event_target_y').value = 0;
				
				// show modal
				document.getElementById('editor_event_modal').style.display = "block";
			}
		};
		
		// add new object to map via editor
		this.EDITOR.add_map_object = function(object_id,new_map,nx,ny) {
			var obj_def = GAME_WORLD.object_defs.list[object_id];
			
			GAME_WORLD.player.OBJECT_COLLISIONS = false;
			
			// add object to map def
			var new_map_obj = {
				guid: '',
				unique: false,
				no_respawn: false,
				loc_x: Math.floor(nx),
				loc_y: Math.floor(ny),
				facing: 0,
				thing_id: object_id,
				collides: true,
			};
			GAME_WORLD.map_defs.list[new_map].objects.push(new_map_obj);

			// add object to game
			var new_obj = {
				DESTROY_THIS: false,
				type: obj_def.type,
				guid: new_map_obj.guid,
				thing_id: new_map_obj.thing_id,
				unique: new_map_obj.unique,
				no_respawn: new_map_obj.no_respawn,
				collides: new_map_obj.collides,
				stance: 0,
				facing: new_map_obj.facing,				
				frame: 0,
				next_animate_tick: 0,
				loc: {
					map: new_map,
					x: nx,
					y: ny,
				},
				vel: {x:0,y:0},
				accel: {x:0,y:0},
			};
			GAME_WORLD.objects.push(new_obj);
			
		};
		
		// render editor
		this.EDITOR.render = function() {
			// clear
			GAME_WORLD.EDITOR.gfx.fillStyle = "#000030";
			GAME_WORLD.EDITOR.gfx.fillRect(0,0,GAME_WORLD.EDITOR.canvas.width,GAME_WORLD.EDITOR.canvas.height);
			GAME_WORLD.EDITOR.object_gfx.fillStyle = "#000030";
			GAME_WORLD.EDITOR.object_gfx.fillRect(0,0,GAME_WORLD.EDITOR.object_canvas.width,GAME_WORLD.EDITOR.object_canvas.height);
			
			// grab tiles
			var source_image = document.getElementById('game_tiles');
			
			// paint all tiles into the canvas
			var tile_count = GAME_WORLD.tile_defs.list.length;
			var tile_counter = 0;
			for(tiledef of GAME_WORLD.tile_defs.list) {
				var aframe = tiledef.frame;
				var tile_row = Math.floor(tile_counter / 8);
				var tile_col = tile_counter % 8;
				var ty = tile_row * 8;
				var tx = tile_col * 8;
				GAME_WORLD.EDITOR.gfx.drawImage(source_image,aframe[0],aframe[1],8,8,tx,ty,8,8);
				
				// highlight the selected tile
				if(tile_counter == GAME_WORLD.EDITOR.tile_selected) {
					GAME_WORLD.EDITOR.gfx.strokeStyle = "#800000";
					GAME_WORLD.EDITOR.gfx.strokeRect(tx,ty,8,8);
				}
				
				tile_counter++;
			}
			
			
			
			
			// grab objects
			var objs = GAME_WORLD.object_defs.list;
			
			// paint objects onto the canvas
			var x_counter = 8;
			for(obj of objs) {
				var obj_sprite = GAME_WORLD.sprite_defs.list[obj.sprite];
				
				var aframe = obj_sprite.frames[0][0][0];
				var s_width = aframe[2] - aframe[0] + 1;
				var s_height = aframe[3] - aframe[1] + 1;
				var loc_lx = x_counter - (aframe[4] - aframe[0]); // origin_x - left
				var loc_rx = x_counter - (aframe[4] - aframe[2]); // origin_x - right
				var loc_y = 15 - (aframe[5] - aframe[1]); // origin_y - top
				var b_y = 15 - (aframe[5] - aframe[3]); // origin_y - bottom
				
				this.object_gfx.drawImage(source_image,aframe[0],aframe[1],s_width,s_height,loc_lx,loc_y,s_width,s_height);
				x_counter += 16;
			}
			
			
			
			// render events?
			if(GAME_WORLD.EDITOR.view_events == true) {
				var event_list = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].events;
				
				for(evt of event_list) {
					var loc_x = evt.tile_x * 8;
					var loc_y = evt.tile_y * 8;
					GAME_WORLD.gfx.strokeStyle = "#c0c000";
					GAME_WORLD.gfx.strokeRect(loc_x,loc_y,8,8);
				}
			}
			
			// render player location
			document.getElementById('editor_location_x').innerHTML = parseInt(GAME_WORLD.player.loc.x);
			document.getElementById('editor_location_y').innerHTML = parseInt(GAME_WORLD.player.loc.y);
			
			// render map id and name
			//document.getElementById('editor_map').value = GAME_WORLD.player.loc.map;
			//document.getElementById('editor_map_name').value = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].name;
			
			// render object canvas
			
		};
		// select a tile if clicked in the editor window!
		this.EDITOR.canvas.addEventListener('mousedown',(e)=>{
			var tile_x = Math.floor(e.layerX / (8 * GAME_WORLD.EDITOR.scale));
			var tile_y = Math.floor(e.layerY / (8 * GAME_WORLD.EDITOR.scale));
			
			// select this tile!
			var selected_tile = tile_y * 8 + tile_x;
			
			GAME_WORLD.EDITOR.tile_selected = selected_tile;
		});
		// select an object if clicked in the editor window!
		this.EDITOR.object_canvas.addEventListener('mousedown',(e)=>{
			var object_id = Math.floor(e.layerX / (16 * GAME_WORLD.EDITOR.scale));
			console.log(object_id);
			
			GAME_WORLD.EDITOR.add_map_object(object_id,GAME_WORLD.player.loc.map,GAME_WORLD.player.loc.x,GAME_WORLD.player.loc.y);
			
			// select this tile!
			//var selected_object = tile_y * 8 + tile_x;
			
			//GAME_WORLD.EDITOR.object_selected = selected_object;
		});
		
		
		// listen for mouse events?
		document.addEventListener('contextmenu',(e)=>{
			// block contextual menu so it doesn't interrupt the game!
			e.preventDefault();
		});
		this.canvas.addEventListener('mousedown',(e)=>{
			e.preventDefault();
			if(e.button == 0) {
				GAME_WORLD.EDITOR.MOUSEDOWN_LEFT = true;
				//console.log(e);
				var tile_x = Math.floor(e.layerX / (8 * GAME_WORLD.EDITOR.scale));
				var tile_y = Math.floor(e.layerY / (8 * GAME_WORLD.EDITOR.scale));
				GAME_WORLD.EDITOR.mouse_clicked = {x:e.layerX,y:e.layerY};
				//console.log({x:tile_x,y:tile_y});
				//console.log(this.EDITOR);
				
				// if eyedropper
				if(e.shiftKey == true) {
					var tile_array = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x];
					GAME_WORLD.EDITOR.tile_selected = tile_array[GAME_WORLD.EDITOR.draw_layer];
				} else {
					switch(this.EDITOR.draw_mode) {
					// if drawing
					case 1:
						GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x][GAME_WORLD.EDITOR.draw_layer] = GAME_WORLD.EDITOR.tile_selected;
						break;
					// else if erasing
					default:
						GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x][GAME_WORLD.EDITOR.draw_layer] = 0;
						break;
					}
				}
			}
			if(e.button == 2) {
				GAME_WORLD.EDITOR.MOUSEDOWN_RIGHT = true;
				var tile_x = Math.floor(e.layerX / (8 * GAME_WORLD.EDITOR.scale));
				var tile_y = Math.floor(e.layerY / (8 * GAME_WORLD.EDITOR.scale));
				GAME_WORLD.EDITOR.mouse_clicked = {x:e.layerX,y:e.layerY};
				var the_event = GAME_WORLD.find_event_behind({loc:{x:tile_x*8,y:tile_y*8}});
				
				// if eyedropper
				if(e.shiftKey == true) {
					// does nothing?
				} else {
					switch(this.EDITOR.draw_mode) {
					// if drawing
					case 1:
						// create new event if there isn't one here, otherwise edit the one that's here
						this.EDITOR.edit_event(the_event,this.player.loc.map,tile_x,tile_y);
						break;
					// else if erasing
					default:
						// remove event from map's list?
						break;
					}
				}
			}
		});
		this.canvas.addEventListener('mousemove',(e)=>{
			if(GAME_WORLD.EDITOR.MOUSEDOWN_LEFT) {
				var tile_x = Math.floor(e.layerX / (8 * GAME_WORLD.EDITOR.scale));
				var tile_y = Math.floor(e.layerY / (8 * GAME_WORLD.EDITOR.scale));
				GAME_WORLD.EDITOR.mouse_clicked = {x:e.layerX,y:e.layerY};
				
				// if eyedropper
				if(e.shiftKey == true) {
					var tile_array = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x];
					GAME_WORLD.EDITOR.tile_selected = tile_array[GAME_WORLD.EDITOR.draw_layer];
				} else {
					switch(this.EDITOR.draw_mode) {
					// if drawing
					case 1:
						GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x][GAME_WORLD.EDITOR.draw_layer] = GAME_WORLD.EDITOR.tile_selected;
						break;
					// else if erasing
					default:
						GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[tile_y][tile_x][GAME_WORLD.EDITOR.draw_layer] = 0;
						break;
					}
				}
			}
		});
		this.canvas.addEventListener('mouseup',(e)=>{
			if(e.button == 0) {
				GAME_WORLD.EDITOR.MOUSEDOWN_LEFT = false;
			}
			if(e.button == 2) {
				GAME_WORLD.EDITOR.MOUSEDOWN_RIGHT = false;
			}
		});
		this.canvas.addEventListener('mouseout',(e)=>{
			GAME_WORLD.EDITOR.MOUSEDOWN_LEFT = false;
			GAME_WORLD.EDITOR.MOUSEDOWN_RIGHT = false;								
		});
		document.getElementById('editor_draw_layer').addEventListener('change',(e)=>{
			GAME_WORLD.EDITOR.draw_layer = e.target.value;
		});
		document.getElementById('editor_view_events').addEventListener('change',(e)=>{
			if(e.target.checked == true) {
				GAME_WORLD.EDITOR.view_events = true;
			} else {
				GAME_WORLD.EDITOR.view_events = false;
			}
		});
		document.getElementById('editor_map_name').addEventListener('change',(e)=>{
			var new_name = e.target.value;
			GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].name = new_name;
		});
		document.getElementById('editor_map_name').addEventListener('focus',(e)=>{
			GAME_WORLD.player.TYPING = true;
			GAME_WORLD.player.TYPING_BUF = document.getElementById('editor_map_name').value;
		});
		document.getElementById('editor_map_name').addEventListener('blur',(e)=>{
			GAME_WORLD.player.TYPING = false;
		});
		document.getElementById('editor_map_name').addEventListener('keydown',(e)=>{
			console.log(e);
			if(e.keyCode == 13) {
				GAME_WORLD.player.TYPING = false;
				document.getElementById('editor_map_name').blur();
			}
		});
		document.getElementById('editor_map').addEventListener('change',(e)=>{
			var new_value = parseInt(e.target.value);
			var map_count = GAME_WORLD.map_defs.list.length;
			if(new_value < 0) {
				new_value = 0;
			}
			if(new_value >= map_count) {
				GAME_WORLD.player.FLOATING = true; // for safety's sake!
				var new_map = {
					name: 'new map '+new_value,
					tile_grid: [],
					events: [],
					objects: [],
					npcs: [],
				};
				// clean grid for new map!
				for(var lpy=0;lpy<24;lpy++) {
					// new row
					new_map.tile_grid[lpy] = [];
					for(var lpx=0;lpx<50;lpx++) {
						// new column
						new_map.tile_grid[lpy][lpx] = [0,0,0,0];
					}
				}
				// add new map
				GAME_WORLD.map_defs.list[new_value] = new_map;
			}
			
			GAME_WORLD.player.loc.map = new_value;
			document.getElementById('editor_map').value = new_value;
			document.getElementById('editor_map_name').value = GAME_WORLD.map_defs.list[new_value].name;
		});
		document.getElementById('editor_export_map').addEventListener('click',(e)=>{
			e.preventDefault();
			console.log("GAME_WORLD.map_defs.list["+GAME_WORLD.player.loc.map+"] = "+JSON.stringify(GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map])+";");
		});
		
		// events
		document.getElementById('editor_event_cancel').addEventListener('click',(e)=>{
			// cancel - just hide the modal
			document.getElementById('editor_event_modal').style.display = "none";
		});
		document.getElementById('editor_event_update').addEventListener('click',(e)=>{
			// accept - create new event?
			var evt = {
				guid: document.getElementById('editor_event_guid').value,
				type: document.getElementById('editor_event_type').value,
				tile_x: parseInt(document.getElementById('editor_event_tile_x').value),
				tile_y: parseInt(document.getElementById('editor_event_tile_y').value),
				one_time: parseInt(document.getElementById('editor_event_one_time').value)==1?true:false,
				hidden: parseInt(document.getElementById('editor_event_hidden').value)==1?true:false,
				locked: parseInt(document.getElementById('editor_event_locked').value)==1?true:false,
				key_item: document.getElementById('editor_event_key_item').value,
				key_special: document.getElementById('editor_event_key_special').value,
				target: {
					map: parseInt(document.getElementById('editor_event_target_map').value),
					x: parseInt(document.getElementById('editor_event_target_x').value),
					y: parseInt(document.getElementById('editor_event_target_y').value),
				},
			};
			
			// add to list
			// find it first?
			var event_list = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].events;
			var evt_found = false;
			for (evt_id in event_list) {
				if(event_list[evt_id].guid == evt.guid) {
					event_list[evt_id] = evt; // replace event!
					evt_found = true;
				}
			}
			
			// if it wasn't found
			if(!evt_found) {
				// add new event!
				GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].events.push(evt);
			}
			
			// hide the modal
			document.getElementById('editor_event_modal').style.display = "none";
		});
		
		
		// EDITOR STUFF!!! ---------------------------------------------------------------------------------------------------------


		// object array
		this.objects = [];
		
		// npc array
		this.npcs = [];
		
		// effects array
		this.effects = [];
		
		// scripts array
		this.scripts = [];

		// set up game controls
		this.controls = {
			up: 0,
			down: 0,
			left: 0,
			right: 0,
			jump: 0,
			sprint: 0,
			fire1: 0,
			fire2: 0,
			fire3: 0,
		};

		// set up player
		this.player = {
			sprite_id: 0, //22,
			stance: 0,
			facing: 0,
			frame: 0,
			
			next_tick: 0,
			next_animate_tick: 0,
			
			sprinting: false,
			high_jump: false,
			falling: false,
			jumping: false,
			flying: false,
			climbing: false,
			slope_left: false,
			starting_left_ramp: false,
			slope_right: false,
			starting_right_ramp: false,
			FLOATING: false, // immortal float
			OBJECT_COLLISIONS: true, // mortal collides with items
			TYPING: false, // player typing in a text box!
			TYPING_BUF: '',
			
			loc: {
				map: 0,
				x: 32,
				y: 55,
			},
			vel: {
				x: 0,
				y: 0,
			},
			accel: {
				x: 0,
				y: 0,
			},
			
			// stats / items
			stats: [
				{stat:"str",score:10},
				{stat:"dex",score:10},
				{stat:"con",score:10},
				{stat:"int",score:10},
				{stat:"wis",score:10},
				{stat:"cha",score:10},
			],
			inventory: [],
			
			// events array - for handling event flags
			EVENTS: [],
		};
		
		
		// COLLISION
		this.player.collide_to_boundaries = function() {
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var top_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			
			var map_def = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid;
			var x_limit = map_def[0].length * 8 - 2;
			var y_limit = map_def.length * 8 - 2;
			
			if(bl_x < 2 || br_x > x_limit) {
				GAME_WORLD.player.accel.x = 0;
				GAME_WORLD.player.vel.x = 0;
			}
			if(top_y < 2 || bottom_y > y_limit) {
				GAME_WORLD.player.accel.y = 0;
				GAME_WORLD.player.vel.y = 0;
			}
		};
		this.player.climbing_ladder = function() {
			var climbing_ladder = false;
			
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var top_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var bottom_y_tile = Math.floor(bottom_y / 8);
			
			// check bottom left
			var tile_id_at_bl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][bl_x_tile][2];
			var tile_at_bl = GAME_WORLD.tile_defs.list[tile_id_at_bl];
			if(GAME_WORLD.player.climbing && tile_at_bl.can_climb) {
				climbing_ladder = true;
			}
			if(GAME_WORLD.player.climbing && tile_at_bl.can_climb) {
				climbing_ladder = true;
			}
			// check bottom right
			var tile_id_at_br = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][br_x_tile][2];
			var tile_at_br = GAME_WORLD.tile_defs.list[tile_id_at_br];
			if(GAME_WORLD.player.climbing && tile_at_br.can_climb) {
				climbing_ladder = true;
			}
			if(GAME_WORLD.player.climbing && tile_at_br.can_climb) {
				climbing_ladder = true;
			}
			
			
			if(!climbing_ladder) {
				if(GAME_WORLD.player.climbing) {
					GAME_WORLD.player.climbing = false;
				}
			}
		};
		this.player.climbing_stairs = function() {
			var on_slope_left = false;
			var on_slope_right = false;
			
			// figure out if we're on a slope
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[9]);
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var bottom_y_tile = Math.floor(bottom_y / 8);
			
			// check bottom left
			var tile_id_at_bl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][bl_x_tile][2];
			var tile_at_bl = GAME_WORLD.tile_defs.list[tile_id_at_bl];
			if(GAME_WORLD.player.slope_left && tile_at_bl.slope_left) {
				on_slope_left = true;
			}
			if(GAME_WORLD.player.slope_right && tile_at_bl.slope_right) {
				on_slope_right = true;
			}
			// check bottom right
			var tile_id_at_br = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][br_x_tile][2];
			var tile_at_br = GAME_WORLD.tile_defs.list[tile_id_at_br];
			if(GAME_WORLD.player.slope_left && tile_at_br.slope_left) {
				on_slope_left = true;
			}
			if(GAME_WORLD.player.slope_right && tile_at_br.slope_right) {
				on_slope_right = true;
			}
			
			
			if(on_slope_left) { // find height
				GAME_WORLD.player.vel.y = -Math.abs(GAME_WORLD.player.vel.x);
			} else if(on_slope_right) { // find height
				GAME_WORLD.player.vel.y = -Math.abs(GAME_WORLD.player.vel.x);
			} else {
				GAME_WORLD.player.slope_left = false;
				GAME_WORLD.player.slope_right = false;
			}
			
		};
		this.player.collide_to_ceiling = function() {
			var hitting_ceiling = false;
			
			// figure out if we're going to hit the ceiling
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var top_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]) - 1;
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var top_y_tile = Math.floor(top_y / 8);
			
			// check top left
			var tile_id_at_tl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[top_y_tile][bl_x_tile][2];
			var tile_at_tl = GAME_WORLD.tile_defs.list[tile_id_at_tl];
			if(tile_at_tl.solid) {
				hitting_ceiling = true;
			}
			// check top right
			var tile_id_at_tr = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[top_y_tile][br_x_tile][2];
			var tile_at_tr = GAME_WORLD.tile_defs.list[tile_id_at_tr];
			if(tile_at_tr.solid) {
				hitting_ceiling = true;
			}
			
			
			if(hitting_ceiling) { // find height
				if(GAME_WORLD.player.vel.y < 0) {
					GAME_WORLD.player.vel.y = 0;
				}
			}
		};
		this.player.collide_to_wall = function() {
			var hit_wall = false;
			var hit_ramp_left = false;
			var hit_ramp_right = false;
			
			// figure out if we hit a wall
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var top_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var top_y_tile = Math.floor(top_y / 8);
			var bottom_y_tile = Math.floor(bottom_y / 8);
			
			// check corners 
			if(GAME_WORLD.player.vel.x < 0) {
				// check top left
				var tile_id_at_tl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[top_y_tile][bl_x_tile][2];
				var tile_at_tl = GAME_WORLD.tile_defs.list[tile_id_at_tl];
				if(tile_at_tl.solid) {
					hit_wall = true;
				}
				// check bottom left if not on stairs
				if(!GAME_WORLD.player.slope_left && !GAME_WORLD.player.slope_right) {
					var tile_id_at_bl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][bl_x_tile][2];
					var tile_at_bl = GAME_WORLD.tile_defs.list[tile_id_at_bl];
					if(tile_at_bl.solid) {
						hit_wall = true;
					}
					if(tile_at_bl.slope_right) {
						hit_ramp_right = true;
					}
				}
			} else if(GAME_WORLD.player.vel.x > 0) {
				// check top right
				var tile_id_at_tr = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[top_y_tile][br_x_tile][2];
				var tile_at_tr = GAME_WORLD.tile_defs.list[tile_id_at_tr];
				if(tile_at_tr.solid) {
					hit_wall = true;
				}
				// check bottom left if not on stairs
				if(!GAME_WORLD.player.slope_left && !GAME_WORLD.player.slope_right) {
					var tile_id_at_br = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][br_x_tile][2];
					var tile_at_br = GAME_WORLD.tile_defs.list[tile_id_at_br];
					if(tile_at_br.solid) {
						hit_wall = true;
					}
					if(tile_at_br.slope_left) {
						hit_ramp_left = true;
					}
				}
			}

			
			
			// if hit wall
			if(hit_wall) {
				if(hit_ramp_left) { // start climbing left ramp
					GAME_WORLD.player.starting_left_ramp = true;
				}
				else if(hit_ramp_right) { // start climbing right ramp
					GAME_WORLD.player.starting_right_ramp = true;
				} else {
					GAME_WORLD.player.vel.x = 0;
				}
			}
		};
		this.player.collide_to_floor = function() {
			var hitting_floor = false;
			var hitting_slope_left = false;
			var hitting_slope_right = false;
			
			// figure out if the floor is just below us
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[9]) + 1;
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var bottom_y_tile = Math.floor(bottom_y / 8);
			
			// check bottom left
			var tile_id_at_bl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][bl_x_tile][2];
			var tile_at_bl = GAME_WORLD.tile_defs.list[tile_id_at_bl];
			if(tile_at_bl.stand_on) {
				hitting_floor = true;
				var ty = Math.floor(GAME_WORLD.player.loc.y / 8);
				var new_y = ((ty+1) * 8) - 1;
			}
			if(tile_at_bl.solid && tile_at_bl.slope_left) {
				hitting_slope_left = true;
			}
			else if(tile_at_bl.solid && tile_at_bl.slope_right) {
				hitting_slope_right = true;
			}
			
			// check bottom right
			var tile_id_at_br = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][br_x_tile][2];
			var tile_at_br = GAME_WORLD.tile_defs.list[tile_id_at_br];
			if(tile_at_br.stand_on) {
				hitting_floor = true;
				var ty = Math.floor(GAME_WORLD.player.loc.y / 8);
				var new_y = ((ty+1) * 8) - 1;
			}
			if(tile_at_br.solid && tile_at_br.slope_left) {
				hitting_slope_left = true;
			} else if(tile_at_br.solid && tile_at_br.slope_right) {
				hitting_slope_right = true;
			}
			
			var objects = GAME_WORLD.objects;
			for(obj of objects) {
				if(GAME_WORLD.player.precollide_to_object(obj)) {
					var flags = GAME_WORLD.object_defs.list[obj.thing_id].flags;
					if(flags.indexOf('stand_on') > -1) {
						hitting_floor = true;
						var new_y = obj.loc.y - 8;
					}
				}
			}

		
			// if we hit the floor?
			if(hitting_floor && GAME_WORLD.player.vel.y > 0) {
				// falling and about to land?
				GAME_WORLD.player.vel.y = 0;
				GAME_WORLD.player.falling = false;
				
				// set y position!
				GAME_WORLD.player.loc.y = new_y;
			} else if(hitting_slope_left && GAME_WORLD.player.vel.y > 0) {
				GAME_WORLD.player.slope_left = true;
				GAME_WORLD.player.falling = false;
				GAME_WORLD.player.vel.y = 0;
				var ty = Math.floor(GAME_WORLD.player.loc.y / 8);
				var new_y = ((ty + 1) * 8) - 1;
				var mx = Math.floor(GAME_WORLD.player.loc.x % 8);
				GAME_WORLD.player.loc.y = new_y + (7 - mx) - 2;
			} else if(hitting_slope_right && GAME_WORLD.player.vel.y > 0) {
				GAME_WORLD.player.slope_right = true;
				GAME_WORLD.player.falling = false;
				GAME_WORLD.player.vel.y = 0;
				var ty = Math.floor(GAME_WORLD.player.loc.y / 8);
				var new_y = ((ty + 1) * 8) - 1;
				var mx = Math.floor(GAME_WORLD.player.loc.x % 8);
				GAME_WORLD.player.loc.y = new_y + mx - 1;
			}
		};
		this.player.standing_on_floor = function() {
			var hitting_floor = false;
			
			// figure out if the floor is just below us
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var bl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var br_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var bottom_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[9]) + 1;
			var bl_x_tile = Math.floor(bl_x / 8);
			var br_x_tile = Math.floor(br_x / 8);
			var bottom_y_tile = Math.floor(bottom_y / 8);
			
			// check bottom left
			var tile_id_at_bl = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][bl_x_tile][2];
			var tile_at_bl = GAME_WORLD.tile_defs.list[tile_id_at_bl];
			if(tile_at_bl.stand_on) {
				hitting_floor = true;
			}
			// check bottom right
			var tile_id_at_br = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].tile_grid[bottom_y_tile][br_x_tile][2];
			var tile_at_br = GAME_WORLD.tile_defs.list[tile_id_at_br];
			if(tile_at_br.stand_on) {
				hitting_floor = true;
			}

		
			// if we're on the floor
			if(hitting_floor) {
				// do nothing - we're fine
				GAME_WORLD.player.falling = false;
				GAME_WORLD.player.climbing = false;
			} else {
				// fall
				GAME_WORLD.player.falling = true;
				GAME_WORLD.player.vel.y = 0.5;
			}
			
		};
		this.player.collide_to_objects = function() {
			if(GAME_WORLD.player.OBJECT_COLLISIONS) {
				for(obj of GAME_WORLD.objects) {
					if(obj.collides) {
						GAME_WORLD.player.collide_to_object(obj);
					}
				}
			}
		};
		this.player.precollide_to_object = function(obj) {
			var hit_object = true;
			
			// figure out if we hit a wall
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var pl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var pr_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var pt_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var pb_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			
			// find object
			var object_def = GAME_WORLD.object_defs.list[obj.thing_id];
			var object_sprite = GAME_WORLD.sprite_defs.list[object_def.sprite];
			var object_frame = object_sprite.frames[0][obj.facing][obj.frame];
			var ol_x = obj.loc.x - (object_frame[4] - object_frame[6]);
			var or_x = obj.loc.x - (object_frame[4] - object_frame[8]);
			var ot_y = obj.loc.y - (object_frame[5] - object_frame[7]);
			var ob_y = obj.loc.y + (object_frame[5] - object_frame[9]);
			
			// check corners 
			if((pr_x < ol_x) || (pl_x > or_x) || (pb_y < ot_y) || (pt_y > ob_y)) {
				hit_object = false;
			}
			
			return hit_object;
		};
		this.player.precollide_to_npc = function(npc) {
			var hit_npc = true;
			
			// figure out if we hit a wall
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var pl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var pr_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var pt_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var pb_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			
			// find npc
			var npc_def = GAME_WORLD.npc_defs.list[npc.npc_id];
			var npc_sprite = GAME_WORLD.sprite_defs.list[npc_def.sprite];
			var npc_frame = npc_sprite.frames[0][npc.facing][npc.frame];
			var ol_x = npc.loc.x - (npc_frame[4] - npc_frame[6]);
			var or_x = npc.loc.x - (npc_frame[4] - npc_frame[8]);
			var ot_y = npc.loc.y - (npc_frame[5] - npc_frame[7]);
			var ob_y = npc.loc.y + (npc_frame[5] - npc_frame[9]);
			
			// check corners 
			if((pr_x < ol_x) || (pl_x > or_x) || (pb_y < ot_y) || (pt_y > ob_y)) {
				hit_npc = false;
			}
			
			return hit_npc;
		}
		this.player.collide_to_object = function(obj) {
			var hit_object = true;
			
			// figure out if we hit a wall
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var pl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var pr_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var pt_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var pb_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			
			// find object
			var object_def = GAME_WORLD.object_defs.list[obj.thing_id];
			var object_sprite = GAME_WORLD.sprite_defs.list[object_def.sprite];
			var object_frame = object_sprite.frames[0][obj.facing][obj.frame];
			var ol_x = obj.loc.x - (object_frame[4] - object_frame[6]);
			var or_x = obj.loc.x - (object_frame[4] - object_frame[8]);
			var ot_y = obj.loc.y - (object_frame[5] - object_frame[7]);
			var ob_y = obj.loc.y + (object_frame[5] - object_frame[9]);
			
			// check corners 
			if((pr_x < ol_x) || (pl_x > or_x) || (pb_y < ot_y) || (pt_y > ob_y)) {
				hit_object = false;
			}
			
			
			// if hit object - collect?
			if(hit_object) {
				// if it's an item!
				if(object_def.type == "item") { 
					// check if it's unique and we have one already
					if(obj.unique && false) { // WORK IN PROGRESS - check for guid in inventory for unique items!
						// ignore the item if it's unique!
					} else {
						// if it's unique, add event to track it
						if(obj.unique && obj.no_respawn) {
							GAME_WORLD.player_add_event(obj);
						}
						
						// add to inventory
						GAME_WORLD.player_add_item(obj.thing_id,obj.guid);
						obj.DESTROY_THIS = true;						
					}					
				}
				
				
				// if hit solid furniture - collide like a wall
				if(object_def.type == "furniture") {
					if(object_def.flags.indexOf('solid') > -1) {
						GAME_WORLD.player.vel.x = 0;
					}
				}
			}
		};
		this.player.collide_to_events = function() {
			var events = GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].events;
			for(evt of events) {
				if(evt.type == "touch_exit") {
					GAME_WORLD.player.collide_to_event(evt);
				}
			}
		};
		this.player.collide_to_event = function(evt) {
			hit_event = true;
			
			// figure out if we hit an event
			// sprite stance facing frame
			var sprite_frame = GAME_WORLD.sprite_defs.list[GAME_WORLD.player.sprite_id].frames[GAME_WORLD.player.stance][GAME_WORLD.player.facing][GAME_WORLD.player.frame];
			var pl_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[6]);
			var pr_x = GAME_WORLD.player.loc.x + GAME_WORLD.player.vel.x - (sprite_frame[4] - sprite_frame[8]);
			var pt_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y - (sprite_frame[5] - sprite_frame[7]);
			var pb_y = GAME_WORLD.player.loc.y + GAME_WORLD.player.vel.y + (sprite_frame[5] - sprite_frame[9]);
			
			// find event
			var ol_x = evt.tile_x * 8;
			var or_x = evt.tile_x * 8 + 7;
			var ot_y = evt.tile_y * 8;
			var ob_y = evt.tile_y * 8 + 7;
			
			// check corners 
			if((pr_x < ol_x) || (pl_x > or_x) || (pb_y < ot_y) || (pt_y > ob_y)) {
				hit_event = false;
			}
			
			
			if(hit_event) {
				if(evt.type == "touch_exit") {
					GAME_WORLD.player.loc.x = evt.target.x;
					GAME_WORLD.player.loc.y = evt.target.y;
					if(GAME_WORLD.player.loc.map != evt.target.map) {
						GAME_WORLD.player.loc.map = evt.target.map;
						GAME_WORLD.transition_to_map(GAME_WORLD.player.loc.map);
					}
					GAME_WORLD.player.slope_left = false;
					GAME_WORLD.player.slope_right = false;
					GAME_WORLD.player.falling = false;
				}
			}
		};
		
		
		
		
		
		
		// add handlers for controls
		document.addEventListener('keydown',(e)=>{
			//console.log(e.code);
			if(!GAME_WORLD.player.TYPING) {
				if(e.code == this.control_defs.up) {
					this.controls.up = 1;
				}
				if(e.code == this.control_defs.down) {
					this.controls.down = 1;
				}
				if(e.code == this.control_defs.left) {
					this.controls.left = 1;
				}
				if(e.code == this.control_defs.right) {
					this.controls.right = 1;
				}
				if(e.code == this.control_defs.jump) {
					this.controls.jump = 1;
				}
				if(e.code == this.control_defs.fire1) {
					this.controls.fire1 = 1;
				}
				if(e.code == this.control_defs.fire2) {
					this.controls.fire2 = 1;
				}
				if(e.code == this.control_defs.fire3) {
					this.controls.fire3 = 1;
				}
				if(e.code == this.control_defs.float_on) {
					this.controls.float_on = 1;
				}
				if(e.code == this.control_defs.float_off) {
					this.controls.float_off = 1;
				}
				
				// sprinting with Shift key
				if(e.shiftKey == true) {
					this.controls.sprint = 1;
				}
			} else { // else if typing...
				if(e.code == 'Backspace') {
					if(GAME_WORLD.player.TYPING_BUF.length > 0) {
						GAME_WORLD.player.TYPING_BUF = GAME_WORLD.player.TYPING_BUF.substr(0,(GAME_WORLD.player.TYPING_BUF.length-1));
						GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].name = GAME_WORLD.player.TYPING_BUF;
						document.getElementById('editor_map_name').value = GAME_WORLD.player.TYPING_BUF;
					}
				}
			}
		});
		// if typing!
		document.addEventListener('keypress',(e)=>{
			if(GAME_WORLD.player.TYPING) {
				if(e.keyCode == 13 || e.keyCode == 27) {
					GAME_WORLD.player.TYPING = false;
					GAME_WORLD.player.TYPING_BUF = "";
				} else {
					GAME_WORLD.player.TYPING_BUF += e.key;
					GAME_WORLD.map_defs.list[GAME_WORLD.player.loc.map].name = GAME_WORLD.player.TYPING_BUF;
				}				
				document.getElementById('editor_map_name').value = GAME_WORLD.player.TYPING_BUF;
			}
		});
		document.addEventListener('keyup',(e)=>{
			if(e.code == this.control_defs.up) {
				this.controls.up = 0;
			}
			if(e.code == this.control_defs.down) {
				this.controls.down = 0;
			}
			if(e.code == this.control_defs.left) {
				this.controls.left = 0;
			}
			if(e.code == this.control_defs.right) {
				this.controls.right = 0;
			}
			if(e.code == this.control_defs.sprint) {
				this.controls.sprint = 0;
			}
			if(e.code == this.control_defs.jump) {
				this.controls.jump = 0;
			}
			if(e.code == this.control_defs.fire1) {
				this.controls.fire1 = 0;
			}
			if(e.code == this.control_defs.fire2) {
				this.controls.fire2 = 0;
			}
			if(e.code == this.control_defs.fire3) {
				this.controls.fire3 = 0;
			}
			if(e.code == this.control_defs.float_on) {
				this.controls.float_on = 0;
			}
			if(e.code == this.control_defs.float_off) {
				this.controls.float_off = 0;
			}
			
			// sprinting with Shift key
			if(e.shiftKey == false) {
				this.controls.sprint = 0;
			}
		});
		
		
		// start things?
		this.transition_to_map(0);
		window.requestAnimationFrame(this.game_loop);
	},
	
};

GAME_WORLD.init();