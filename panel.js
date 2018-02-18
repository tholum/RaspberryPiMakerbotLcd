const http = require("http");

let ledPin  = "P1-7";

let clock  = "P1-11";
let data = "P1-13";
let latch = "P1-15";
const APIKEY = "994084602B3541E7A658BED294299B60";


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
const Raspi = require("raspi-io");
const board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	
  var register = new five.ShiftRegister({
    pins: {
      data,
      clock,
      latch
    }
  });
	const led = new five.Led(ledPin);
	const display = new Display( { five , register });
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
	let btns = {};
	for( BTN of ["P1-36" , "P1-37" , "P1-38" , "P1-40" , "P1-35"] ){
		btns[BTN] = new five.Button( { pin : BTN , isPullup : true } );
	       for( CMD of [ "up" , "down" , "hold" ] ){
	       	   btns[BTN].on( CMD , () => { console.log( `${BTN} did ${CMD}`); } );
	       }	
	}
});
