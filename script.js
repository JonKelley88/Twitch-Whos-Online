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

$(document).ready(function() {
	var usernames = ["FreeCodeCamp", "lirik", "giantwaffle", "shortyyguy", "timthetatman", "scrubkillarl_", "blackfoxy12", "activee", "monstercat", "miramisu", "kronovi"];

	function getUsers() {
		for (i = 0; i < usernames.length; i++) {
			(function(i) {
				var streamsURL = "https://api.twitch.tv/kraken/streams/" + usernames[i] + "?client_id=8yiglzu05taulkg1gdg9co5viztolv";
				var channelsURL = "https://api.twitch.tv/kraken/channels/" + usernames[i] + "?client_id=8yiglzu05taulkg1gdg9co5viztolv";
				// ~~ getJSON for stream info ~~ //
				$.getJSON(streamsURL, function(data1) {
					var online = "";
					if (data1.stream === null) {
						online = false;
					} else {
						online = true;
					}
					// ~~ nested getJSON for channel info ~~ //
					$.getJSON(channelsURL, function(data2) {
						// ~~ Checks if the streamer has a logo ~~ //
						if (data2.logo === null) {
							logo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_600x600.png";
						} else {
							logo = data2.logo;
						}
						name = data2.display_name;
						game = data2.game;
						link = data2.url;
						if (online === true) {
							$("#streamers").prepend("<a href = '" + link + "' target='_blank'><div class = 'container-fluid cards'><div class = 'row online'><div class = 'col-3 vcenter'><img src = '" + logo + "' class = 'logo'></div><div class = 'col-9'><h2 class = 'upper text-center'>" + name + "</h2><br><p class = 'status'>Playing " + game + "</p></div></div></div></a>");
						} else {
							$("#streamersOff").prepend("<a href = '" + link + "' target='_blank'><div class = 'container-fluid'><div class = 'row offline'><div class = 'col-3 vcenter'><img src = '" + logo + "' class = 'logo'></div><div class = 'col-9'><h2 class = 'upper'>" + name + "</h2><br><p class = 'status'><i>Offline</i></p></div></div></div></a>");
						} // end of if statement
					}); // end of nested getJSON
				}); // end of first getJSON
			})(i); // end of IIFE
		} // end of for loop
		// ~~ Online - All - Offline sorter ~~ //
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
	} // end of getUsers function
	getUsers();
	// ~~ Push a new name to the usernames array ~~ //
	$("#plus").click(function() {
		$(".online, .offline").remove();
		var add = $("#searchBar").val();
		//var duplicate = usernames.indexOf($("#searchBar").val());
		$("#searchBar").val("");
		if (add === "") {
			$(".error").html("<p>Add a username</p>");
			getUsers();
		} else if ($(".error") && add) {
			usernames.push(usernames, add);
			$(".error").empty();
			getUsers();
		} else {
			usernames.push(usernames, add);
			getUsers();
		}
	}); // end of #plus.click
	// ~~ Uses the #plus.click to include pressing enter ~~//
	$("input").keyup(function(enter) {
		if (enter.keyCode == 13) {
			$("#plus").click();
		}
	}); // end of input.keyup
}); // end of ready
