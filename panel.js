const http = require("http");
const config = require("./config");

let ledPin  = "P1-7";


const APIKEY = config.apikey;


let getJSON = (url , cb ) => {
	http.get(url, function(res){
	    var body = '';

	    res.on('data', function(chunk){
	        body += chunk;
	    });

	    res.on('end', function(){
	        cb( JSON.parse(body) );
	    });
	}).on('error', function(e){
	      console.log("Got an error: ", e);
	});
}

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
	setInterval( () => {
		getJSON( `http://localhost/api/printer?apikey=${APIKEY}` , ( res ) => {
			i++;
			display.write( 0 , 0 , 10 , `B: ${res.temperature.bed.actual}` );
			display.write( 0 , 10 , 10 , `E: ${res.temperature.tool0.actual}` );
			display.write( 1 , 0 , 10 , `${res.state.text}` );
			display.write( 2 , 0 , 10 , `${i}` );
		});
	} , 1000  );
	let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
	rightArrow.on("down" , () => { console.log("rightArrow P1-35")});

	let downArrow = new five.Button( { pin : "P1-36" , isPullup : true } );
	downArrow.on("down" , () => { console.log("downArrow P1-36")});

	let leftArrow = new five.Button( { pin : "P1-37" , isPullup : true } );
	leftArrow.on("down" , () => { console.log("leftArrow P1-37")});

	let upArrow = new five.Button( { pin : "P1-38" , isPullup : true } );
	upArrow.on("down" , () => { console.log("upArrow P1-38")});

	let centerButton = new five.Button( { pin : "P1-40" , isPullup : true } );
	centerButton.on("down" , () => { console.log("centerButton P1-40")});

	

	/*for( BTN of ["P1-36" , "P1-37" , "P1-38" , "P1-40" , "P1-35"] ){
		btns[BTN] = new five.Button( { pin : BTN , isPullup : true } );
	       for( CMD of [ "up" , "down" , "hold" ] ){
	       	   btns[BTN].on( CMD , () => { console.log( `${BTN} did ${CMD}`); } );
	       }	
	}*/
});
