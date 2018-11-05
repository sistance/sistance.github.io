var game = {
	SCALE: null,
	HEIGHT: null,
	WIDTH: null,
	ANIMATE_SPEED: null, // ms
	LIFESPAN: null, // generations
	BLUR_MODE: null,
	FADE_MODE: null,
	game_board: null,
	generation: null,
	game_on: true,
	last_tick: performance.now(), //new Date().getTime(),
	canvas: null,
	canvas_ele: null,
	context: null,
	
	init: function(){
		this.SCALE = 4;
		this.WIDTH = 300;
		this.HEIGHT = 200;
		this.ANIMATE_SPEED = 500;
		this.LIFESPAN = 720;
		this.BLUR_MODE = false;
		this.FADE_MODE = true;
		this.generation = 0;
		this.canvas = $('#game-canvas');
		this.canvas.attr("width",(this.WIDTH*this.SCALE)).attr("height",(this.HEIGHT*this.SCALE));
		this.canvas_ele = this.canvas.get(0);
		this.canvas_ele.style.width = (this.WIDTH*this.SCALE)+"px";
		this.canvas_ele.style.height = (this.HEIGHT*this.SCALE)+"px";
		this.context = this.canvas_ele.getContext('2d');
		this.clear_board();
		this.render();
		
		// drawing on the canvas?
		this.canvas.on("click",function(e){
			//console.log(e);
			e.preventDefault();
			var y = Math.floor(e.offsetY/game.SCALE);
			var x = Math.floor(e.offsetX/game.SCALE);
			//console.log("("+e.clientX+","+e.clientY+")");
			game.game_board[x][y].alive = !game.game_board[x][y].alive;
			game.game_board[x][y].generation = game.generation;
			game.render();
		});
		
		// control buttons
		$(".control-game-start").on("click",function(e){
			game.start();
		});
		$(".control-game-stop").on("click",function(e){
			game.stop();
		});
		$(".control-game-step").on("click",function(e){
			game.animate_once();
			game.render();
		});
		$(".control-animate-minus100").on("click",function(e){
			e.preventDefault();
			game.ANIMATE_SPEED -= 100;
			
			if(game.ANIMATE_SPEED < 20) {
				game.ANIMATE_SPEED = 20;
			}
			game.render();
		});
		$(".control-animate-minus10").on("click",function(e){
			e.preventDefault();
			game.ANIMATE_SPEED -= 10;
			
			if(game.ANIMATE_SPEED < 20) {
				game.ANIMATE_SPEED = 20;
			}
			game.render();
		});
		$(".control-animate-plus10").on("click",function(e){
			e.preventDefault();
			game.ANIMATE_SPEED += 10;
			
			if(game.ANIMATE_SPEED > 3000) {
				game.ANIMATE_SPEED = 3000;
			}
			game.render();
		});
		$(".control-animate-plus100").on("click",function(e){
			e.preventDefault();
			game.ANIMATE_SPEED += 100;
			
			if(game.ANIMATE_SPEED > 3000) {
				game.ANIMATE_SPEED = 3000;
			}
			game.render();
		});
		$(".control-lifespan-minus100").on("click",function(e){
			e.preventDefault();
			game.LIFESPAN -= 100;
			
			if(game.LIFESPAN < 0) {
				game.LIFESPAN = 0;
			}
			game.render();
		});
		$(".control-lifespan-minus10").on("click",function(e){
			e.preventDefault();
			game.LIFESPAN -= 10;
			
			if(game.LIFESPAN < 0) {
				game.LIFESPAN = 0;
			}
			game.render();
		});
		$(".control-lifespan-plus10").on("click",function(e){
			e.preventDefault();
			game.LIFESPAN += 10;
			
			if(game.LIFESPAN > 5000) {
				game.LIFESPAN = 5000;
			}
			game.render();
		});
		$(".control-lifespan-plus100").on("click",function(e){
			e.preventDefault();
			game.LIFESPAN += 100;
			
			if(game.LIFESPAN > 5000) {
				game.LIFESPAN = 5000;
			}
			game.render();
		});
		$(".control-randomize-board").on("click",function(e){
			e.preventDefault();
			game.random_fill();
			game.render();
		});
		$(".control-clear-board").on("click",function(e){
			e.preventDefault();
			game.clear_board();
			game.render();
		});
		$(".control-blur-mode").on("click",function(e){
			e.preventDefault();
			game.BLUR_MODE = !game.BLUR_MODE;
			game.render();
		});
		$(".control-fade-mode").on("click",function(e){
			e.preventDefault();
			game.FADE_MODE = !game.FADE_MODE;
			game.render();
		});
	},
	clear_board: function(){
		this.game_board = [];
		for(var x=0;x<this.WIDTH;x++) {
			this.game_board[x] = [];
			
			for(var y=0;y<this.HEIGHT;y++) {
				this.game_board[x][y] = {
					alive: false,
					generation: this.generation,
				};
			}
		}
	},
	resize_board: function(x,y){
		this.WIDTH = x;
		this.HEIGHT = y;
		this.generation = 0;
		this.clear_board();
	},
	random_fill: function() {
		for(var x=0;x<this.WIDTH;x++) {
			this.game_board[x] = [];
			
			for(var y=0;y<this.HEIGHT;y++) {
				this.game_board[x][y] = {
					alive: (Math.random()<0.5)?true:false,
					generation: this.generation,
				};
			}
		}
	},
	board_check: function() {
		for(var x=0;x<this.WIDTH;x++){
			for(var y=0;y<this.HEIGHT;y++) {
				if(this.game_board[x][y].alive == true) {
					var generations_passed = this.generation - this.game_board[x][y].generation;
					if(generations_passed > this.LIFESPAN) { // life span
						this.game_board[x][y].alive = false;
					}
				}
			}
		}
	},
	animate: function(current_time){ // CAN'T USE "THIS" BECAUSE IT IS A CALLBACK
		//console.log(current_time);
		var time_passed = current_time - game.last_tick;
		
		if(time_passed > game.ANIMATE_SPEED) {
			game.animate_once();
			game.render();	
			game.board_check();
			game.last_tick = current_time;
		}
		if(game.game_on == true) { // continue if game is on
			window.requestAnimationFrame(game.animate);
		}
	},
	start: function(){
		this.game_on = true;
		window.requestAnimationFrame(this.animate);
	},
	stop: function() {
		this.game_on = false;
	},
	animate_once: function(){
		var new_board = [];
		this.generation++;
		//console.log(this.generation);
		
		for(var x=0;x<this.WIDTH;x++) {
			new_board[x] = [];
			
			for(var y=0;y<this.HEIGHT;y++) {
				// count for old
				var count = this.count(x,y);
				var old_alive = this.game_board[x][y].alive;
				var now_alive = false;
				var now_generation = this.game_board[x][y].generation;

				switch(count){
					case 2: // a cell with two neighbors
						if(old_alive == true) { // stays alive
							now_alive = true;
						}
						break;
					case 3: // a cell with three neighbors stays alive, or a new cell is born
						if(old_alive == false) { // new cell is born
							now_generation = this.generation;
						}
						now_alive = true;
						break;
					default:
						break;
				}
				
				// set new
				new_board[x][y] = {
					alive: now_alive,
					generation: now_generation,
				};
			}
		}
		
		this.game_board = new_board;
	},
	render: function(){
		$("#mon-generation").html(this.generation);
		$("#mon-animate-delay").html(this.ANIMATE_SPEED);
		$("#mon-lifespan").html(this.LIFESPAN);
		$("#mon-blur-mode").html(this.BLUR_MODE?'On':'Off');
		$("#mon-fade-mode").html(this.FADE_MODE?'On':'Off');
		//this.to_string();
		if(this.BLUR_MODE == false) {
			this.context.clearRect(0,0,this.WIDTH*this.SCALE,this.HEIGHT*this.SCALE);
		}
		for(var x=0;x<this.WIDTH;x++) {
			for(var y=0;y<this.HEIGHT;y++) {
				
				var tx = x*this.SCALE;
				var ty = y*this.SCALE;
				
				if(this.game_board[x][y].alive == true) {					
					var angle = (this.game_board[x][y].generation * 3) % 360;
					var saturation = Math.floor(this.game_board[x][y].generation / 360) * 5 + 15;
					var gen_gap = this.LIFESPAN - (this.generation - this.game_board[x][y].generation);
					
					if(saturation > 100) {
						saturation = 100;
					}
					if(gen_gap < 0) {
						gen_gap = 0;
					}
					gen_gap /= this.LIFESPAN;

					var style_buf = "hsla("+angle+","+saturation+"%,50%,"+gen_gap+")";
					//console.log(style_buf);
					this.context.fillStyle = style_buf;
					this.context.fillRect(tx,ty,this.SCALE,this.SCALE);
				} else {
					if(this.BLUR_MODE == true) {
						this.context.fillStyle = "rgba(0,0,0,0.05)";
					} else {
						// no clearing this time!
						this.context.fillStyle = "#000000";
					}
					if(this.FADE_MODE == true) {
						this.context.fillRect(tx,ty,this.SCALE,this.SCALE);
					}
				}
			}
		}
	},
	clear_screen: function(){
		this.context.clearRect(0,0,this.WIDTH*this.SCALE,this.HEIGHT*this.SCALE);		
	},
	to_string: function(){
		var buf = "";
		
		for(var x=0;x<this.WIDTH;x++) {
			buf = "";

			for(var y=0;y<this.HEIGHT;y++) {
				buf += (this.game_board[x][y].alive)?"1":"0";
			}
			console.log(buf);
		}
	},
	count: function(x,y){
		var total = 0;
		for(var xl=-1;xl<2;xl++){
			for(var yl=-1;yl<2;yl++) {
				if(xl == 0 && yl == 0) {
					// don't count the cell itself!
				} else {
					var tx = x+xl;
					var ty = y+yl;
					
					if((tx > -1 && tx < this.WIDTH)&&(ty > -1 && ty < this.HEIGHT)) {
						if(this.game_board[tx][ty].alive == true){
							total++;
						}
					}
				}
			}
		}
		
		return total;
	},
};

game.init();
