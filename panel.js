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
	
  var register = new five.ShiftRegister({
    pins: config.displayRegisterPins
	});
	
	const led = new five.Led(config.ledPin);
	const display = new Display( { five , register });
	const menu = new Menu( { five , display , led });

	led.blink();
	let i = 0;
	
	

	

	/*for( BTN of ["P1-36" , "P1-37" , "P1-38" , "P1-40" , "P1-35"] ){
		btns[BTN] = new five.Button( { pin : BTN , isPullup : true } );
	       for( CMD of [ "up" , "down" , "hold" ] ){
	       	   btns[BTN].on( CMD , () => { console.log( `${BTN} did ${CMD}`); } );
	       }	
	}*/
});
