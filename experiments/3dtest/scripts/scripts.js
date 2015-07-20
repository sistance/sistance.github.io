// globals
var camera, camera2, scene, renderer, renderer2;
var geometry, material, mesh, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7, mesh8, mesh9, mesh10;
var skyMat, groundMat, waterMat, treeMat, wandererMat, snowMat;
var light = [];
var ground = [];
var swatch_ground = [];
var grass = [];
var forest = [];
var wanderers = [];

var startTime;
var currentTime;
var lastTickTime;
var PI = 3.1415926536;
var lightWaverCycle = PI / 2; // starts halfway between midnight and noon

// globals?
var TILE_SIZE = 100;
var WORLD_SIZE = 60;

// console.logs some stuff
var VAR_TEST = false;
var DEBUG_MODE = false;


// main!
$(window).load(function(){
	//var width =  $(window).width();
	var height = $(window).height();
	//$("#main").width(width);
	$("#main").height(height-3);
	
	init();
	animate();
});

// initialize
function init() {
	$window = $("#main");

	camera = new THREE.PerspectiveCamera( 75, $window.innerWidth() / $window.innerHeight(), 1, 11000 );
	camera.position.z = 600;
	camera.position.y = 800;
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( $window.width(), $window.height() );
	renderer.setClearColor( 0x000000, 1 ); 
	$window.append( renderer.domElement );

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
			case 38:
			case 39:
			case 40:
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
	//camera2 = new THREE.PerspectiveCamera( 75, $window.width() / $window.height(), 1, 10000 );
	//camera2.position.y = 1000;
	//camera2.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	//renderer2 = new THREE.WebGLRenderer();
	//renderer2.setSize( $subwindow.width(), $subwindow.height() );
	//renderer2.setClearColor( 0x000000, 1 );
	//$subwindow.append( renderer2.domElement );



	// new stuff!

	//var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	//var texture = THREE.ImageUtils.loadTexture( 'textures/crate.gif' );
	//texture.anisotropy = renderer.getMaxAnisotropy();
	//var material = new THREE.MeshBasicMaterial( { map: texture } );
	
	// skybox setup
	var urlPrefix = "testcube/";
	var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg", urlPrefix + "posy.jpg", urlPrefix + "negy.jpg", urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
	textureCube = THREE.ImageUtils.loadTextureCube( urls );
	var shader = THREE.ShaderLib["cube"];
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	uniforms['tCube'].value = textureCube;   // textureCube has been init before

	// textures
	var groundTexture = THREE.ImageUtils.loadTexture('images/textures/flat-floor7_2.jpg');
	groundTexture.anisotropy = renderer.getMaxAnisotropy();
	var waterTexture = THREE.ImageUtils.loadTexture('images/textures/flat-fwater2.png');
	waterTexture.anisotropy = renderer.getMaxAnisotropy();
	var gravelTexture = THREE.ImageUtils.loadTexture('images/textures/flat-rrock17_2.jpg');
	gravelTexture.anisotropy = renderer.getMaxAnisotropy();
	var grassTexture = THREE.ImageUtils.loadTexture('images/textures/flat-grass1_2.jpg');
	grassTexture.anisotropy = renderer.getMaxAnisotropy();
	var sandTexture = THREE.ImageUtils.loadTexture('images/textures/flat-flat5_5.png');
	sandTexture.anisotropy = renderer.getMaxAnisotropy();
	var snowTexture = THREE.ImageUtils.loadTexture('images/textures/flat-snow.png');
	snowTexture.anisotropy = renderer.getMaxAnisotropy();
	
	// materials
	skyMat = new THREE.ShaderMaterial({ fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, side: THREE.BackSide	});
	groundMat = new THREE.MeshPhongMaterial( { map: groundTexture, side: THREE.FrontSide } );
	waterMat = new THREE.MeshPhongMaterial( { map: waterTexture, side: THREE.FrontSide } );
	gravelMat = new THREE.MeshPhongMaterial( { map: gravelTexture, side: THREE.FrontSide } );
	grassMat = new THREE.MeshPhongMaterial( { map: grassTexture, side: THREE.FrontSide } );
	sandMat = new THREE.MeshPhongMaterial( { map: sandTexture, side: THREE.FrontSide } );
	snowMat = new THREE.MeshPhongMaterial( { map: snowTexture, side: THREE.FrontSide } );
	treeMat = new THREE.MeshLambertMaterial( { color: 0x30c000 } );
	wandererMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	
	
	skyBase = new THREE.CubeGeometry( 10000, 10000, 10000, 1, 1, 1, null, true );
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
	light[1] = new THREE.PointLight( 0xc0a040, 1, 400 );
	light[1].position.x = 0;
	light[1].position.y = 200;
	light[1].position.z = 0;
	scene.add( light[1] );
	//light[2] = new THREE.HemisphereLight( 0xcccc00, 0x484000, 1	);
	light[2] = new THREE.HemisphereLight( 0xeeeeee, 0x484848, 1	);
	scene.add( light[2] );

	lastTickTime = (new Date()).getTime();
	startTime = lastTickTime;
	
	//createSky();
	createGround();
	createGrass();
	createForest();
	createWanderers();
	camera.follow = wanderers[0];
	camera.type = 2; // 1 = chase, 2 = follow, 3 = first-person
	//camera.follow = wanderers[Math.floor(Math.random()*wanderers.length)];
}



// animate... move to a different file
function animate() {
	currentTime = (new Date()).getTime();
	// note: three.js includes requestAnimationFrame shim

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;
	
	// daylight cycle
	lightWaverCycle += (currentTime - lastTickTime) / 40000;
	light[0].intensity = Math.sin(lightWaverCycle) * (3/2);
	light[2].intensity = Math.sin(lightWaverCycle) * (3/2);
	if (VAR_TEST) {console.log(lightWaverCycle + " " + Math.sin(lightWaverCycle));}
	
	// will o wisp
	light[1].intensity = Math.sin(lightWaverCycle) * -(5/2) + (5/2);
	light[1].position.x = camera.follow.position.x;
	light[1].position.y = camera.follow.position.y + 30;
	light[1].position.z = camera.follow.position.z;
	// random movements
	// light[1].position.x += ((Math.random() * 12) - 6) * 10;
	// light[1].position.z += ((Math.random() * 12) - 6) * 10;
	// light[1].position.x = clamp(-1000,light[1].position.x,1000);
	// light[1].position.z = clamp(-1000,light[1].position.z,1000);

	

	// wanderers
	animateWanderers();
	
	// randomly target a wanderer with the camera
	//cameraFollowANewWanderer();
	camera_track();
	
	// render
	renderer.render( scene, camera );
	//renderer2.render( scene, camera2 );
	lastTickTime = currentTime;

	// wait for next loop
	requestAnimationFrame( animate );
}

// creates the ground
function createGround() {
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
		
		console.log(scale);
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

// spread altitude, always works on the first iteration
function spread_alt(sx,sy,iter,scale) {
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
	for (i=0;i<1000;i++) {
		// random point
		var wsz = WORLD_SIZE * TILE_SIZE;
		var x = Math.floor(Math.random() * wsz) - (wsz/2);
		var z = Math.floor(Math.random() * wsz) - (wsz/2);
		var tx = (WORLD_SIZE/2) + Math.floor(x/TILE_SIZE);
		var	tz = (WORLD_SIZE/2) + Math.floor(z/TILE_SIZE);

		while (swatch_ground[tx][tz].tile == 0) { // while it's water
			// generate new random point
			x = Math.floor(Math.random() * wsz) - (wsz/2);
			z = Math.floor(Math.random() * wsz) - (wsz/2);
			tx = (WORLD_SIZE/2) + Math.floor(x/TILE_SIZE);
			tz = (WORLD_SIZE/2) + Math.floor(z/TILE_SIZE);
		}
		
		var alt = swatch_ground[tx][tz].alt;
		obj = new THREE.Mesh( treeBase, treeMat );
		obj.position.x = x;
		obj.position.y = (alt*(TILE_SIZE*.2)) + (Math.floor(Math.random() * 10) * 4) + (TILE_SIZE*.8);
		obj.position.z = z;
		obj.rotation.y = Math.random();
		forest[i] = obj;
		scene.add(forest[i]);
	}
}


// create wandering mobiles
function createWanderers() {
	for (i=0;i<50;i++) {
		var wsz = WORLD_SIZE * TILE_SIZE;
		// new object
		obj = new THREE.Mesh( wandererBase, wandererMat );
		obj.position.x = Math.floor(Math.random() * wsz) - (wsz/2);
		obj.position.y = (TILE_SIZE*.7);
		obj.position.z = Math.floor(Math.random() * wsz) - (wsz/2);
		obj.rotation.y = Math.random();
		obj.stats = {
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
			}
		}
		obj.ai = { // artificial intelligence
			action : {
				mode: 0, // 0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather
				dest : {
					x : 0.0,
					y : (TILE_SIZE*.7),
					z : 0.0
				},
				created_time : lastTickTime,
				endtime : lastTickTime,
				delta_time : 0
			},
			intention : {
				mode: 1, // 0 = stationary; wander; patrol; search; follow; flee; guard; beseige; hunt; gather
				idle_mode : 2, // 0 = wait; sleep; scan
				targeting : "",
				following : "",
				fleeing : "",
				guarding : "",
				beseiging : ""
			}
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
		if (i==0) {
			// temp stuff for facing testing --------
			obj.position.x = 0;
			obj.position.z = 0;
			//obj.rotation.y = 0;
			obj.lookAt(new THREE.Vector3(0,(TILE_SIZE*.7),1));
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
		}
		obj.animate = animate_this_wanderer; // animate method
		
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
		case 2: // third-person
			var ty = camera.follow.rotation.y;
			var c_ty = Math.cos(ty + PI/2);
			var m_c = Math.round(c_ty*10000.0);
			var f_c = m_c / 10000.0;
			var s_ty = Math.sin(ty + PI/2);
			var m_s = Math.round(s_ty*10000.0);
			var f_s = m_s / 10000.0;
			$("#facing_mon").html(ty*180/PI);
			$("#facing_trig_mon").html("("+camera.follow.position.x+","+camera.follow.position.z+") "+f_c+", "+f_s);
			$("#camera_mon").html(camera.rotation.y);
			
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
function cameraFollowANewWanderer() {
	dt = currentTime - startTime;
	
	if ((dt % 5000) < 3) {
		camera.follow = wanderers[Math.floor(Math.random()*wanderers.length)];
	}
}


// animate wandering mobiles 
function animateWanderers() {
	var max = wanderers.length;
	
	if (max < 1) {
		return;
	}
	
	for (i=0;i<max;i++) {
		wanderers[i].animate();
	}
}

// animate this object
function animate_this_wanderer() {
	// wanderers[i]		ai			action		mode
	//											(stationary, wander, patrol)  
	//											dest
	//											endtime
	//											delta_time
	//								intention	following :obj
	//											fleeing :obj
	//											guarding :obj
	//											beseiging :obj
	var pTime = (currentTime - lastTickTime);
	
	w = this;
	
	
	if (w.control_type == 0) { // computer-controlled
		w.ai.action.delta_time = currentTime - w.ai.action.created_time;
		
		// change after time
		if (currentTime > w.ai.action.endtime) {
		
			// reset action to match intention if we've been idling stationary
			if (w.ai.action.mode == 0) {
				w.ai.action.mode = w.ai.intention.mode;
			} else {
				w.ai.action.mode = 0;
				w.velocity.x = 0;
				w.velocity.z = 0;
				w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
			}
		
			switch (w.ai.action.mode) {
				case 1: // wander
					var wsz = WORLD_SIZE * TILE_SIZE;
					var np = {
						x : (Math.floor(Math.random() * (wsz/2))-(wsz/4)),
						y : (TILE_SIZE*.7),
						z : (Math.floor(Math.random() * (wsz/2))-(wsz/4))
					}
					w.ai.action.dest = np;
					var dx = (np.x - w.position.x);
					var dz = (np.z - w.position.z);
					var speed = 50/1000; // pixels per second / ms per second
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
				default: // stationary - idle mode
					switch(w.ai.intention.idle_mode) {
						case 1:
							break;
						case 2: // scan
							w.rotation.y = Math.random();
							w.ai.action.endtime = currentTime + ((Math.random() * 8) * 1000);
							if (VAR_TEST)  {console.log("rot:"+w.rotation.y);} // TEST
							break;
						default:
							break;
					}
					break;
			}
		
		}

		w.position.x += (w.velocity.x * pTime);
		w.position.z += (w.velocity.z * pTime);

	} else { // human-controlled
		//console.log("pc: ("+w.position.x+", "+w.position.z+")");
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
	//console.log(pTime);
	//w.position.z = clamp(0,w.position.z,3999);
	
	var tx = Math.floor((w.position.x) / TILE_SIZE) + (WORLD_SIZE/2);
	var ty = Math.floor((w.position.z) / TILE_SIZE) + (WORLD_SIZE/2);
	//console.log(tx+","+ty);
	// find altitude for object based on ground height
	if ((tx>=0)&&(tx<WORLD_SIZE)&&(ty>=0)&&(ty<WORLD_SIZE)) {
		w.position.y = (swatch_ground[tx][ty].alt * (TILE_SIZE*.2)) + (TILE_SIZE*.7);
		if (swatch_ground[tx][ty].tile == 0)  w.position.y -= 35;
	} else {
		w.position.y = (TILE_SIZE*.7);
	}
}


// utility
function clamp(a,b,c) {
	return((b<a)?a:(b>c)?c:b);
}




