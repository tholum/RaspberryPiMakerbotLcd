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
var ctof = ( c ) => {
	return (c * 9/5) + 32;
}
var five = require("johnny-five");
five.LcdShift = require("./lcd-shift");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var led = new five.Led(ledPin);
  led.blink();
  var register = new five.ShiftRegister({
    pins: {
      data,
      clock,
      latch
    }
  });
  var lcd = new five.LcdShift(
	{
		register,
		pins : [ 1 , 3 , 4 , 5 ,6 , 7],
		    rows: 4,
		    cols: 20
	}
  );
   lcd.clear();
   setInterval( () => {
   getJSON( `http://localhost/api/printer?apikey=${APIKEY}` , ( res ) => {
	lcd.cursor( 0 , 0 ).print(`B: ${res.temperature.bed.actual}`)
	.cursor( 0 , 10 ).print(`E: ${res.temperature.tool0.actual}`)
        .cursor( 1 , 0 ).print( `${res.state.text}`);
   } );
   } , 1000  );
});
