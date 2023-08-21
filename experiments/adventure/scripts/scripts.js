// DATAS, FOR NOW

// functions
function flags(f_arr) {
	var ret_bin = 0;
	
	// decimal indices into flag array
	for(var lp=0;lp<f_arr.length;lp++) {
		ret_bin += Math.pow(2,f_arr[lp]);
	}
	return ret_bin;
}
function set_flags(obj,f_arr) {
	var ret_bin = obj.flags;
	
	for(var lp=0;lp<f_arr.length;lp++) {
		ret_bin = ret_bin | Math.pow(2,f_arr[lp]);
	}
	
	obj.flags = ret_bin;
}
function clear_flags(obj,f_arr) {
	var ret_bin = obj.flags;
	
	for(var lp=0;lp<f_arr.length;lp++) {
		ret_bin = ret_bin & (65535 - Math.pow(2,f_arr[lp]));
	}
	
	obj.flags = ret_bin;
}
function has_flags(obj,f_arr) {
	var ret_bin = obj.flags;
	var all_true = true;
	
	if(f_arr.length > 0) {
		for(var lp=0;lp<f_arr.length;lp++) {
			if((ret_bin & Math.pow(2,f_arr[lp])) == 0) {
				all_true = false;
			}
		}
	} else {
		all_true = false;
	}
	return all_true;
}
function cap_first(str) {
	var chop_str = str;
	var ret_str = "";
	var first = chop_str.slice(0,1).toUpperCase();
	var rest = chop_str.slice(1);
	ret_str = first + rest;
	
	return ret_str;
}


// gpf - game print flags
var gpf = {BOLD:0,BLUE:1,RED:2,GREEN:3,VIOLET:4};


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
		this.output.log.push(str);
	},
	cls: function() {
		$('#game_window').html("");
	},
	print: function(str,flags = -1) {
		var nhtml = $("#game_window").html();
		if(flags == gpf.BOLD) {
			str = "<strong>"+str+"</strong>";
		}
		if(flags == gpf.BLUE) {
			str = "<strong style='color:blue;'>"+str+"</strong>";
		}
		if(flags == gpf.RED) {
			str = "<strong style='color:red;'>"+str+"</strong>";
		}
		if(flags == gpf.GREEN) {
			str = "<strong style='color:green;'>"+str+"</strong>";
		}
		if(flags == gpf.VIOLET) {
			str = "<strong style='color:purple;'>"+str+"</strong>";
		}
		nhtml += "<br>" + str;
		$('#game_window').html(nhtml);
		$('#game_window').scrollTop($('#game_window').get(0).scrollHeight);
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
				//this.list[this.list.length] = obj;
				this.list.push(obj);
			},
		}
		
		// items
		this.items = {
			list: [],
			
			add: function(obj){
				//this.list[this.list.length] = obj;
				this.list.push(obj);
			},
		}
		
		// create new player
		var new_player = new game_mobile("Player");
		this.mobiles.add(new_player);
		this.player = new_player;
		//this.player.inventory = [1,5]; // backpack, wallet
		this.player.inventory = [5]; // wallet
		this.player.room = 0;
		this.player.events = [];
		this.player.fatigue = 0; // at 50 you could go for a nap; at 75 you start having fatigue issues; at 100 you fall asleep on the spot
		
		
		// start
		this.entering_room(this.player);
		
	},
	find_cmd: function(c_verb) {
		for(var lp=0;lp<game.command_data.length;lp++) {
			if (game.command_data[lp].indexOf(c_verb)>= 0) {
				return lp;
			}
		}
		
		return -1;
	},
	find_obj_in_inventory: function(c_obj,mobile_id) {
		// find in inventory
		if(mobile_id < 1) {
			// player
			for(var lp=0;lp<game.player.inventory.length;lp++){
				var this_id = game.player.inventory[lp];
				
				var kwds = game.item_data.list[this_id].keyword;
				for(var lp2=0;lp2<kwds.length;lp2++) {
					if (kwds[lp2] === c_obj) {
						// this object
						return this_id;
					}
				}
			}
		}
		return -1;
	},
	remove_obj_from_inventory: function(c_obj,mobile_id) {
		// find in inventory
		var this_obj_list_id = -1;
		
		if(mobile_id < 1) { // player
			// find item in inventory
			for(var lp=0;lp<game.player.inventory.length;lp++){
				var this_item = game.player.inventory[lp];
				var kwds = game.item_data.list[this_item].keyword;
				for(var lp2=0;lp2<kwds.length;lp2++) {
					if (kwds[lp2] == c_obj) {
						// this object
						this_obj_list_id = lp;
					}
				}
			}
			
			// remove item
			if(this_obj_list_id > -1) {
				game.player.inventory.splice(this_obj_list_id,1);
			}
		}
	},
	find_obj_in_room: function(c_obj,room_id) {
		// find in room
		var room = game.rooms[room_id];
		
		for(var lp=0; lp<room.items.length;lp++) {
			var item_id = room.items[lp];
			
			var kwds = game.item_data.list[item_id].keyword;
			for(var lp2=0;lp2<kwds.length;lp2++) {
				if(kwds[lp2] === c_obj) {
					// this room
					return item_id;
				}
			}
		}
		
		return -1;
	},
	find_keyword_in_room: function(c_keyword,room_id) {
		// find in room
		var room = game.rooms[room_id];
		
		for(var lp=0;lp<room.keywords.length;lp++) {
			if(room.keywords[lp][0] === c_keyword) {
				return lp;
			}
		}
		
		return -1;
	},
	find_exit_in_room: function(c_exit,room_id) {
		// find in room
		var room = game.rooms[room_id];
		
		for(var lp=0;lp<room.exits.length;lp++) {
			if(room.exits[lp][0] === c_exit) {
				return lp;
			}
			if((room.exits[lp][5] != "") && (room.exits[lp][5] === c_exit)) {
				return lp;
			}
		}
		
		return -1;
	},
	load_rooms: function() {
		
	},
	entering_room: function() {
		var room = game.room_data.list[game.player.room];
		this.cls();
		this.print(room.name,gpf.GREEN);
		this.print('');
		this.print(room.long_desc);
		this.print('');
		
		var items = room.items;
		var items_count = items.length;
		for(var lp=0;lp<items.length;lp++) { // hidden items?
			if(has_flags(game.item_data.list[items[lp]],[itf.NO_SHOW_IN_ROOM]) || has_flags(game.item_data.list[items[lp]],[itf.HIDDEN_UNTIL_EXAMINED])) {
				items_count--;
			}
		}
		
		if (items_count > 0) { // render if there are visible items
			this.print("You see: ",gpf.GREEN);
			for(var lp=0;lp<items.length;lp++) {
				if(!has_flags(game.item_data.list[items[lp]],[itf.NO_SHOW_IN_ROOM]) && !has_flags(game.item_data.list[items[lp]],[itf.HIDDEN_UNTIL_EXAMINED])) { // if not hidden
					game.print(game.item_data.list[items[lp]].desc);
				}
			}
			this.print('');
		}
		
		var exits = room.exits;
		if (exits.length > 0) {
			var exit_str = 'Exits: ';
			for(var lp=0;lp<exits.length;lp++) {
				exit_str += exits[lp][0] + " ";
			}
			this.print(exit_str,gpf.GREEN);
			this.print('');
		}
	},
	parse: function(c_str) {
		var c_fixed = c_str.trim();
		
		var c_parts = c_fixed.split(' ');
		var c_word = 0; // counter
		
		// find the verb
		var c_verb = c_parts[c_word];
		//while(['in','the','a','an','as','to','at','from'].indexOf(c_verb) >= 0) { // stripping common filler words
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
			//console.log(room.exits);
			//console.log(c_verb);
			for(var lp=0;lp<room.exits.length;lp++) {
				if ((room.exits[lp][0] == c_verb) || (room.exits[lp][0].indexOf(c_verb) == 0)) {

					// check if it's open!
					var flag_obj = { flags:room.exits[lp][3] };
					console.log(flag_obj);
					if(!has_flags(flag_obj,[exf.CLOSED])) {
						room_id = room.exits[lp][1];
					} else {
						game.print('The '+room.exits[lp][5]+' is closed.');
						game.print('');
						return;
					}
				}
			}
			
			if(c_verb == "") { // automatically fail if they don't put in a verb at all
				room_id = -1;
			}
			
			if (room_id >= 0) {
				//game.print("GOING: "+c_verb);
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
				case 9: // eat/drink
				case 14: // say/talk
					stuff_pcs = stuff_pcs.splice(c_word,(stuff_pcs.length-c_word));
					stuff = stuff_pcs.join(' ');
					break;
					
				// verb target stuff
				case 0: // go
				case 12: // look
				case 27: // turn
					if (c_parts[c_word]){
						c_object = c_parts[c_word];
						while(['in','the','a','an','as','to','at','with','from','into'].indexOf(c_object) >= 0) {
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
				case 1: // get
				case 20: // put
				default:
					// find the object
					if (c_parts[c_word]){
						c_object = c_parts[c_word];
						while(['in','the','a','an','as','to','at','with','from','into'].indexOf(c_object) >= 0) {
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
						while(['in','the','a','an','as','to','at','with','from','into'].indexOf(c_target) >= 0) {
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
			case 0: // go
				// check if you can go that way
				var room = game.room_data.list[game.player.room];
				var room_id = -1;
				for(var lp=0;lp<room.exits.length;lp++) {
					if ((room.exits[lp][0] == c_object) || (room.exits[lp][0].indexOf(c_object) >= 0)) {
						
						// check if it's open!
						var flag_obj = { flags:room.exits[lp][3] };
						if(!has_flags(flag_obj,[exf.CLOSED])) {
							room_id = room.exits[lp][1];
						} else {
							game.print('The '+room.exits[lp][5]+' is closed.');
							game.print('');
							return;
						}
					}
				}
				if (room_id >= 0) {
					game.player.room = room_id;
					game.entering_room();
				}
				break;
			case 1: // get
				// get out (of bed)
				if(game.player.room == 0 && (c_object === "out" || c_object === "out of bed")) {
					game.player.room = 1;
					game.entering_room();
					return;
				}
				// get in bed
				if(game.player.room == 1 && c_object === "bed") { // "in" gets stripped above
					game.player.room = 0;
					game.entering_room();
					return;
				}
				
			
				// check for the item in the room
				var room = game.room_data.list[game.player.room];
				for(var lp=0;lp<room.items.length;lp++) {
					var itm_id = room.items[lp];
					var game_item = game.item_data.list[itm_id];
					if ((game_item.keyword == c_object) || (game_item.keyword.indexOf(c_object) >= 0)) {
						game.player.inventory[game.player.inventory.length] = itm_id;
						room.items.splice(lp,1);
						game.print('You picked up '+game_item.desc+'.',gpf.BLUE);
						game.print('');
						return;
					}
				}
				
				// check for the item in a container in the room
				for(var lp=0;lp<room.items.length;lp++) {
					var itm_id = room.items[lp];
					var game_item = game.item_data.list[itm_id];
					
					// found container item?
					if((game_item.keyword == c_target) || (game_item.keyword.indexOf(c_target) >= 0)) {	

						// check if it's a container and open
						if(has_flags(game_item,[itf.CONTAINER])) {
							if(has_flags(game_item,[itf.CLOSED])) {
								game.print(cap_first(game_item.desc)+' is closed.');
								game.print('');
								return;
							} else {
								// check items it contains
								for(var lp2=0;lp2<game_item.contains.length;lp2++) {
									var contained_id = game_item.contains[lp2];
									var contained_item = game.item_data.list[contained_id];
									
									if(contained_item.keyword.includes(c_object)) {
										game.print('You took '+contained_item.desc+' out of '+game_item.desc+'.');
										game.print('');
										game.player.inventory[game.player.inventory.length] = contained_id;
										game_item.contains.splice(lp2,1);
										return;
									}
									
								}
							}
						}
					}
				}

				// check for the item in a container in your inventory
				for(var lp=0;lp<game.player.inventory.length;lp++) {
					var item = game.player.inventory[lp];
					var game_item = game.item_data.list[item];
					
					// found container item?
					if(game_item.keyword.indexOf(c_target) >= 0) {	

						// check if it's a container and open
						if(has_flags(game_item,[itf.CONTAINER])) {
							if (has_flags(game_item,[itf.CLOSED])) {
								game.print(cap_first(game_item.desc)+' is closed.');
								game.print('');
								return;
							} else {
								// check items it contains
								for(var lp2=0;lp2<game_item.contains.length;lp2++) {
									var contained_id = game_item.contains[lp2];
									var contained_item = game.item_data.list[contained_id];
									
									if(contained_item.keyword.includes(c_object)) {
										game.print('You took '+contained_item.desc+' out of '+game_item.desc+'.');
										game.print('');
										game.player.inventory[game.player.inventory.length] = contained_id;
										game_item.contains.splice(lp2,1);
										return;
									}
									
								}
							}
						}
					}
				}
				
				game.print("You can't seem to find the "+c_object+".");
				game.print('');
				break;
			case 2: // drop
				// check for the item in your inventory
				var room = game.room_data.list[game.player.room];

				for(var lp=0;lp<game.player.inventory.length;lp++) {
					if ((game.item_data.list[game.player.inventory[lp]].keyword == c_object) || (game.item_data.list[game.player.inventory[lp]].keyword.indexOf(c_object) >= 0)) {
						var itm = game.player.inventory[lp];
						game.player.inventory.splice(lp,1);
						room.items[room.items.length] = itm;
						game.print('You dropped '+game.item_data.list[itm].desc+'.',gpf.BLUE);
						game.print('');
						return;
					}
				}
				
				game.print("You aren't carrying that.");
				game.print('');
				break;
			case 4:	// inventory
				var itens = game.player.inventory.length;
				game.print("You are carrying:",gpf.BLUE);
				
				if (itens > 0) {
					for (var lp=0;lp<itens;lp++) {
						var iten = game.item_data.list[game.player.inventory[lp]].desc;
						game.print(iten);
					}
				} else {
					game.print("Nothing.",gpf.RED);
				}
				game.print('');
				break;
			case 5: // unlock
				if  (c_object != "") {
					// item in inventory?
					var l_obj = game.find_obj_in_inventory(c_object,0);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CAN_LOCK])) {
							if(has_flags(this_obj,[itf.LOCKED])) {
								// check for key
								if(game.player.inventory.indexOf(this_obj.val3) > 0) {
									clear_flags(this_obj,[itf.LOCKED]);
									game.print('You unlock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;
								} else {
									game.print('You don\'t have the proper key to unlock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;									
								}
							} else {
								game.print('It\'s already unlocked.',gpf.RED);
								game.print('');								
								return;
							}
						} else {
							game.print('You can\'t unlock that.',gpf.RED);
							game.print('');
							return;
						}
					}
					
					// item in room?
					l_obj = -1;
					l_obj = game.find_obj_in_room(c_object,game.player.room);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CAN_LOCK])) {
							if(has_flags(this_obj,[itf.LOCKED])) {
								if(game.player.inventory.indexOf(this_obj.val3) > 0) {
									clear_flags(this_obj,[itf.LOCKED]);
									game.print('You unlock '+game.item_data.list[l_obj].desc+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('You don\'t have the proper key to unlock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;									
								}
							} else {
								game.print('It\'s already unlocked.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('You can\'t unlock that.',gpf.RED);
							game.print('');
							return;
						}
					}
					
					// room exit?
					var r_exit = -1;
					r_exit = game.find_exit_in_room(c_object,game.player.room);
					if(r_exit >= 0) {
						var this_exit = game.room_data.list[game.player.room].exits[r_exit];
						console.log(this_exit);
						
						var flag_obj = { flags: this_exit[3] };
						if(has_flags(flag_obj,[exf.CAN_LOCK])) {
							if(has_flags(flag_obj,[exf.LOCKED])) {
								if(game.player.inventory.indexOf(this_exit[4]) > 0) {
									clear_flags(flag_obj,[exf.LOCKED]);
									game.room_data.list[game.player.room].exits[r_exit][3] = flag_obj.flags;
									game.print('You unlock the '+this_exit[5]+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('You don\'t have the proper key to unlock the '+this_exit[5]+'.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('It\'s already unlocked.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('You can\'t unlock that.',gpf.RED);
							game.print('');
							return;
						}
					}
				}
				// fail
				game.print("I'm not sure what you're trying to unlock.",gpf.RED);
				game.print('');
				break;
			case 6: // open
				if  (c_object != "") {
					// item in inventory?
					var l_obj = game.find_obj_in_inventory(c_object,0);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						
						if(!has_flags(this_obj,[itf.LOCKED])) {
							if(has_flags(this_obj,[itf.CAN_CLOSE])) {								
								if(has_flags(this_obj,[itf.CLOSED])) {
									clear_flags(this_obj,[itf.CLOSED]);
									
									game.print('You open '+this_obj.desc+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('It\'s already open.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('You can\'t open that.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print(cap_first(this_obj.desc)+' is locked.',gpf.RED);
							game.print('');
							return;
						}
					}
					
					// item in room?
					l_obj = -1;
					l_obj = game.find_obj_in_room(c_object,game.player.room);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(!has_flags(this_obj,[itf.LOCKED])) {
							if(has_flags(this_obj,[itf.CAN_CLOSE])) {
								if(has_flags(this_obj,[itf.CLOSED])) {
									clear_flags(this_obj,[itf.CLOSED]);
				
									// unhide!
									if(has_flags(this_obj,[itf.HIDDEN_UNTIL_EXAMINED])) {
										clear_flags(this_obj,[itf.HIDDEN_UNTIL_EXAMINED]);
									}

									// opened!
									game.print('You open '+game.item_data.list[l_obj].desc+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('It\'s already open.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('You can\'t open that.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print(cap_first(this_obj.desc)+' is locked.',gpf.RED);
							game.print('');
							return;
						}
					}
					
					// room exit?
					var r_exit = -1;
					r_exit = game.find_exit_in_room(c_object,game.player.room);
					if(r_exit >= 0) {
						var this_exit = game.room_data.list[game.player.room].exits[r_exit];
						console.log(this_exit);
						
						var flag_obj = { flags: this_exit[3] };
						if(!has_flags(flag_obj,[exf.LOCKED])) {
							if(has_flags(flag_obj,[exf.CAN_CLOSE])) {
								if(has_flags(flag_obj,[exf.CLOSED])) {
									clear_flags(flag_obj,[exf.CLOSED]);
									game.room_data.list[game.player.room].exits[r_exit][3] = flag_obj.flags;
									game.print('You open the '+this_exit[5]+'.',gpf.BLUE);
									game.print('');
									return;
									
								} else {
									game.print('It\'s already open.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('You can\'t open it because it can\'t be closed.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('The '+this_exit[5]+' is locked.',gpf.RED);
							game.print('');
							return;
						}
					}

					
					
					// fail
					game.print("I'm not sure what you're trying to open.",gpf.RED);
					game.print('');
				}
				break;
			case 7: // lock
				if  (c_object != "") {
					// item in inventory?
					var l_obj = game.find_obj_in_inventory(c_object,0);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CAN_LOCK])) {
							if(!has_flags(this_obj,[itf.LOCKED])) {
								// check for key
								if(game.player.inventory.indexOf(this_obj.val3) > 0) {
									set_flags(this_obj,[itf.LOCKED]);
									game.print('You lock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;
								} else {
									game.print('You don\'t have the proper key to lock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;									
								}
							} else {
								game.print('It\'s already locked.',gpf.RED);
								game.print('');								
								return;
							}
						} else {
							game.print('You can\'t lock that.',gpf.RED);
							game.print('');
							return;
						}
					}
					
					// item in room?
					l_obj = -1;
					l_obj = game.find_obj_in_room(c_object,game.player.room);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CAN_LOCK])) {
							if(!has_flags(this_obj,[itf.LOCKED])) {
								if(game.player.inventory.indexOf(this_obj.val3) > 0) {
									set_flags(this_obj,[itf.LOCKED]);
									game.print('You lock '+game.item_data.list[l_obj].desc+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('You don\'t have the proper key to lock '+this_obj.desc+'.',gpf.BLUE);
									game.print('');									
									return;									
								}
							} else {
								game.print('It\'s already locked.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('You can\'t lock that.',gpf.RED);
							game.print('');
							return;
						}
					}

					// room exit?
					var r_exit = -1;
					r_exit = game.find_exit_in_room(c_object,game.player.room);
					if(r_exit >= 0) {
						var this_exit = game.room_data.list[game.player.room].exits[r_exit];
						console.log(this_exit);
						
						var flag_obj = { flags: this_exit[3] };
						if(has_flags(flag_obj,[exf.CAN_LOCK])) {
							if(!has_flags(flag_obj,[exf.LOCKED])) {
								if(game.player.inventory.indexOf(this_exit[4]) > 0) {
									set_flags(flag_obj,[exf.LOCKED]);
									this_exit[3] = flag_obj.flags;
									game.print('You lock the '+this_exit[5]+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('You don\'t have the proper key to lock the '+this_exit[5]+'.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('It\'s already locked.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('You can\'t lock that.',gpf.RED);
							game.print('');
							return;
						}
					}
				}
				// fail
				game.print("I'm not sure what you're trying to lock.",gpf.RED);
				game.print('');
				break;
			case 8: // close
				if  (c_object != "") {
					// item in inventory?
					var l_obj = game.find_obj_in_inventory(c_object,0);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CONTAINER])) {
							if(!has_flags(this_obj,[itf.CLOSED])) {
								set_flags(this_obj,[itf.CLOSED]);
								
								game.print('You close '+this_obj.desc+'.',gpf.BLUE);
								game.print('');
								
								return;
							} else {
								game.print('It\'s already closed.',gpf.RED);
								game.print('');
								
								return;
							}
						} else {
							game.print('You can\'t close that.',gpf.RED);
							game.print('');

							return;
						}
					}
					
					// item in room?
					l_obj = -1;
					l_obj = game.find_obj_in_room(c_object,game.player.room);
					if(l_obj >= 0) {
						var this_obj = game.item_data.list[l_obj];
						if(has_flags(this_obj,[itf.CONTAINER])) {
							if(!has_flags(this_obj,[itf.CLOSED])) {
								set_flags(this_obj,[itf.CLOSED]);

								game.print('You close '+game.item_data.list[l_obj].desc+'.',gpf.BLUE);
								game.print('');
								
								return;
							} else {
								game.print('It\'s already closed.',gpf.RED);
								game.print('');
								
								return;
							}
						} else {
							game.print('You can\'t close that.',gpf.RED);
							game.print('');
							
							return;
						}
					}
					
					
					// room exit?
					var r_exit = -1;
					r_exit = game.find_exit_in_room(c_object,game.player.room);
					if(r_exit >= 0) {
						var this_exit = game.room_data.list[game.player.room].exits[r_exit];
						console.log(this_exit);
						
						var flag_obj = { flags: this_exit[3] };
						if(!has_flags(flag_obj,[exf.LOCKED])) {
							if(has_flags(flag_obj,[exf.CAN_CLOSE])) {
								if(!has_flags(flag_obj,[exf.CLOSED])) {
									set_flags(flag_obj,[exf.CLOSED]);
									this_exit[3] = flag_obj.flags;
									game.print('You close the '+this_exit[5]+'.',gpf.BLUE);
									game.print('');
									return;
								} else {
									game.print('It\'s already closed.',gpf.RED);
									game.print('');
									return;
								}
							} else {
								game.print('You can\'t close it.',gpf.RED);
								game.print('');
								return;
							}
						} else {
							game.print('The '+this_exit[5]+' is locked already.',gpf.RED);
							game.print('');
							return;
						}
					}
				}


				// fail
				game.print("I'm not sure what you're trying to close.",gpf.RED);
				game.print('');
				break;
			case 9: // eat/drink
				game.print("You pantomime "+c_verb+"ing the "+stuff+'.');
				game.print('');
				break;
			case 12: // look
				if (c_object != "") {
					// at item in inventory?
					var l_obj = game.find_obj_in_inventory(c_object,0);
					if (l_obj >= 0) {
						game.print('You look at your '+c_object+'.',gpf.BLUE);
						var this_obj = game.item_data.list[l_obj];
						game.print(this_obj.long_desc);

						
						if(has_flags(this_obj,[itf.CONTAINER])) { //
							if (has_flags(this_obj,[itf.CLOSED])) {
								game.print('');
								game.print("It is closed.",gpf.GREEN);
							} else {
								game.print('');
								game.print("It contains:",gpf.GREEN);
								if(this_obj.contains.length > 0) {
									for(contained of this_obj.contains) {
										var contained_obj = game.item_data.list[contained];
										game.print(contained_obj.desc);
									}
								} else {
									game.print("Nothing.",gpf.RED);
								}
							}
							
						}
						game.print('');
						return;
					}
					
					// at item in room?
					l_obj = -1;
					l_obj = game.find_obj_in_room(c_object,game.player.room);
					if (l_obj >= 0) {
						var obj = game.item_data.list[l_obj];
						game.print('You look at '+obj.desc+'.',gpf.BLUE);
						game.print(obj.long_desc);

						// unhide!
						if(has_flags(obj,[itf.HIDDEN_UNTIL_EXAMINED])) {
							clear_flags(obj,[itf.HIDDEN_UNTIL_EXAMINED]);
						}
						
						if(has_flags(obj,[itf.CONTAINER])) { // container
							if (has_flags(obj,[itf.CLOSED])) {
								game.print('');
								game.print("It is closed.",gpf.GREEN);
							} else {
								game.print('');
								game.print("It contains:",gpf.GREEN);
								if(obj.contains.length > 0) {
									for(contained of obj.contains) {
										var contained_obj = game.item_data.list[contained];
										game.print(contained_obj.desc);
									}
								} else {
									game.print("Nothing.",gpf.RED);
								}
							}
							
						}
						
						if(has_flags(obj,[itf.CAN_ACTIVATE])) { // can be activated?
							if(has_flags(obj,[itf.ACTIVATED])) {
								game.print('The '+obj.name+' is turned on.');
							} else {
								game.print('The '+obj.name+' is turned off.');
							}
						}
						game.print('');
						return;
					}

					// at keyword?
					l_obj = -1;
					l_obj = game.find_keyword_in_room(c_object,game.player.room);
					if (l_obj >= 0) {
						var room = game.rooms[game.player.room];
						game.print("You examine the "+room.keywords[l_obj][0]+".",gpf.BLUE);
						game.print(room.keywords[l_obj][1]);
						game.print('');
						return;
					}
					
					// at exit?
					l_obj = game.find_exit_in_room(c_object,game.player.room);
					if (l_obj >= 0) {
						var room = game.rooms[game.player.room];
						game.print("You look to the "+room.exits[l_obj][0]+".",gpf.BLUE);
						game.print(room.exits[l_obj][2]);
						game.print('');
						return;
					}
					
					
					// fail
					game.print("I'm not sure what you're looking for.",gpf.RED);
					game.print('');
				} else {
					game.entering_room();
				}
				break;
			case 14: // say/talk
				game.print('You say "'+stuff+'" out loud.',gpf.BLUE);
				game.print('');
				break;
			case 20: // put
				var game_item = null;
				var game_item_id = -1;
				var game_container = null;
				var game_container_id = -1;
				
				// check for the item in your inventory
				game_item_id = game.find_obj_in_inventory(c_object,0);
				if (game_item_id >= 0) {
					game_item = game.item_data.list[game_item_id];
				}


				// check for the container in the room
				game_container_id = game.find_obj_in_room(c_target,game.player.room);
				if (game_container_id >= 0) {
					game_container = game.item_data.list[game_container_id];
				} else {
					// check for the container in your inventory
					game_container_id = game.find_obj_in_inventory(c_target,0);
					if (game_container_id >= 0) {
						game_container = game.item_data.list[game_container_id];
					}
				}
				
				// if the container and the item exist
				if((game_container != null) && (game_item != null)) {
					if(has_flags(game_container,[itf.CONTAINER])) {
						if(has_flags(game_container,[itf.CLOSED])) {
							game.print(cap_first(game_container.desc)+' is closed.');
							game.print('');
							return;
						} else {
							game_container.contains.push(game_item_id);
							game.remove_obj_from_inventory(c_object,0);
							game.print('You put '+game_item.desc+' in '+game_container.desc+'.');
							game.print('');
							return;
						}
					} else {
						game.print(cap_first(game_container.desc)+" isn't a container.");
						game.print('');
						return;
					}
				}
				
				if(game_container == null) {
					game.print("You can't seem to find the "+c_target+".");
					game.print('');
					return;
				}
				
				game.print("You can't seem to find the "+c_object+".");
				game.print('');
				break;
			case 23: // sleep
				// tired yet?
				if(game.player.fatigue < 50) {
					game.print("You're not feeling tired right now.");
					game.print('');
					return;
				}
				
				// in a place we can sleep?
				//if(game.room_data.list[game.player.room].flags) {
				//	
				//}
				break;
			case 24: // touch
			case 25: // activate
			case 26: // deactivate
			case 27: // turn (on, off, left, right)
				// find object
				var game_item = null;
				var game_item_id = -1;
				
				// check for the item in your inventory
				game_item_id = game.find_obj_in_inventory(c_object,0);
				if (game_item_id >= 0) {
					game_item = game.item_data.list[game_item_id];
				} else {
					// check for the container in the room
					game_item_id = game.find_obj_in_room(c_object,game.player.room);
					if (game_item_id >= 0) {
						game_item = game.item_data.list[game_item_id];
						
					} else {
						// can't find it!
						game.print("You can't seem to find the "+c_object+".");
						game.print('');
						return;
					}
				}
				
				// check if it can be activated
				if(!has_flags(game_item,[itf.CAN_ACTIVATE])) {
					switch(c_verb) {
						case "touch":
							game.print("Touching the "+game_item.name+" seems to have no effect.");							
							break;
						case "turn":
							game.print("You can't seem to find a way to "+c_verb+" the "+game_item.name+" "+stuff+".");							
							break;
						default:
							game.print("Nothing about the "+game_item.name+" can be "+c_verb+"d.");
							break;
					}
					game.print('');
					return;
				}
				
				// unhide!
				if(has_flags(game_item,[itf.HIDDEN_UNTIL_EXAMINED])) {
					clear_flags(game_item,[itf.HIDDEN_UNTIL_EXAMINED]);
				}
				
				// touch
				if((game_item != null) && (c_verb === "touch")) {
					game.print('You touch the '+game_item.name+'.');
					
					var activated_state = false;
					activated_state = has_flags(game_item,[itf.ACTIVATED]);
					if(activated_state) {
						c_verb = "deactivate";
					} else {
						c_verb = "activate";
					}
				}
				// turn on
				if((game_item != null) && ((c_verb === "activate")||(stuff === "on"))) {
					set_flags(game_item,[itf.ACTIVATED]);
					//game.print('TURN ON:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					game.print('The '+game_item.name+' turns on.');
					game.print('');
					return;
				}
				// turn off
				if((game_item != null) && ((c_verb === "deactivate")||(stuff === "off"))) {
					clear_flags(game_item,[itf.ACTIVATED]);
					//game.print('TURN OFF:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					game.print('The '+game_item.name+' turns off.');
					game.print('');
					return;
				}
				/* new features for later!
				// turn left
				if((game_item != null) && (stuff === "left")) {
					game.print('TURN LEFT:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					return;
				}
				// turn right
				if((game_item != null) && (stuff === "right")) {
					game.print('TURN RIGHT:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					return;
				}
				// turn up
				if((game_item != null) && (stuff === "up")) {
					game.print('TURN UP:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					return;
				}
				// turn down
				if((game_item != null) && (stuff === "down")) {
					game.print('TURN DOWN:"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
					return;
				}
				*/
				break;
			case -1: // directional
				console.log('-1');
				break;
			default:
				game.print('"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
				game.print('');
				break;
		}
		//game.log('"'+c_verb+':('+match+'):'+c_object+':'+c_target+'  **'+stuff+'**"');
		//game.print('');
		
	},
	
};



game.mobile_data = { 'idx':1, 'list':[
	//{idx:0,name:'Void Child',desc:'',long_desc:'',room:0,p_class:0,inventory:[],goals:[],cooldowns:[],flags:0},
	{idx:0,name:'Void Child',desc:'',long_desc:'',room:0,p_class:0,inventory:[],goals:[],cooldowns:[],flags:0}
]};

var rmf = {INDOORS:0,OUTDOORS:1,UNDERGROUND:2,UNDERWATER:3,TOXIC:4,DARK:5,GAS_FILLED:6,CAN_SLEEP:7,};
var exf = {CAN_CLOSE:0,CLOSED:1,CAN_LOCK:2,LOCKED:3,};
game.room_data = { 'idx':5, 'list':[
	/* 
	{
		idx:0,
		name:'Void',
		desc:'You are trapped in the Void.',
		long_desc:'You are hopelessly lost in the Void.',
		flags:flags([rmf.INDOORS]),
		items:[],
		keywords: [['void','A maze that stretches as far as the eye can see, though the eye cannot see it.'],],
		npcs:[],
		exits:[['north',0,'A long corridor leading north.',key_item_id,'door_name',exit_door_id],['here',0,'Here and there and everywhere.',flags,key_item_id,'door_name',exit_door_id],['there',0,'There is no place like home.',flags,key_item_id,'door_name',exit_door_id],['somewhere else',0,'Be afraid... be VERY afraid.',flags,key_item_id,'door_name',exit_door_id]]
	},
	*/
	
	{
		idx: 0,
		name: "Laying in Bed",
		desc: "A bed in an unfamiliar bedroom.",
		long_desc: "As you awaken from a tormenting nightmare, you find that you're laying in a bed in an unfamiliar bedroom. You don't know how you got here, or for that matter, where here is. Your head is very cloudy and your memory of the nightmare quickly slips away.",
		flags: flags([rmf.INDOORS,rmf.CAN_SLEEP]),
		items: [],
		keywords: [['bedroom','This doesn\'t seem to be your bedroom, but you\'re really not sure...']],
		exits: [['out',1,'Get out of bed.',0,-1,'',-1]],
	},
	{
		idx: 1,
		name: "Bedroom",
		desc: "You see an unfamiliar bedroom.",
		long_desc: "You're standing in an unfamiliar bedroom. The room is sparsely furnished, with only a bed and a desk with a chair. A bathroom can be seen through the open north doorway and there is another door to the west.",
		flags: 0,
		items: [10],
		keywords: [['bed','The bed is large but plain. A simple tan blanket covers a simple white sheet. One large pillow still has a divot from your head resting on it.'],['desk','The desk has a lamp, a calendar, and a clock on it.'],['chair','The chair is reasonably plain.'],['clock','The clock reads 1:15 PM.'],['calendar','The calendar is open to the month of April.']],
		exits: [['bed',0,'Climb into the bed.',0,-1,'',-1],['north',2,'A small bathroom is on the other side of the doorway.',0,-1,'',-1],['west',3,'This door leads to a hallway.',flags([exf.CAN_CLOSE,exf.CLOSED]),-1,'door',0]],
	},
	{
		idx: 2,
		name: "Bathroom",
		desc: "You see a simple bathroom.",
		long_desc: "This is a simple and fairly modest bathroom, attached to the bedroom. It holds a shower, a vanity with a mirror, and a toilet.",
		flags: 0,
		items: [8],
		keywords: [['shower','The walls and floor of the shower are dry. Looks like it hasn\'t been used today.'],['vanity','The vanity holds a small sink, some shelves on either side of the sink, and a large mirror.'],['toilet','The toilet looks very old-fashioned, with the water tank high up on the wall.'],],
		exits: [['south',1,'The bedroom is to the south.',0,-1,'',-1]],
	},
	{
		idx: 3,
		name: "Hallway",
		desc: "The hallway runs past a bedroom.",
		long_desc: "Hallway outside bedroom!!!",
		flags: 0,
		items: [],
		keywords: [],
		exits: [['east',1,'Through the door is an unfamiliar bedroom.',0,-1,'door',0],['south',4,'The hallway opens up into the living room.',0,-1,'',-1]],
	},
	{
		idx: 4,
		name: "Living Room",
		desc: "The living room is sparsely furnished in muted colors.",
		long_desc: "The living room is sparsely furnished in muted colors. A couch with an end table sits on one side of the room and an entertainment center with a TV and a stereo sit on the other side of the room.",
		flags: 0,
		items: [],
		keywords: [['table','The small wooden table with a simple stained finish, showing the natural wood grain. A small black wooden chest sits on the end table.'],],
		exits: [['north',3,'A hallway leads north through the house.',0,-1,'',-1]],
	},
	
]};

var itf = {WEARABLE:0,CONTAINER:1,LIGHT:2,BATTERY:3,BLADED:4,CAN_CLOSE:5,CLOSED:6,GUN:7,FIRE:8,CAN_LOCK:9,LOCKED:10,DROP_BREAK:11,NO_SHOW_IN_ROOM:12,CAN_ACTIVATE:13,ACTIVATED:14,HIDDEN_UNTIL_EXAMINED:15};
// flags: 0(1) = can wear, 1(2) = container, 2(4) = light, 3(8) = battery, 4(16) = bladed, 5(32) = can close, 6(64) = closed, 7(128) = gun, 8(256) = fire, 9(512) = has lock, 10(1024) = locked, etc
// vals:
// type			val1		val2 		val3
// bladed		damage
// gun			damage		ammo
// container	capacity	
// battery		life(t)
// fire			life(t)
// locked								key

game.item_data = { 'idx':8, 'list':[
	{idx:0,name:'Voidgun',keyword:['nothing','gun','voidgun'],desc:'a shiny gun made of nothing',long_desc:'This shiny gun made of strands of the Void actually shoots Nothing!',contains:[],flags:flags([itf.WEARABLE]),weight:5,val1:10,val2:10,val3:0},
	{idx:1,name:'backpack',keyword:['backpack','pack','leather'],desc:'a rugged leather backpack',long_desc:'This rugged old leather backpack has served you well for years.',contains:[2,3],flags:flags([itf.CONTAINER,itf.CAN_CLOSE,itf.CLOSED]),weight:2,val1:15,val2:0,val3:0},
	{idx:2,name:'knife',keyword:['knife'],desc:'a small folding knife',long_desc:'This small folding knife has an insignia featuring a heart and a cross engraved into the blade.',contains:[],flags:flags([itf.WEARABLE,itf.BLADED]),weight:0.5,val1:5,val2:0,val3:0},
	{idx:3,name:'flashlight',keyword:['flashlight','light'],desc:'a small flashlight',long_desc:'This is a small nondescript flashlight with a waterproof seal and bulb.',contains:[4,4],flags:flags([itf.WEARABLE,itf.CONTAINER,itf.CAN_CLOSE,itf.CLOSED,itf.LIGHT]),weight:1,val1:0.5,val2:0,val3:0},
	{idx:4,name:'battery',keyword:['small','battery'],desc:'a small battery',long_desc:'This is a small battery, perfect for handheld electronic devices like music players and flashlights.',contains:[],flags:flags([itf.BATTERY]),weight:0.25,val1:80,val2:0,val3:0},
	{idx:5,name:'wallet',keyword:['black','leather','wallet'],desc:'a black leather wallet',long_desc:'This wallet is made of black leather and is very old and worn smooth.',contains:[6],flags:flags([itf.CONTAINER,itf.CAN_CLOSE,itf.CLOSED]),weight:1,val1:1,val2:0,val3:0},
	{idx:6,name:'credit card',keyword:['credit','card'],desc:'a credit card',long_desc:'This is an expired S-Mart credit card.',contains:[],flags:0,weight:0,val1:0,val2:0,val3:0},
	{idx:7,name:'black wooden chest',keyword:['black','wooden','chest'],desc:'a black wooden chest',long_desc:'A small black wooden chest is part tabletop kitsch, part doodad container.',contains:[],flags:flags([itf.CONTAINER,itf.CAN_CLOSE,itf.CLOSED,itf.CAN_LOCK,itf.LOCKED,itf.HIDDEN_UNTIL_EXAMINED]),weight:5,val1:0,val2:0,val3:0},
	{idx:8,name:'mirror',keyword:['mirror'],desc:'a vanity mirror',long_desc:'The vanity mirror is large enough to stand back and take a good look at yourself. The conceals a small medicine cabinet.',contains:[9],flags:flags([itf.CONTAINER,itf.CAN_CLOSE,itf.CLOSED,itf.HIDDEN_UNTIL_EXAMINED]),weight:9999,val1:0,val2:0,val3:0},
	{idx:9,name:'razor',keyword:['razor'],desc:'a small folding razor',long_desc:'This small folding razor has an insignia featuring a heart and a cross engraved into the blade.',contains:[],flags:flags([itf.WEARABLE,itf.BLADED]),weight:0.25,val1:3,val2:0,val3:0},
	{idx:10,name:'lamp',keyword:['stained','glass','lamp'],desc:'a stained glass lamp',long_desc:'The lamp looks like it\'s touch-activated, and the lampshade is covered in monotone stained glass.',contains:[],flags:flags([itf.LIGHT,itf.CAN_ACTIVATE,itf.NO_SHOW_IN_ROOM]),weight:10,val1:0,val2:0,val3:0},	
	//{idx:8,name:'new item',keyword:['new item'],desc:'a new item',long_desc:'',contains:[],flags:0,weight:0,val1:0,val2:0,val3:0},
	//{idx:8,name:'new item',keyword:['new item'],desc:'a new item',long_desc:'',contains:[],flags:0,weight:0,val1:0,val2:0,val3:0},
]};


game.command_data = [ 
/*  0 */['go','enter','exit','walk'], // go - DONE; exf.CLOSED DONE
/*  1 */['get','take'], // get - DONE
/*  2 */['drop','throw'], // drop - DONE
/*  3 */['hit','attack','smash'], // hit
/*  4 */['inventory','inv','i'], // inventory - DONE
/*  5 */['unlock'], // unlock - DONE
/*  6 */['open'], // open - DONE
/*  7 */['lock'], // lock - DONE
/*  8 */['close'], // close - DONE; exf.LOCKED DONE
/*  9 */['eat','drink'], // eat/drink 
/* 10 */['wear','equip','arm'], // wear
/* 11 */['remove','unequip','disarm','use'], // unequip
/* 12 */['look','examine','analyze','peer','what','l','exa'], // look - DONE
/* 13 */['help','aid','assist'], // help
/* 14 */['say','talk'], // say
/* 15 */['whisper','tell'], // whisper
/* 16 */['hello','hi','greet','greetings'], // hello
/* 17 */['thank','thanks'], // thank
/* 18 */['push','shove'], // push
/* 19 */['pull','yank','tug'], // pull
/* 20 */['put'], // put - DONE
/* 21 */['empty','dump'], // empty
/* 22 */['hide'], // hide
/* 23 */['sleep'], // sleep
/* 24 */['touch'], // touch activate/deactivate?
/* 25 */['activate'], // activate
/* 26 */['deactivate'], // activate
/* 27 */['turn'], // turn on/off


/* 95 */['who'], // who
/* 96 */['where'], // where
/* 97 */['time'], // time
/* 98 */['when'], // when
/* 99 */['how'], // how
];




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
