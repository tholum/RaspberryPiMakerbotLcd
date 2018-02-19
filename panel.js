const http = require("http");
const config = require("./config");

const APIKEY = config.apikey;




var five = require("johnny-five");
five.LcdShift = require("./lcd-shift");
const Display = require("./display");

const Menu = require("./menu");
const Raspi = require("raspi-io");
const board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
	let downArrow = new five.Button( { pin : "P1-36" , isPullup : true } );
	let leftArrow = new five.Button( { pin : "P1-37" , isPullup : true } );
	let upArrow = new five.Button( { pin : "P1-38" , isPullup : true } );
	let centerButton = new five.Button( { pin : "P1-40" , isPullup : true } );
	
	let buttons = {
			rightArrow,
			leftArrow,
			downArrow,
			upArrow,
			centerButton
	};
	const led = new five.Led(config.ledPin);
	const display = new Display( { five , buttons });
	const menu = new Menu( { five , display , led });
	led.blink();
});
