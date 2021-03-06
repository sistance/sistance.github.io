// DATAS, FOR NOW



// game
var game = {
	player: null,
	
	obj_midx: 0,
	obj_ridx: 0,
	obj_oidx: 0,
	
	mobile_data: null,
	item_data: null,
	room_data: null,
	
	mobiles: null,
	rooms: null,
	items: null,
	
	
	output: {
		log: [],
	},
	
	
	log: function(str) {
		var ln = this.output.log.length;
		this.output.log[ln] = str;
		console.log(str);
	},
	cls: function() {
		$('#game_window').html("");
		//this.print('\n\n\n\n');
	},
	print: function(str) {
		var nhtml = $("#game_window").html();
		nhtml += "\n" + str;
		$('#game_window').html(nhtml);
	},
	init: function() {
		
		
	},
	new_game: function() {
		if ((this.mobiles) && (this.mobiles.idx > 0)) {
			delete this.mobiles.list;
			this.mobiles.idx = 0;
			this.mobiles.list = [];
		}
	
		// rooms
		this.obj_ridx = game.room_data.idx;
		this.rooms = game.room_data.list;

		// mobiles
		this.mobiles = {
			list: [],
			
			add: function(obj){
				this.list[this.list.length] = obj;
			},
		}
		
		// items
		this.items = {
			list: [],
			
			add: function(obj){
				this.list[this.list.length] = obj;
			},
		}
		
		// create new player
		var new_player = new game_mobile("Player");
		this.mobiles.add(new_player);
		this.player = new_player;
		this.player.inventory[0] = 1; // backpack
		this.player.room = 0;
		
		// start
		this.entering_room(this.player);
		
	},
	find_cmd: function(c_verb) {
		var n_cmd = game.command_data.length;
		for(var lp=0;lp<n_cmd;lp++) {
			if (game.command_data[lp].indexOf(c_verb)>= 0) {
				return lp;
			}
		}
		
		return -1;
	},
	find_obj: function(c_obj) {
		
		return -1;
	},
	load_rooms: function() {
		
	},
	entering_room: function() {
		var room = game.room_data.list[game.player.room];
		this.cls();
		this.print(room.name);
		this.print('');
		this.print(room.long_desc);
		this.print('');
		
		var items = room.items;
		if (items.length > 0) {
			//var item_str = "You see: ";
			this.print("You see: ");
			for(var lp=0;lp<items.length;lp++) {
				//item_str += game.item_data.list[items[lp]].name;
				game.print(game.item_data.list[items[lp]].desc);
			}
			//this.print(item_str);
			this.print('');
		}
		
		var exits = room.exits;
		if (exits.length > 0) {
			var exit_str = 'Exits: ';
			for(var lp=0;lp<exits.length;lp++) {
				exit_str += exits[lp][0] + " ";
			}
			this.print(exit_str);
			this.print('');
		}
	},
	parse: function(c_str) {
		var c_fixed = c_str.trim();
		
		var c_parts = c_fixed.split(' ');
		var c_word = 0; // counter
		
		// find the verb
		var c_verb = c_parts[c_word];
		//while(['in','the','a','an','as','to','at'].indexOf(c_verb) >= 0) { // stripping common filler words
		//	c_word++;
		//	c_verb = c_parts[c_word];
		//}

		var match = this.find_cmd(c_verb);
		c_word++;

		// find the [object] and the [predicate]
		var stuff = "";
		var stuff_pcs = c_parts;
		var c_object = "";
		var c_target = "";
		
		// figure out if there's supposed to be a subject and object based on the verb
		// if the verb doesn't match the list anywhere, compare to exit names instead
		if (match < 0) {
			var room = game.room_data.list[game.player.room];
			var room_id = -1;
			console.log(room.exits);
			console.log(c_verb);
			for(var lp=0;lp<room.exits.length;lp++) {
				if ((room.exits[lp][0] == c_verb) || (room.exits[lp][0].indexOf(c_verb) >= 0)) {
					
					room_id = room.exits[lp][1];
				}
			}
			
			if(c_verb == "") { // automatically fail if they don't put in a verb at all
				room_id = -1;
			}
			
			if (room_id >= 0) {
				game.print("GOING: "+c_verb);
				game.player.room = room_id;
				game.entering_room();
			} else { // all parsing fails on command!
				game.print("I'm not sure what you want to do.");
				game.print('');
			}
		}
		
		// otherwise, process targeting based on verb
		if (match >= 0)  {
			switch(match) {
				// verb stuff
				case 9:
				case 14: 
					stuff_pcs = stuff_pcs.splice(c_word,(stuff_pcs.length-c_word));
					stuff = stuff_pcs.join(' ');
					break;
					
				// verb target stuff
				case 0:
				case 1:
				case 12:
					if (c_parts[c_word]){
						c_object = c_parts[c_word];
						while(['in','the','a','an','as','to','at','with'].indexOf(c_object) >= 0) {
							c_word++;
							c_object = c_parts[c_word];
						}
						c_word++;
					} else {
						c_object = "";
					}

					stuff_pcs = stuff_pcs.splice(c_word,(stuff_pcs.length-c_word));
					stuff = stuff_pcs.join(' ');
					break;
					
				// verb object target stuff
				default: 
					// find the object
					if (c_parts[c_word]){
						c_object = c_parts[c_word];
						while(['in','the','a','an','as','to','at','with'].indexOf(c_object) >= 0) {
							c_word++;
							c_object = c_parts[c_word];
						}
						c_word++;
					} else {
						c_object = "";
					}
					
					// find the target
					if (c_parts[c_word]) {
						c_target = c_parts[c_word];
						while(['in','the','a','an','as','to','at','with'].indexOf(c_target) >= 0) {
							c_word++;
							c_target = c_parts[c_word];
						}
						c_word++;
						
						// the rest of it
						stuff_pcs = stuff_pcs.splice(c_word,(stuff_pcs.length-c_word));
						stuff = stuff_pcs.join(' ');
					} else {
						c_target = "";
					}
					break;
			}
		} 
		
		// do stuff!
		switch(match) {
			case 0:
				//game.print("GOING: "+c_object);
				
				// check if you can go that way
				var room = game.room_data.list[game.player.room];
				var room_id = -1;
				for(var lp=0;lp<room.exits.length;lp++) {
					if ((room.exits[lp][0] == c_object) || (room.exits[lp][0].indexOf(c_object) >= 0)) {
						
						room_id = room.exits[lp][1];
					}
				}
				if (room_id >= 0) {
					game.player.room = room_id;
					game.entering_room();
				}
				break;
			case 1: // get
				// check for the item in the room
				var room = game.room_data.list[game.player.room];

				for(var lp=0;lp<room.items.length;lp++) {
					if ((game.item_data.list[room.items[lp]].keyword == c_object) || (game.item_data.list[room.items[lp]].keyword.indexOf(c_object) >= 0)) {
						var itm = room.items[lp];
						game.player.inventory[game.player.inventory.length] = itm;
						room.items.splice(lp,1);
						game.print('You picked up '+game.item_data.list[itm].name+'.');
					}
				}
				break;
			case 2: // drop
				// check for the item in your inventory
				var room = game.room_data.list[game.player.room];

				for(var lp=0;lp<game.player.inventory.length;lp++) {
					if ((game.item_data.list[game.player.inventory[lp]].keyword == c_object) || (game.item_data.list[game.player.inventory[lp]].keyword.indexOf(c_object) >= 0)) {
						var itm = game.player.inventory[lp];
						game.player.inventory.splice(lp,1);
						room.items[room.items.length] = itm;
						game.print('You dropped '+game.item_data.list[itm].name+'.');
					}
				}
				break;
			case 4:	// inventory
				var itens = game.player.inventory.length;
				game.print("You are carrying:");
				
				if (itens > 0) {
					for (var lp=0;lp<itens;lp++) {
						var iten = game.item_data.list[game.player.inventory[lp]].name;
						game.print(iten);
					}
				} else {
					game.print("Nothing.");
				}
				break;
			case 9: // eat/drink
				game.print("You "+c_verb+" "+stuff+'.');
				break;
			case 12: // look
				if (c_object != "") {
					game.print("You look at "+c_object+".");
					
					// at item in inventory?
					// at item in room?
					// at keyword?
					// at exit?
				} else {
					game.entering_room();
				}
				break;
			case 14: // say/talk
				game.print('You say "'+stuff+'".');
				break;
			case -1: // directional
				break;
			default:
				game.print('"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
				break;
		}
		game.log('"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
		game.print('');
		
	},
	
};



game.mobile_data = { 'idx':1, 'list':[
	//{idx:0,name:'Void Child',desc:'',long_desc:'',room:0,p_class:0,inventory:[],goals:[],cooldowns:[],flags:0},
	{idx:0,name:'Void Child',desc:'',long_desc:'',room:0,p_class:0,inventory:[],goals:[],cooldowns:[],flags:0}
]};

game.room_data = { 'idx':2, 'list':[
	// {idx:0,name:'Void',desc:'You are trapped in the Void.',long_desc:'You are hopelessly lost in the Void.',flags:0,items:[],npcs:[],exits:[{'none':0}]},

	{
		idx: 0,
		name: "Limbo",
		desc: "You are trapped in Limbo.",
		long_desc: "Ain't no way you're getting out of here.",
		flags: 0,
		items: [],
		keywords: [],
		exits: [['north',1]],	
	},
	{
		idx: 1,
		name: "End of the World",
		desc: "You see the End of the World.",
		long_desc: "You are sitting at the End of the World. The only way out, is... WAY OUT.",
		flags: 0,
		items: [0],
		keywords: [],
		exits: [['back',2],['south',0]],
	},
	{
		idx: 2,
		name: "Beginning of the World",
		desc: "You see the Beginning of the World.",
		long_desc: "You are sitting at the Beginning of the World. The only way out, is... WAY OUT.",
		flags: 0,
		items: [],
		keywords: [],
		exits: [['forward',1]],
	},
	
]};

game.item_data = { 'idx':6, 'list':[
	//{idx:0,name:'Voidgun',desc:'',long_desc:'',contains:[],flags:0},
	// flags: 0(1) = can wear, 1(2) = container, 2(4) = light, 3(8) = battery, 4(16) = bladed
	{idx:0,name:'Voidgun',keyword:['nothing','gun','voidgun'],desc:'a shiny gun made of nothing',long_desc:'This shiny gun made of strands of the Void actually shoots Nothing!',contains:[],flags:1},
	{idx:1,name:'backpack',keyword:['backpack','pack','leather'],desc:'a rugged leather backpack',long_desc:'This rugged old leather backpack has served you well for years.',contains:[2,3],flags:3},
	{idx:2,name:'knife',keyword:['knife'],desc:'a small folding knife.',long_desc:'This small folding knife has an insignia featuring a heart and a cross engraved into the blade.',contains:[],flags:17},
	{idx:3,name:'flashlight',keyword:['flashlight','light'],desc:'a small flashlight',long_desc:'A small nondescript flashlight with a waterproof seal and bulb.',contains:[4,4],flags:7},
	{idx:4,name:'battery',keyword:['battery'],desc:'a battery',long_desc:'A small battery, perfect for handheld electronic devices like music players and flashlights.',contains:[],flags:8},
	{idx:5,name:'',keyword:[],desc:'',long_desc:'',contains:[],flags:0},
]};


// go, get, drop, hit, inventory, unlock, open, lock, close, eat/drink, wear, unequip, look, help, say, whisper, hello, thank, push, pull, put, empty, who, where, time, when, how
game.command_data = [ ['go','enter','exit','walk'],['get','take'],['drop','throw'],['hit','attack','punch'],['inventory','inv','i'],['unlock'],['open'],['lock'],['close'], ['eat','drink'], ['wear','equip','arm'], ['remove','unequip','disarm'],['look','examine','analyze','peer','what','l'], ['help','aid','assist'],['say','talk'],['whisper','tell'],['hello','hi','greetings'],['thank','thanks'],['push','shove'],['pull','yank','tug'],['put'],['empty','dump'],['who'],['where'],['time'],['when'],['how'] ];




// GAME.JS
// mobiles (player, npcs)
var game_mobile = function(nom) {
	this.idx = null;
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.room = 0;
	this.p_class = 0;
	
	this.inventory = [];
	this.goals = [];
	this.cooldowns = [];
	
	this.flags = null;
	
	
	// init this object
	game.obj_midx++;
	this.idx = game.obj_midx;
}
game_mobile.prototype.move = function(idx) {
	this.room = idx;
	if (this == game.player) {
		game.entering_room();
	}
}



var game_item = function(nom) {
	this.idx = null;
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.flags = null;

	// init this object
	game.obj_oidx++;
	this.idx = game.obj_oidx;
}

var game_room = function(nom) {
	this.idx = null;
	this.name = nom;
	this.desc = '';
	this.long_desc = '';
	this.flags = null;

	this.items = [];
	this.mobiles = [];
	this.exits = [];

	// init this object
	game.obj_ridx++;
	this.idx = game.obj_ridx;
}




// MAIN.JS
// run this stuff
$(document).ready(function(){
	$("#input_box").focus();
	game.init();
	game.new_game();
	
	// enter/return sends command
	$('#game_input').on('submit',function(e){
		e.preventDefault();
		var cmd = $('#input_box').val();
		$('#input_box').val('');
		game.parse(cmd);
		return false;
	});
});
