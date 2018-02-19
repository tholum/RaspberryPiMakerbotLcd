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
	const led = new five.Led(config.ledPin);
	const display = new Display( { five });
	const menu = new Menu( { five , display , led });
	led.blink();
});
