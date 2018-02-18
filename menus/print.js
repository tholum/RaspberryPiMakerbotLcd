const http = require("http");
const config = require("../config");
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

module.exports = function(params){
    let five = params.five;
    let display = params.display;
    this.displayName = "Print";
    this.priority = 2;
    this.select = function(){ 
        display.write( 0 , 0 , 20 , "Print Menu");
    }
    this.unselect = function(){}
    this.eval = function( cmd ){
        display.write(3 , 0 , 20 , cmd );
    }

}