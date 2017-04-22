var fs = require("fs");

module.exports = BasicCard;


function BasicCard(front, back) {
	this.front = front;
	this.back = back;

	this.create = function() {
	
		//this is for me: find out what "type" does and specifically what basic does?
		var data = {
			front: this.front,
			back: this.back,
			type: "basic",
		};


		// find out what the JSON.Stringify(data) does vs not having it> i usually opt this
		fs.appendFile("log.txt", JSON.stringify(data) + ";", "utf8", function(error) {
			if (error) {
				console.log("Error : " + error);
			}
		});
	};
}