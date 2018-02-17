/**
 * @author 	Jon Taylor
 * @define 	To provide an async alternative to for loop.
 * @arg 		obj	Object
 * @arg			cb 	callback
 * @return 	(key, value, done) 
 * @example var arr = ['kevin', 'jack', 'john', 'jimmy', 'fank']
 * 		forEachAsync(arr, function(key, val, done) {
 * 		// Perform your code to check what you want to check
 * 		if(key === 4) {  // checking for if this is the 5th item in the array
 * 			console.log(val);
 * 		done();
 * });
 */
function forEachAsync(obj, cb) {
	if(!obj.value) obj = {
		value : Object.values(obj),
		key : Object.keys(obj)
	}

	/**
	 * @author 	Jon Taylor
	 * @define 	Checks if there is there are any more left inside the loop.
	 * @return  false/forEachAsync
	 */
	var done = function() {
		console.log(obj);
		if(obj.value.length <= 0)
			return false;
		else 
			forEachAsync(obj, cb);
	}

	// To prevent Stack Overlfow
	setTimeout(function() {
		cb(obj.key.shift(), obj.value.shift(), done);
	}, 10)
	
}

var TwitchUser = function(clientId, username, cb) {

	this.streamURL = "https://api.twitch.tv/kraken/streams/" + username + "?client_id=" + clientId;
	this.channelURL = "https://api.twitch.tv/kraken/channels/" + username + "?client_id=" + clientId;

	this.online = false;
	this.username = username;
	this.name = '';
	this.game = '';
	this.url = '';
	this.logo = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_600x600.png';
	
	var self = this;

	var isOnline = function(cb) {
		$.getJSON(self.streamURL, function(data) {
			if(data.stream === null)
				self.online = false;
			else
				self.online = true;
			cb()
		}).fail(function() {
			self.online = "404 Not Found";
		})
	};
	var getInfo = function(cb) {
		$.getJSON(self.channelURL, function(data) {
			self.name = data.display_name;
			if(data.logo !== null)
				self.logo = data.logo;
			self.game = data.game;
			self.url = data.url;
			cb()
		}).fail(function() {
			self.online = "404 Not Found";
			self.name = self.username;
			self.game = '';
			self.url = 'https://www.twitch.tv/404';
			cb()
		})
	};

	isOnline(function() {
		getInfo(function() {
			setStreamer(self, cb);
		});
	});
	
}

function setStreamer(TwitchUser, cb) {
	var html = "<a href = '";
	if(TwitchUser.online.constructor === String) {
		html += TwitchUser.url;
		html += "' target='_blank'><div class = 'container-fluid'><div class = 'row offline'><div class = 'col-3 vcenter'><img src = '";
		html += TwitchUser.logo;
		html += "' class = 'logo'></div><div class = 'col-9'><h2 class = 'upper'>";
		html += TwitchUser.name;
		html += "</h2><br><p class = 'status'><i>";
		html += "404 Not Found";
		html += "</i></p></div></div></div></a>";
		$("#streamersOff")
			.prepend(html);
	} else if (!TwitchUser.online) {
		html += TwitchUser.url;
		html += "' target='_blank'><div class = 'container-fluid'><div class = 'row offline'><div class = 'col-3 vcenter'><img src = '";
		html += TwitchUser.logo;
		html += "' class = 'logo'></div><div class = 'col-9'><h2 class = 'upper'>";
		html += TwitchUser.name;
		html += "</h2><br><p class = 'status'><i>Offline</i></p></div></div></div></a>";
		$("#streamersOff")
			.prepend(html);
	} else {
		html +=	TwitchUser.url;
		html += "' target='_blank'><div class = 'container-fluid cards'><div class = 'row online'><div class = 'col-3 vcenter'><img src = '";
		html += TwitchUser.logo;
		html += "' class = 'logo'></div><div class = 'col-9'><h2 class = 'upper text-center'>";
		html += TwitchUser.name;
		html += "</h2><br><p class = 'status'>Playing ";
		html += TwitchUser.game;
		html += "</p></div></div></div></a>";
		$("#streamers")
			.prepend(html);
	}
	cb();
}

function getUsers(users) {

	forEachAsync(users, function(i, user, done) {
		var streamer = new TwitchUser(clientId, user, function() {
			done();
		});
	});
}

var usernames = ["FreeCodeCamp", "lirik", "giantwaffle", "shortyyguy", "timthetatman", "scrubkillarl_", "blackfoxy12", "activee", "monstercat", "miramisu", "kronovi"];
var clientId = "8yiglzu05taulkg1gdg9co5viztolv";

$(document).ready(function() {
	var cssOn = {
		color: "white",
		boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.3), inset 0px 0px 10px 3px rgba(255, 255, 255, 0.3)",
		textShadow: "0 3px 3px rgba(0, 0, 0, 0.3)"
	};
	var cssOff = {
		color: "#A28DC8",
		boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.3)",
		textShadow: "none"
	};
	$("#on").click(function() {
		$("#streamers").show();
		$("#streamersOff").hide();
		$("#on").css(cssOn);
		$("#all").css(cssOff);
		$("#off").css(cssOff);
	});
	$("#all").click(function() {
		$("#streamers").show();
		$("#streamersOff").show();
		$("#on").css(cssOff);
		$("#all").css(cssOn);
		$("#off").css(cssOff);
	});
	$("#off").click(function() {
		$("#streamers").hide();
		$("#streamersOff").show();
		$("#on").css(cssOff);
		$("#all").css(cssOff);
		$("#off").css(cssOn);
	});



	// ~~ Push a new name to the usernames array ~~ //
	$("#plus").click(function() {
		$(".online, .offline").remove();
		var add = $("#searchBar").val();
		//var duplicate = usernames.indexOf($("#searchBar").val());
		$("#searchBar").val("");
		if (add === "") {
			$(".error").html("<p>Add a username</p>");
			getUsers(usernames, clientId);
		} else if ($(".error") && add) {
			usernames.push(add);
			$(".error").empty();
			getUsers(usernames, clientId);
		} else {
			usernames.push(add);
			getUsers(usernames, clientId);
		}
	}); // end of #plus.click
	// ~~ Uses the #plus.click to include pressing enter ~~//
	$("input").keyup(function(enter) {
		if (enter.keyCode == 13) {
			$("#plus").click();
		}
	}); // end of input.keyup
	getUsers(usernames, clientId);
}); // end of ready
