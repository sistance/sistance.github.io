// game objects

// mobiles (player, npcs)
var game_mobile = function(nom) {
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.room = 0;
	this.p_class = 0;
	
	this.inventory = [];
	this.goals = [];
	this.cooldowns = [];
	
	this.flags = null;
}
game_mobile.prototype.move = function(idx) {
	this.room = idx;
}



var game_item = function(nom) {
	this.idx = null;
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.flags = null;
}

var game_room = function(nom) {
	this.idx = null;
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.flags = null;

	this.items = [];
	this.npcs = [];
	this.exits = [];
}





// game
var game = {
	player: null,
	
	mobiles: {
		list: [],
		
		add: function(gm) {
			var ln = this.list.length+1;
			this.list[ln] = gm;
		},
	},
	items: [],
	rooms: [],
	
	init: function() {
		var new_player = new game_mobile("Player");
		this.mobiles.add(new_player);
		this.player = new_player;
	}
};



game.init();

