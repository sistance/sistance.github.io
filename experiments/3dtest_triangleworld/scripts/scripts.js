// 3D TRIANGLES MAP
// globals
var camera, camera2, scene, renderer, renderer2, raycaster, heightcaster, mouse;
var geometry, material, mesh, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7, mesh8, mesh9, mesh10;
var skyMat, groundMat, waterMat, treeMat, wandererMat, snowMat;
var cubeBase, waterBase, treeBase, grassBase, wandererBase;
var light = [];
var ground;
var all_ground_materials = [];

//var swatch_ground = [];
var swatch_point = [];
var swatch_polys = [];
var grass = [];
var forest = [];
var wanderers = [];
var tile_names = ["water","sand","ground","gravel","grass","snow"];

var GUID = 101;
var startTime;
var currentTime;
var lastTickTime;
var PI = 3.1415926536;
var lightWaverCycle = PI / 2; // starts at dawn
var LENGTH_OF_DAY = 60000; // in MS

// always light, for testing
var ALWAYS_LIGHT = true;

// globals?
var TILE_SIZE = 40;
var EQUIL_HEIGHT = TILE_SIZE * Math.sqrt(3)/2;
var WORLD_SIZE = 100;
var CAMERA_RANDOMIZE_TIME = 10000;

// console.logs some stuff
var VAR_TEST = false;
var DEBUG_MODE = false;

// for controllers
var gamepads = {};
var has_gamepad = false;
var live_controller = {
	id: 0,
	mode: 0, // 0 = keyboard, 1 = controller
};

// main!
$(window).load(function(){
	//var width =  $(window).width();
	var height = $(window).height();
	//$("#main").width(width);
	$("#main").height(height-3);
	
	// set up controllers
	function gamepadConnectHandler(e, connecting) {
		var gamepad = e.originalEvent.gamepad;
		// Note:
		// gamepad === navigator.getGamepads()[gamepad.index]

		if (connecting) {
			gamepads[gamepad.index] = gamepad;
			has_gamepad = true;
		} else {
			delete gamepads[gamepad.index];
			has_gamepad = false;
		}
		
		jQuery("#controller-control-button").toggle(has_gamepad);
	}
	$(window).on("gamepadconnected", function(e) { 
		var gp = navigator.getGamepads()[e.originalEvent.gamepad.index];
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			gp.index, gp.id,
			gp.buttons.length, gp.axes.length
		);
	
		gamepadConnectHandler(e, true); 
	});
	$(window).on("gamepaddisconnected", function(e) {
		e.preventDefault();
		gamepadConnectHandler(e, false); 
	});	
	
	$("#keyboard-control-button").on("click",function(e){
		live_controller.mode = 0;
		$('.control-button').removeClass('active');
		$(this).addClass('active');
	});
	$("#controller-control-button").on("click",function(e){
		live_controller.mode = 1;
		$('.control-button').removeClass('active');
		$(this).addClass('active');
	});
	
	$("#mode-set").on("click",function(e){
		e.preventDefault();
		var action_value = $("#action-mode-select").val();
		var idle_value = $("#idle-mode-select").val();
		camera.follow.ai.action.mode = 0;
		camera.follow.ai.intention.idle_mode = parseInt(idle_value);
		camera.follow.ai.intention.mode = parseInt(action_value);
		camera.follow.ai.action.endtime = currentTime - 1;
	});
	$("#day-time-button").on("click",function(e){
		lightWaverCycle = PI / 2;
	});
	$("#night-time-button").on("click",function(e){
		lightWaverCycle = 3 * PI / 2;
	});
	$(document).on("mousemove",function(e){
		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	});
	
	init();
	animate();
	
	
});

// initialize
function init() {
	$window = $("#main");

	camera = new THREE.PerspectiveCamera( 75, ($window.innerWidth()-0) / ($window.innerHeight()-1), 1, 11000 );
	camera.position.z = 600;
	camera.position.y = 800;
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( $window.innerWidth()-0, $window.innerHeight()-1 );
	renderer.setClearColor( 0x000000, 1 ); 
	$window.append( renderer.domElement );

	raycaster = new THREE.Raycaster();
	heightcaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	// controls
	//	up = 38
	//	left = 37
	//	right = 39
	//	down = 40	
	// a = 65
	// d = 68
	
	$(window).on("keydown",function(e){
		e.preventDefault();
		
		switch(e.keyCode) {
			case 87:
				wanderers[0].controller.now.y = 1;
				break;
			case 83:
				if (wanderers[0].controller.now.y != 1) {
					wanderers[0].controller.now.y = -1;
				} else {
					wanderers[0].controller.now.y = 0;
				}
				break;
			case 69:
				wanderers[0].controller.now.x = -1;
				break;
			case 81:
				if (wanderers[0].controller.now.x != -1) {
					wanderers[0].controller.now.x = 1;
				} else {
					wanderers[0].controller.now.x = 0;
				}
				break;
			case 65:
				wanderers[0].controller.now.ry = 1;
				break;
			case 68:
				if (wanderers[0].controller.now.ry != 1) { 
					wanderers[0].controller.now.ry = -1;
				} else {
					wanderers[0].controller.now.ry = 0;
				}
				break;
			case 9: // tab? change camera
				wanderers[0].controller.now.cam = 1;
				break;
			// arrow keys
			case 37:
				cameraFollowANewWanderer(-1);
				break;
			case 38:
				cameraResetFollow();
				break;
			case 39:
				cameraFollowANewWanderer(1);
				break;
			case 40:
				cameraFollowANewWanderer(0);
				break;
			case 99:
				break;
		}
				
	}).on("keyup",function(e){
		e.preventDefault();
		
		switch (e.keyCode) {
			case 83:
			case 87:
				wanderers[0].controller.now.y = 0;
				break;
			case 69:
			case 81:
				wanderers[0].controller.now.x = 0;
				break;
			case 88:
			case 84:
				break;
			case 65:
			case 68:
				wanderers[0].controller.now.ry = 0;
				break;
			case 9:
				wanderers[0].controller.now.cam = 0;
				break;
				
		}
	});
	
	$(renderer.domElement).on("click",function(e){
		console.log(camera.targeting);
		
	});
	//camera2 = new THREE.PerspectiveCamera( 75, $window.width() / $window.height(), 1, 10000 );
	//camera2.position.y = 1000;
	//camera2.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	//renderer2 = new THREE.WebGLRenderer();
	//renderer2.setSize( $subwindow.width(), $subwindow.height() );
	//renderer2.setClearColor( 0x000000, 1 );
	//$subwindow.append( renderer2.domElement );

	
	// textures
	var groundTexture = new THREE.TextureLoader().load('images/textures/flat-floor7_2.jpg');
	//groundTexture.anisotropy = renderer.getMaxAnisotropy();
	var waterTexture = new THREE.TextureLoader().load('images/textures/flat-fwater2.png');
	waterTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	var gravelTexture = new THREE.TextureLoader().load('images/textures/flat-rrock17_2.jpg');
	//gravelTexture.anisotropy = renderer.getMaxAnisotropy();
	var grassTexture = new THREE.TextureLoader().load('images/textures/flat-grass1_2.jpg');
	//grassTexture.anisotropy = renderer.getMaxAnisotropy();
	var sandTexture = new THREE.TextureLoader().load('images/textures/flat-flat5_5.png');
	//sandTexture.anisotropy = renderer.getMaxAnisotropy();
	var snowTexture = new THREE.TextureLoader().load('images/textures/flat-snow.png');
	//snowTexture.anisotropy = renderer.getMaxAnisotropy();
	
	/* ID */ // array of materials
								// THREE.MeshLambertMaterial	( { map: groundTexture, side: THREE.FrontSide } );  
	/* 00 */ groundMat = new 	THREE.MeshLambertMaterial	( { map: groundTexture, side: THREE.FrontSide } ); 
	/* 01 */ waterMat = new  	THREE.MeshPhongMaterial		( { map: waterTexture, side: THREE.FrontSide } );
	/* 02 */ gravelMat = new 	THREE.MeshLambertMaterial	( { map: gravelTexture, side: THREE.FrontSide } ); //Lambert
	/* 03 */ grassMat = new  	THREE.MeshLambertMaterial	( { map: grassTexture, side: THREE.FrontSide } ); //Lambert
	/* 04 */ sandMat = new   	THREE.MeshLambertMaterial	( { map: sandTexture, side: THREE.FrontSide } ); //Lambert
	/* 05 */ snowMat = new   	THREE.MeshLambertMaterial	( { map: snowTexture, side: THREE.FrontSide } ); //Lambert
	/* 06 */ treeMat = new 		THREE.MeshLambertMaterial	( { color: 0x30c000 } );
	/* 07 */ wandererMat = new 	THREE.MeshLambertMaterial	( { color: 0xffffff } );
	all_ground_materials = [groundMat,waterMat,gravelMat,grassMat,sandMat,snowMat];
	
	cubeBase = new THREE.CubeGeometry( TILE_SIZE, TILE_SIZE, TILE_SIZE );
	waterBase = new THREE.CubeGeometry( TILE_SIZE, TILE_SIZE*.8, TILE_SIZE );
	treeBase = new THREE.CylinderGeometry( 0, 30, 150, 7, 1 );
	grassBase = new THREE.CylinderGeometry( 0, 1, 20, 4, 1 );
	wandererBase = new THREE.CylinderGeometry( 5, 5, 30, 3, 3 );
	
	scene = new THREE.Scene();

	light[0] = new THREE.PointLight( 0xcccccc, 1, 5000 );
	light[0].position.x = 0;
	light[0].position.y = 1000;
	light[0].position.z = 0;
	scene.add( light[0] );
	light[1] = new THREE.PointLight( 0xffc080, 1, 400 );
	light[1].position.x = 0;
	light[1].position.y = 200;
	light[1].position.z = 0;
	light[1].intensity = .5;
	scene.add( light[1] );
	light[2] = new THREE.HemisphereLight( 0xeeeeee, 0x484848, 1	);
	scene.add( light[2] );
	
	// add random lights
	for(var lp=3;lp<10;lp++) {
		light[lp] = new THREE.PointLight( 0x80ff80, 1, 1000);
		var wsz = WORLD_SIZE * TILE_SIZE;
		var x = Math.floor(Math.random() * wsz) - (wsz/2);
		var z = Math.floor(Math.random() * wsz) - (wsz/2);

		light[lp].position.x = x;
		light[lp].position.y = (TILE_SIZE*.7);
		light[lp].position.z = z;
		light[lp].intensity = 1;
		scene.add(light[lp]);
	}

	lastTickTime = (new Date()).getTime();
	startTime = lastTickTime;
	
	//createSky();
	createGround();
	//createGrass();
	createForest();
	createWanderers();
	camera.follow_id = 0;
	camera.follow = wanderers[camera.follow_id];
	camera.follow_randomize = 0;
	camera.follow_tick = 0;
	camera.type = 2; // 1 = chase, 2 = follow, 3 = first-person
	//camera.follow = wanderers[Math.floor(Math.random()*wanderers.length)];
}



// animate... move to a different file
function animate() {
	currentTime = (new Date()).getTime();
	// note: three.js includes requestAnimationFrame shim

	// daylight cycle
	if(ALWAYS_LIGHT) {
		light[0].intensity = 1.5;
		light[2].intensity = 1.5;
		$("#light_0_mon").html(round3(light[0].intensity));
	} else {
		lightWaverCycle += (currentTime - lastTickTime) / LENGTH_OF_DAY;
		light[0].intensity = Math.cos(lightWaverCycle - PI) * (3/2);
		light[2].intensity = Math.cos(lightWaverCycle - PI) * (3/2);
		$("#light_0_mon").html(round3(light[0].intensity));
		if (VAR_TEST) {console.log(lightWaverCycle + " " + Math.cos(lightWaverCycle));}

		// will o wisp
		light[1].intensity = (Math.cos(lightWaverCycle - PI) * -(5/2) + (5/2)) * camera_following_light_intensity();
		light[1].color = camera_following_light_color();
		light[1].position.x = camera.follow.position.x;
		light[1].position.y = camera.follow.position.y + 30;
		light[1].position.z = camera.follow.position.z;
	}
	
	// random movements
	// light[1].position.x += ((Math.random() * 12) - 6) * 10;
	// light[1].position.z += ((Math.random() * 12) - 6) * 10;
	// light[1].position.x = clamp(-1000,light[1].position.x,1000);
	// light[1].position.z = clamp(-1000,light[1].position.z,1000);

	

	// wanderers
	animateWanderers();
	
	// randomly target a wanderer with the camera
	if(camera.follow_randomize == 1) {
		camera.follow_tick += (currentTime - lastTickTime);
		
		if(camera.follow_tick > CAMERA_RANDOMIZE_TIME) {
			cameraFollowANewWanderer(0);
		}
	}
	camera_track();

	
	// update mouse location
	check_mouse_targeting();
	jQuery("#mouse_mon").html("("+round3(mouse.x)+","+round3(mouse.y)+")");
	
	
	// render
	renderer.render( scene, camera );
	//renderer2.render( scene, camera2 );
	lastTickTime = currentTime;

	// wait for next loop
	requestAnimationFrame( animate );
}


// NEW creates the ground
function createGround() {
	var mat, mater, base;
	
	var ground_geometry = new THREE.Geometry();
	
	// create level ground, hexagon lattice
	for (var x=0;x<WORLD_SIZE;x++) {
		swatch_point[x] = [];
		for(var y=0;y<WORLD_SIZE;y++) {
			swatch_point[x][y] = {
				x:0.0,
				y: 0.0, //Math.floor(Math.random()*2)*EQUIL_HEIGHT
				z:EQUIL_HEIGHT*y,
			};
			
			if(y%2==0) {
				swatch_point[x][y].x = x*TILE_SIZE;
			} else {
				swatch_point[x][y].x = x*TILE_SIZE+(TILE_SIZE/2);
			}
		}
	}

	// mountain heights!
	for(var lp=0;lp<100;lp++) {
		// position
		var x = Math.floor(Math.random()*WORLD_SIZE);
		var y = Math.floor(Math.random()*WORLD_SIZE);
		
		//console.log("("+x+","+y+")");
		
		// height
		var h = (Math.floor(Math.random()*5)+5)*EQUIL_HEIGHT;
		
		// height in point grid
		swatch_point[x][y].y = h;
		if(x-1 >= 0) {
			swatch_point[x-1][y].y = h / 2;
		}
		if(x+1 < WORLD_SIZE) {
			swatch_point[x+1][y].y = h / 2;
		}
		
		// above and below
		if(y%2 == 0) { // even
			// top
			if(y-1 >= 0) {
				// left
				if(x-1 >= 0) {
					swatch_point[x-1][y-1].y = h / 2;
				}
				// right
				swatch_point[x][y-1].y = h / 2;
			}
			// bottom
			if(y+1 < WORLD_SIZE) {
				// left
				if(x-1 >= 0) {
					swatch_point[x-1][y+1].y = h / 2;
				}
				// right
				swatch_point[x][y+1].y = h / 2;
			}
		} else { // odd
			// top
			if(y-1 >= 0) {
				// left
				swatch_point[x][y-1].y = h / 2;
				// right
				if(x+1 < WORLD_SIZE) {
					swatch_point[x+1][y-1].y = h / 2;
				}
			}
			// bottom
			if(y+1 < WORLD_SIZE) {
				// left
				swatch_point[x][y+1].y = h / 2;
				// right
				if(x+1 < WORLD_SIZE) {
					swatch_point[x+1][y+1].y = h / 2;
				}
			}
		}
		
	}
	
	// platform heights!
	for(var lp=0;lp<200;lp++) {
		// position
		var x = Math.floor(Math.random()*(WORLD_SIZE-1));
		var y = Math.floor(Math.random()*(WORLD_SIZE-1));
		
		if(y%2 == 0) {
			swatch_point[x][y].y = 		EQUIL_HEIGHT * 2;
			swatch_point[x+1][y].y = 	EQUIL_HEIGHT * 2;
			swatch_point[x][y+1].y = 	EQUIL_HEIGHT * 2;
		} else {
			swatch_point[x][y].y = 		EQUIL_HEIGHT * 2;
			swatch_point[x+1][y+1].y = 	EQUIL_HEIGHT * 2;
			swatch_point[x][y+1].y = 	EQUIL_HEIGHT * 2;
		}
	}
		
	// build geometry with points
	for (var x=0;x<WORLD_SIZE;x++) {
		for(var y=0;y<WORLD_SIZE;y++) {
			ground_geometry.vertices.push(
				new THREE.Vector3(swatch_point[x][y].x,swatch_point[x][y].y,swatch_point[x][y].z)
			);
		}
	}
	
	// texture polygons!
	for (var x=0;x<WORLD_SIZE-1;x++) {
		for (var y=0;y<WORLD_SIZE-1;y++) {
			var face_mat = 0; //Math.floor(Math.random() * all_ground_materials.length);
			swatch_polys.push({
				mat: face_mat
			},{
				mat: face_mat
			});
			
			
			// add faces to model
			var base_c = y * WORLD_SIZE + x;
			
			if(x%2 == 0) {
				var c11 = base_c;
				var c12 = base_c + 1;
				var c13 = base_c + WORLD_SIZE;
				var c21 = base_c + 1;
				var c22 = base_c + WORLD_SIZE + 1;
				var c23 = base_c + WORLD_SIZE;
			} else {
				var c11 = base_c;
				var c12 = base_c + WORLD_SIZE + 1;
				var c13 = base_c + WORLD_SIZE;
				var c21 = base_c;
				var c22 = base_c + 1;
				var c23 = base_c + WORLD_SIZE + 1;
			}
			
			ground_geometry.faces.push(
				new THREE.Face3(c11,c12,c13,null,null,face_mat),
				new THREE.Face3(c21,c22,c23,null,null,face_mat)
			);

			if(x%2 == 0) {
				ground_geometry.faceVertexUvs[0].push([
						new THREE.Vector2(0.0,0.0),
						new THREE.Vector2(0.66666667,0.0),
						new THREE.Vector2(0.33333333,0.66666667*Math.sqrt(3) / 2)
					],[
						new THREE.Vector2(0.66666667,0.0),
						new THREE.Vector2(1.0,0.66666667*Math.sqrt(3) / 2),
						new THREE.Vector2(0.33333333,0.66666667*Math.sqrt(3) / 2)
					]
				);
			} else {
				ground_geometry.faceVertexUvs[0].push([
						new THREE.Vector2(0.66666667,0.0),
						new THREE.Vector2(1.0,0.66666667*Math.sqrt(3) / 2),
						new THREE.Vector2(0.33333333,0.66666667*Math.sqrt(3) / 2)
					],[
						new THREE.Vector2(0.0,0.0),
						new THREE.Vector2(0.66666667,0.0),
						new THREE.Vector2(0.33333333,0.66666667*Math.sqrt(3) / 2)
					]
				);
			}
		}
	}
	ground_geometry.computeBoundingBox();
	ground_geometry.computeFaceNormals();

	// build object and add to world!
	ground = new THREE.Mesh( ground_geometry, all_ground_materials );
	ground.GUID = getGUID();
	ground.position.x = 0; //-((WORLD_SIZE * TILE_SIZE)/2);
	ground.position.z = 0; //-((WORLD_SIZE * TILE_SIZE)/2);
	ground.position.y = 0;
	scene.add(ground);	
}


// creates the ground
function OLDcreateGround() {
	var mat, mater, base;

	// clear the ground
	for (x=0;x<WORLD_SIZE;x++) {
		swatch_ground[x] = [];
		for (y=0;y<WORLD_SIZE;y++) {
			swatch_ground[x][y] = {
				tile : 2, // default ground tile
				alt : 0 // ground level
			}; 
		}
	}
	
	// add lakes
	for (lp=0;lp<11;lp++) {
		var cx = Math.floor(Math.random() * WORLD_SIZE);
		var cy = Math.floor(Math.random() * WORLD_SIZE);
		var it = Math.floor(Math.random() * 5) + 7;
		
		// only on bare ground
		while (swatch_ground[cx][cy].tile != 2) {
			var cx = Math.floor(Math.random() * WORLD_SIZE);
			var cy = Math.floor(Math.random() * WORLD_SIZE);
		}

		// recursive lakes with beach edges
		spread_tile(cx,cy,it,0,1,2);
	}
	
	// add swamps
	for (lp=0;lp<19;lp++) {
		var cx = Math.floor(Math.random() * WORLD_SIZE);
		var cy = Math.floor(Math.random() * WORLD_SIZE);
		var it = Math.floor(Math.random() * 4) + 2;
		
		// only on bare ground
		while (swatch_ground[cx][cy].tile != 2) {
			var cx = Math.floor(Math.random() * WORLD_SIZE);
			var cy = Math.floor(Math.random() * WORLD_SIZE);
		}

		// recursive swamps
		spread_tile(cx,cy,it,0,-1,2);
	}
	
	// add gravel piles
	for (lp=0;lp<23;lp++) {
		var cx = Math.floor(Math.random() * WORLD_SIZE);
		var cy = Math.floor(Math.random() * WORLD_SIZE);
		var it = Math.floor(Math.random() * 3) + 3;
		
		// only on bare ground
		while (swatch_ground[cx][cy].tile != 2) {
			var cx = Math.floor(Math.random() * WORLD_SIZE);
			var cy = Math.floor(Math.random() * WORLD_SIZE);
		}
		
		// spread gravel over bare ground
		spread_tile(cx,cy,it,3,-1,2);
		spread_alt(cx,cy,it,1);
	}
	
	
	// add mountains
	for (lp=0;lp<7;lp++) {
		var cx = Math.floor(Math.random() * WORLD_SIZE);
		var cy = Math.floor(Math.random() * WORLD_SIZE);
		var scale = Math.floor(Math.random() * 3)+2;
		var it = Math.floor(Math.random() * 5) + 9 * scale;
		
		//console.log(scale);
		// mountain
		spread_alt(cx,cy,it,scale);
	}
	
	// old way
	// add grassy areas
	//for (lp=0;lp<6;lp++) {
	//	var cx = Math.floor(Math.random() * WORLD_SIZE);
	//	var cy = Math.floor(Math.random() * WORLD_SIZE);
	//	var it = Math.floor(Math.random() * 4) + 8;
	//	
	//	// only on bare ground
	//	while (swatch_ground[cx][cy].tile != 2) {
	//		var cx = Math.floor(Math.random() * WORLD_SIZE);
	//		var cy = Math.floor(Math.random() * WORLD_SIZE);
	//	}
    //
	//	// recursive grassy areas
	//	spread_tile(cx,cy,it,4,-1,2);
	//}
	
	// new way
	// foliate
	for(lpx=0;lpx<WORLD_SIZE;lpx++) {
	for(lpy=0;lpy<WORLD_SIZE;lpy++) {
		if((swatch_ground[lpx][lpy].tile == 2) && (swatch_ground[lpx][lpy].alt < 19)) {
			swatch_ground[lpx][lpy].tile = 4;
		}
	
	}}

	// snow-cap
	for(lpx=0;lpx<WORLD_SIZE;lpx++) {
	for(lpy=0;lpy<WORLD_SIZE;lpy++) {
		if(swatch_ground[lpx][lpy].alt > 28) {
			swatch_ground[lpx][lpy].tile = 5;
		}
	
	}}
	
	
	// build the finished product
	for (x=0;x<WORLD_SIZE;x++) {
		ground[x] = [];
		for (y=0;y<WORLD_SIZE;y++) {
			//mat = Math.floor(Math.random() * 4);
			mat = swatch_ground[x][y].tile;
			alt = swatch_ground[x][y].alt;
			
			switch (mat) {
				case 0:
					mater = waterMat;
					base = waterBase;
					break;
				case 1:
					mater = sandMat;
					base = cubeBase;
					break;
				case 2:
					mater = groundMat;
					base = cubeBase;
					break;
				case 3:
					mater = gravelMat;
					base = cubeBase;
					break;
				case 4:
					mater = grassMat;
					base = cubeBase;
					break;
				case 5:
					mater = snowMat;
					base = cubeBase;
					break;
			}
			obj = new THREE.Mesh( base, mater );
			obj.mat = mat;
			obj.GUID = getGUID();
			obj.position.x = (x-(WORLD_SIZE/2)) * TILE_SIZE + (TILE_SIZE/2);
			obj.position.z = (y-(WORLD_SIZE/2)) * TILE_SIZE + (TILE_SIZE/2);
			obj.water = false;
			obj.position.y = alt * (TILE_SIZE*.2);
			if (mat == 0) {
				//obj.position.y -= (TILE_SIZE*.2);
				obj.water = true;
			}
			ground[x][y] = obj;
			scene.add(ground[x][y]);
		}
	}
}

// spread some water recursively
function spread_tile(sx,sy,iter,tile,border,replaces) {
	if  ((sx<0)||(sx>(WORLD_SIZE-1)))  return;
	if  ((sy<0)||(sy>(WORLD_SIZE-1)))  return;
	
	if ((replaces==-1) || ((replaces>=0) && (swatch_ground[sx][sy].tile==replaces))) {
		if (Math.floor(Math.random()*2)>0) {
			swatch_ground[sx][sy].tile = tile; // water
			//console.log(sx + " | " + sy + " | " + iter);
			
			if (iter > 0) {
				spread_tile(sx-1,sy,iter-1,tile,border,replaces);
				spread_tile(sx,sy-1,iter-1,tile,border,replaces);
				spread_tile(sx+1,sy,iter-1,tile,border,replaces);
				spread_tile(sx,sy+1,iter-1,tile,border,replaces);
			} else {
				if (border >= 0) {
					spread_tile(sx-1,sy,0,border,-1,replaces);
					spread_tile(sx,sy-1,0,border,-1,replaces);
					spread_tile(sx+1,sy,0,border,-1,replaces);
					spread_tile(sx,sy+1,0,border,-1,replaces);
				}
			}
		}
	}
}


function spread_alt(sx,sy,iter) {
	
}

// spread altitude, always works on the first iteration
function OLDspread_alt(sx,sy,iter,scale) {
	if  ((sx<0)||(sx>(WORLD_SIZE-1)))  return;
	if  ((sy<0)||(sy>(WORLD_SIZE-1)))  return;
	//console.log(iter);
	
	
	//if (Math.floor(Math.random()*2)>0) {
	if (swatch_ground[sx][sy].alt < iter) {
		swatch_ground[sx][sy].alt = iter;
	}
	//}
	if (iter >= scale) {
		spread_alt(sx-1,sy,iter-scale,scale);
		spread_alt(sx,sy-1,iter-scale,scale);
		spread_alt(sx+1,sy,iter-scale,scale);
		spread_alt(sx,sy+1,iter-scale,scale);
	}
}

// create sky
function createSky() {
	obj = new THREE.Mesh( skyBase, skyMat );
	obj.doubleSided = true;
	scene.add(obj);
}


// create grass
function createGrass() {
	for (i=0;i<1000;i++) {
		obj = new THREE.Mesh( grassBase, treeMat );
		obj.GUID = getGUID();
		var wsz = WORLD_SIZE * TILE_SIZE;
		var x = Math.floor(Math.random() * wsz) - (wsz/2);
		var z = Math.floor(Math.random() * wsz) - (wsz/2);
		var tx = (WORLD_SIZE/2) + Math.floor(x/TILE_SIZE);
		var	tz = (WORLD_SIZE/2) + Math.floor(z/TILE_SIZE);
		
		while (swatch_ground[tx][tz].tile != 4) { // while it's not grass
			// generate new random point
			x = Math.floor(Math.random() * wsz) - (wsz/2);
			z = Math.floor(Math.random() * wsz) - (wsz/2);
			tx = (WORLD_SIZE/2) + Math.floor(x/TILE_SIZE);
			tz = (WORLD_SIZE/2) + Math.floor(z/TILE_SIZE);
		}
		var alt = swatch_ground[tx][tz].alt;
		obj.position.x = x;
		obj.position.z = z;
		obj.position.y = (alt*(TILE_SIZE*.2))+(TILE_SIZE*.6);
		grass[i] = obj;
		scene.add(grass[i]);
	}
}


// create forest
// no trees in water!
function createForest() {
	for (i=0;i<500;i++) {
		// random point
		var wsz = WORLD_SIZE * TILE_SIZE;
		var x = Math.random() * wsz;
		var z = Math.random() * wsz * Math.sqrt(3)/2;
		var y = find_ground_height_at(x,z);
		
		obj = new THREE.Mesh( treeBase, treeMat );
		obj.GUID = getGUID();
		obj.position.x = x;
		obj.position.y = y + 75;
		obj.position.z = z;
		obj.rotation.y = Math.random();
		obj.contains = [{
			type : 1, // 0 = null, material, x, x,
			material : 1, // 0 = null, wood, stone
			amount : Math.floor(Math.random() * 20) + 10,
		}];
		forest[i] = obj;
		scene.add(forest[i]);
	}
}


// create wandering mobiles
function createWanderers() {
	for (i=0;i<20;i++) {
		var wsz = (WORLD_SIZE - 1) * TILE_SIZE;
		// new object
		obj = new THREE.Mesh( wandererBase, wandererMat ); // treeBase, treeMat
		obj.GUID = getGUID();		
		obj.position.x = Math.random() * wsz;
		obj.position.z = Math.random() * wsz * Math.sqrt(3)/2;
		obj.position.y = 15;
		obj.rotation.y = round3(Math.random() * 2*PI);
		obj.rotation.x = 0;
		obj.rotation.z = 0;
		
		obj.stats = {
			sex : (Math.floor(Math.random() * 2) + 1), // {N=0,M,F}
			
			base : {
				str : 13, 
				dex : 13, 
				con : 13, 
				itl : 13, 
				wis : 13, 
				cha : 13
			},
			mods : {
				str : 0,
				dex : 0,
				con : 0,
				itl : 0,
				wis : 0,
				cha : 0
			},
			sight_range : (300 + 13 * 20), // 300 pixels + 20 pixels per point of int; each 100 pixels is two squares
			health : {
				hunger : 0,
				thirst : 0,
				mentality : 50, // 50% = balance, 0% = passed out, 100% = hallucinating
				drunkenness : 0, // 0% = none, 100% = toxic shutdown
				comfort : 50, // 50% = normal, 0% = fleeing, 100% = falling asleep
				love : 50, // 50% = content, 0% = spiteful to, 100% = desperate for
				anger : 50, // 50% = content, 0% = jaded, 100% = raging
				
				diseases : [{
					name : "",
					type : "",
				}],
			},
		}
		obj.ai = { // artificial intelligence
			action : {
				mode: 0, // 0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather; deliver
				dest : {
					x : 0.0,
					y : (TILE_SIZE*.7),
					z : 0.0
				},
				created_time : lastTickTime,
				endtime : lastTickTime,
				delta_time : 0
			},
			intention : { // 4/0 gives randomly wandering guy that stops to look around; 1/2 gives a guy relentlessly following
				mode: ((Math.random()>0.5)?1:4), //1, // 0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather; deliver
				idle_mode : ((Math.random()>0.5)?0:2), //2, // 0 = continue; wait; scan; sleep
			},
			knowledge : { // and more
				// passive things
				has_seen : [{
					object : "",
					concept : "",
					direction_to : "",
				}],
				targeting : [{
					object : "",
					concept : "", // home, shelter, water, food, fuel, fire, stone, ore, defense
					direction_to : "",
				}],
				afraid_of : [{
					object : "",
					concept : "",
					direction_to : "",
				}],
				// active things
				following : [{
					object : (i>0)?wanderers[i-1]:"",
					concept : "",
					direction_to : "",
				}],
				collecting : [{
					object : "",
					concept : "",
					direction_to : "",
				}],
				delivering : [{
					object : "",
					concept : "",
					direction_to : "",
				}],
			},
		}
		obj.velocity = {
			x : 0.0,
			y : 0.0,
			z : 0.0,
			ry : 0.0,
		}
		obj.acceleration = {
			x : 0.0,
			y : 0.0,
			z : 0.0,
			ry : 0.0,
		}
		obj.inventory = [
			{
				guid : 0x01,
				name : 'Lamp',
				type : 'light',
				weight : 1,
				attrs : {
					intensity : 1,
					color : (i==0)?0xffc040:(Math.random()>0.5)?0xff8040:0x8080ff,
				},
				located: 0x02, // guid of container
			},
			{
				guid : 0x02,
				name : 'Backpack',
				type : 'container',
				weight : 1,
				attrs : {
					capacity : 35,
				},
				located: -1, // located in inventory root
			}
		]
		if (i==0) {
			// temp stuff for facing testing --------
			obj.position.x = wsz/2; //0;
			obj.position.z = wsz/2 * Math.sqrt(3)/2; //0;
			//obj.rotation.y = 0;
			obj.lookAt(new THREE.Vector3(0,(TILE_SIZE*.7),1));
			obj.rotation.x = 0;
			obj.rotation.z = 0;
			// --------------------------------------
			obj.control_type = 1;
			obj.controller = {
				old : {
					x : 0,
					y : 0,
					ry : 0,
					btn : {
						fire : 0,
						jump : 0,
						menu : 0,
						cam : 0
					}
				},
				now : {
					x : 0,
					y : 0,
					ry : 0,
					btn : {
						fire : 0,
						jump : 0,
						menu : 0,
						cam : 0
					}
				}
			}
		} else {
			obj.control_type = 0;
			obj.lookAt(new THREE.Vector3(0,(TILE_SIZE*.7),1));
		}
		obj.animate_this = animate_this_wanderer; // animate method
		
		if (VAR_TEST) { console.log(obj); } // TEST SHOW OBJECT
		wanderers[i] = obj;
		scene.add(wanderers[i]);
	}
}

// camera tracking its object's position
function camera_track() {
	var x1 = camera.follow.position.x;
	var y1 = camera.follow.position.y;
	var z1 = camera.follow.position.z;
	var x2 = camera.position.x;
	var z2 = camera.position.z;


	switch (camera.type) {
		case 1: // follow	
			var dx = x2 - x1;
			var dz = z2 - z1;
			var dist = Math.sqrt(dx*dx+dz*dz);
			if (dist > 500) {
				//var cx = (x1 + x2)/2;
				//var cz = (z1 + z2)/2;
				var cx = dx / dist;
				var cz = dz / dist;
				camera.position.x = x1 + cx * 500;
				camera.position.y = y1 + 500;
				camera.position.z = z1 + cz * 500;
			}
			camera.lookAt(camera.follow.position);
			break;
		case 2: // chase
			var ty = camera.follow.rotation.y;
			var c_ty = Math.cos(ty + PI/2);
			var m_c = Math.round(c_ty*10000.0);
			var f_c = m_c / 10000.0;
			var s_ty = Math.sin(ty + PI/2);
			var m_s = Math.round(s_ty*10000.0);
			var f_s = m_s / 10000.0;
			$("#facing_mon").html(round3(ty*180/PI));
			$("#facing_trig_mon").html("("+round3(camera.follow.position.x)+","+round3(camera.follow.position.z)+") "+f_c+", "+f_s);
			$("#camera_mon").html(round3(camera.rotation.y));
			
			camera.position.x = x1 + (f_c * 300);
			camera.position.z = z1 - (f_s * 300);
			camera.position.y = camera.follow.position.y + 300;
			camera.lookAt(camera.follow.position);
			break;
		case 3: // first-person
			var ty = camera.follow.rotation.y;
			var c_ty = Math.cos(ty + PI/2);
			var m_c = Math.round(c_ty*10000.0);
			var f_c = m_c / 10000.0;
			var s_ty = Math.sin(ty + PI/2);
			var m_s = Math.round(s_ty*10000.0);
			var f_s = m_s / 10000.0;
			
			camera.position.x = x1 + (f_c * 1);
			camera.position.z = z1 - (f_s * 1);
			camera.position.y = camera.follow.position.y+10;
			look_target = new THREE.Vector3(camera.follow.position.x,camera.follow.position.y,camera.follow.position.z);
			look_target.setY(camera.position.y);
			camera.lookAt(look_target);
			break;
	}
}


// camera randomly picks a wanderer to follow
function cameraFollowANewWanderer(delta) {
	//dt = currentTime - startTime;

	var id = camera.follow_id + delta;
	var max_id = wanderers.length;
	
	if (delta == -1 || delta == 1) {
		if(id < 0) {
			id = wanderers.length - 1;
		}
		if(id == wanderers.length) {
			id = 0;
		}
		camera.follow_randomize = 0;
	} else if(delta == 0) {
		id = Math.floor(Math.random()*wanderers.length);
		camera.follow_randomize = 1;
		camera.follow_tick = 0;
	}
	camera.follow_id = id;
	camera.follow = wanderers[id];
	
	if(id !== 0) {
		$("#ai-controls").css('display','block');
		$("#ai_id_mon").html(id);
		$("#action-mode-select").val(wanderers[id].ai.intention.mode);
		$("#idle-mode-select").val(wanderers[id].ai.intention.idle_mode);
	} else {
		$("#ai-controls").css('display','none');		
	}
	
	
	//if ((dt % 5000) < 3) {
	//	camera.follow = wanderers[Math.floor(Math.random()*wanderers.length)];
	//}
}

function cameraResetFollow() {
	camera.follow_id = 0;
	camera.follow = wanderers[0];
	camera.follow_randomize = 0;
	camera.follow_tick = currentTime;
}

// animate wandering mobiles 
function animateWanderers() {
	var max = wanderers.length;
	
	if (max < 1) {
		return;
	}
	
	for (i=0;i<max;i++) {
		wanderers[i].animate_this();
	}
}

// animate this object
function animate_this_wanderer() {
	// wanderers[i]		ai			action		
	//											mode: (0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather; deliver)  
	//											dest : {
	//												x : 0.0,
	//												y : (TILE_SIZE*.7),
	//												z : 0.0
	//											}
	//											created_time
	//											endtime
	//											delta_time
	//
	//								intention	
	//											mode: {0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather; deliver}
	//											idle_mode: {0 = wait; sleep; scan}
	//											targeting :obj
	//											following :obj
	//											fleeing :obj
	//											guarding :obj
	//											beseiging :obj
	//											



	var pTime = (currentTime - lastTickTime);
	
	w = this;
	
	
	if (w.control_type == 0) { // computer-controlled
		w.ai.action.delta_time = currentTime - w.ai.action.created_time;
		//camera.follow.ai.action.mode = 0;
		//camera.follow.ai.intention.mode = action_value;
		//camera.follow.ai.intention.idle_mode = idle_value;
		
		// change after time
		if (currentTime > w.ai.action.endtime) {
		
			// reset action to match intention if we've been idling stationary
			if (w.ai.action.mode == 0) {
				w.ai.action.mode = w.ai.intention.mode;
			} else {
				w.ai.action.mode = 0;
				w.velocity.x = 0;
				w.velocity.z = 0;
				
				// end time
				switch(w.ai.intention.idle_mode) {
					case 0: // continue
						w.ai.action.endtime = currentTime + 1;
						break;
					//case 1: // wait
					//case 2: // scan
					//case 3: // sleep
					default:
						w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
						break;
				}
				//if(w.ai.intention.mode == 4) {
				//	w.ai.action.endtime = currentTime + 1;
				//} else {
				//	w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
				//}
			}
		
			switch (w.ai.action.mode) {
				// 0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather; deliver
				case 1: // wander
					var x = Math.random() * (WORLD_SIZE - 1) * TILE_SIZE;
					var z = Math.random() * (WORLD_SIZE - 1) * TILE_SIZE * Math.sqrt(3)/2;
					var y = find_ground_height_at(x,z);
					var np = new THREE.Vector3(
						x,
						y,
						z
					);
					w.ai.action.dest = np;
					var dx = (np.x - w.position.x);
					var dz = (np.z - w.position.z);
					var speed = 200/1000; // pixels per second / ms per second - 50 slow walk
					var dist = Math.sqrt((dx * dx) + (dz * dz));
					
					var t_elapse = dist / speed; //(Math.floor(Math.random() * 5)*1000)+1000;
					w.velocity.x = dx / t_elapse;
					w.velocity.z = dz / t_elapse;
					w.lookAt(np);
					if (DEBUG_MODE)  {console.log("look: ("+w.ai.action.dest.x+","+w.ai.action.dest.z+")");} // DEBUG
					w.ai.action.endtime = currentTime + t_elapse;
					break;
				case 2: // patrol
					break;
				case 3: // search
					break;
				case 4: // follow
					var following = w.ai.knowledge.following[0].object;
					var np = new THREE.Vector3(
						following.position.x,
						w.position.y, //following.position.y,
						following.position.z
					);
					var speed = 225/1000; // pixels per second / ms per second
					var dx = (np.x - w.position.x);
					var dz = (np.z - w.position.z);
					var dist = Math.sqrt((dx * dx) + (dz * dz));
					
					if (dist > 100) {					
						var t_elapse = dist / speed; //(Math.floor(Math.random() * 5)*1000)+1000;
						w.velocity.x = dx / t_elapse;
						w.velocity.z = dz / t_elapse;
					}
					w.lookAt(np);
					w.ai.action.endtime = currentTime + 250;
					break;
				case 5: // flee
					var fleeing = w.ai.knowledge.fleeing[0].object;
					var np = new THREE.Vector3(
						fleeing.position.x-w.position.x,
						w.position.y,
						fleeing.position.z-w.position.z
					);
					var speed = 280/1000; // pixels per second / ms per second
					var dx = (np.x - w.position.x);
					var dz = (np.z - w.position.z);
					var dist = Math.sqrt((dx * dx) + (dz * dz));
					
					if (dist > 100) {					
						var t_elapse = dist / speed; //(Math.floor(Math.random() * 5)*1000)+1000;
						w.velocity.x = dx / t_elapse;
						w.velocity.z = dz / t_elapse;
					}
					w.lookAt(np);
					w.ai.action.endtime = currentTime + 250;
					break;
				
				default: // stationary - idle mode
					switch(w.ai.intention.idle_mode) {
						case 1: // wait
							if(w.ai.knowledge.following.length > 0) {
								var following = w.ai.knowledge.following[0].object;
								var np = new THREE.Vector3(
									following.position.x, 
									w.position.y, //following.position.y, 
									following.position.z
								);
								w.lookAt(np);
							}
							w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
							break;
						case 2: // scan
							w.rotation.y = Math.random();
							w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
							if (VAR_TEST)  {console.log("rot:"+w.rotation.y);} // TEST
							break;
						default: // continue
							break;
					}
					break;
			}
		
		}

		w.position.x += (w.velocity.x * pTime);
		w.position.z += (w.velocity.z * pTime);

	} else { // human-controlled
		
		if(live_controller.mode == 1) { // if it's in controller mode
			// poll game pads
			var pgamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
			
			// detect which controller is live
			for (var i = 0; i < pgamepads.length; i++) {
				if (pgamepads[i]) {
					if (pgamepads[i].index in gamepads) {
						for (var j = 0; j < pgamepads[i].buttons.length; j++) {
							if(pgamepads[i].buttons[j].pressed) {
								live_controller.id = pgamepads[i].index;
							}
						}
						for(var j = 0; j < pgamepads[i].axes.length; j++) {
							if(pgamepads[i].axes[j] > 0.1) {
								live_controller.id = pgamepads[i].index;
							}
						}
					}
					gamepads[pgamepads[i].index] = pgamepads[i];
				}
			}		
			
			// handle live controller
			var button_buf = "";
			var axis_buf = "/";
			i = live_controller.id;
			if(i in gamepads) {
				for (var j = 0; j < gamepads[i].buttons.length; j++) {
					button_buf += (gamepads[i].buttons[j].pressed)?'T':'F';
				}
				for (var j = 0; j < gamepads[i].axes.length; j++) {
					if(Math.abs(gamepads[i].axes[j]) > 0.25) {
						axis_buf += j+":"+gamepads[i].axes[j].toFixed(4)+"/";
					} else {
						axis_buf += j+":0.0000/";
					}
				}
				//console.log("#"+gamepads[i].index+" "+button_buf+" "+axis_buf);
				
				// use 
				if (Math.abs(gamepads[i].axes[0]) > 0.25) {
					w.controller.now.x = -gamepads[i].axes[0];
				} else {
					w.controller.now.x = 0;
				}
				if (Math.abs(gamepads[i].axes[1]) > 0.25) {
					w.controller.now.y = -gamepads[i].axes[1];
				} else {
					w.controller.now.y = 0;
				}
				if (Math.abs(gamepads[i].axes[2]) > 0.25) {
					w.controller.now.ry = -gamepads[i].axes[2];
				} else {
					w.controller.now.ry = 0;
				}
			}
		}
		
		
		
		// handle final controls
		if (w.controller.old.x != w.controller.now.x) {
			w.velocity.x = w.controller.now.x;
			w.controller.old.x = w.controller.now.x;
		}
		if (w.controller.old.y != w.controller.now.y) {
			w.velocity.y = w.controller.now.y;
			w.controller.old.y = w.controller.now.y;
		}
		if (w.controller.old.ry != w.controller.now.ry)  {
			w.velocity.ry = w.controller.now.ry * 90*PI/180 / 1000; // 90 degrees/s in ms
			w.controller.old.ry = w.controller.now.ry;
		}
		
		if (w.controller.old.cam != w.controller.now.cam) {
			if (w.controller.now.cam == 1) { // change camera type
				var typenames = ["","Chase","Follow","First-Person"];
				camera.type++;
				if (camera.type > 3) { 
					camera.type = 1; // chase camera
					camera.position.y += 300; // move it up so it has the right perspective again
				}
				$("#camera_style_mon").html(typenames[camera.type]);
			}
			w.controller.old.cam = w.controller.now.cam;
		}

		
		w.rotation.y += (w.velocity.ry * pTime);
		while (w.rotation.y > 2*PI) {
			w.rotation.y -= 2*PI;
		}
		while (w.rotation.y < -2*PI) {
			w.rotation.y += 2*PI;
		}
		var max_speed = 200/1000;
		var wcos = Math.cos(w.rotation.y+PI/2);
		var wsin = Math.sin(w.rotation.y+PI/2);
		var lcos = Math.cos(w.rotation.y+PI);
		var lsin = Math.sin(w.rotation.y+PI);
		var dx = (wcos * w.velocity.y + lcos * w.velocity.x) * max_speed;
		var dz = (wsin * w.velocity.y + lsin * w.velocity.x) * max_speed;
		w.position.x -= (dx * pTime);
		w.position.z += (dz * pTime);
		//w.position.x = clamp(0,w.position.x,3999);
	}
	
	// move
	//w.position.y = 15;
	w.position.y = find_ground_height_at(w.position.x,w.position.z) + 15;
}


// utility
// general
function clamp(a,b,c) {
	return((b<a)?a:(b>c)?c:b);
}
function round3(a) {
	return (Math.round(a*1000)/1000);
}
function getGUID() {
	thisGUID = GUID;
	GUID++;

	return thisGUID;
}


// wanderers
function find_wanderer_by_id(id) {
	var wid = -1;
	
	for(var lp=0;lp<wanderers.length;lp++) {
		if(wanderers[lp].id == id) {
			return lp;
		}
	}
	
	return wid;
}
function find_ground_height_at(x,y) {
	heightcaster.set(new THREE.Vector3(x,1000,y),new THREE.Vector3(0,-1,0));
	var intersects = heightcaster.intersectObject(ground);
	
	if(intersects.length > 0) {
		var d = 1000.0 - intersects[0].distance;
	} else {
		return 0.0;
	}
	
	return d;
}

// mouse
function check_mouse_targeting() {
	raycaster.setFromCamera( mouse, camera );
	
	var intersects;
	var intersects_buf = "";
	
	/*
	// check type of tile
	var first = true;
	
	for(var lp=0;lp<ground.length;lp++) {
		for(var lp2=0;lp2<ground[lp].length;lp2++) {
			intersects = raycaster.intersectObject(ground[lp][lp2]);
			
			if(intersects.length > 0 && first) {
				intersects_buf = tile_names[ground[lp][lp2].mat]+", ";
				first = false;
			}
		}
	}
	
	// check forest
	for(var lp=0;lp<forest.length;lp++) {
		intersects = raycaster.intersectObject(forest[lp]);
		
		if(intersects.length > 0) {
			intersects_buf += "t"+lp+", ";
		}
	}
	
	// check grass
	for(var lp=0;lp<grass.length;lp++) {
		intersects = raycaster.intersectObject(grass[lp]);
		
		if(intersects.length > 0) {
			intersects_buf += "g"+lp+", ";
		}
	}
	intersects_buf = intersects_buf.substr(0,intersects_buf.length-2);
	$("#mouse_target_mon").html(intersects_buf);
	*/
	
	intersects = raycaster.intersectObjects(scene.children);
	if(intersects.length > 0) {
		$("#mouse_target_mon").html(intersects[0].object.GUID);
		camera.targeting = intersects[0].object.GUID;
	} else {
		$("#mouse_target_mon").html("none");
	}
}

// camera
function camera_following_light_intensity() {
	var intensity = 0;
	var wid = find_wanderer_by_id(camera.follow.id);
	var iii = find_item_in_inventory_by_type(wid,"light");
	
	if(iii > -1) {
		intensity = wanderers[wid].inventory[iii].attrs.intensity;
	}
	return intensity;
}
function camera_following_light_color() {
	var color = new THREE.Color(0x008080);
	var wid = find_wanderer_by_id(camera.follow.id);
	var iii = find_item_in_inventory_by_type(wid,"light");
	
	if(iii > -1) {
		color = new THREE.Color(wanderers[wid].inventory[iii].attrs.color);
	}
	return color;
}


// inventory
function find_item_in_inventory_by_type(wid,itype) {
	var iid = -1;
	
	for(var lp=0;lp<wanderers[wid].inventory.length;lp++) {
		if (wanderers[wid].inventory[lp].type == itype) {
			return lp;
		}
	}
	return iid;
}

