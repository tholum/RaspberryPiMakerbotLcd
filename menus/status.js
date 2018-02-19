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
    this.displayName = "Status";
    this.priority = 0;
    let interval = 0;
    this.select = function(){
        clearInterval(interval);
        let updateStatus = () => {
            getJSON( `http://localhost/api/printer?apikey=${config.apikey}` , ( res ) => {
                display.write( 0 , 0 , 10 , `B:${Math.round(res.temperature.bed.actual)}/${Math.round(res.temperature.bed.target)}` );
                display.write( 0 , 10 , 10 , `E:${Math.round(res.temperature.tool0.actual)}/${Math.round(res.temperature.tool0.target)}` );
                display.write( 1 , 0 , 20 , `Status: ${res.state.text}` );
            });
            getJSON( `http://localhost/api/job?apikey=${config.apikey}` , ( res ) => {
                let filename = "";
                let progress = "";
                if( res.hasOwnProperty("job") && res.job.hasOwnProperty("file")){
                    filename = res.job.file.name;
                }
                if( res.hasOwnProperty("progress") && res.progress.hasOwnProperty("completion") ){
                    progress = `${Math.round( res.progress.completion )}%`;
                }
                display.write( 2 , 0 , 10, `P: ${progress}` );
                display.write( 3 , 0 , 5, `${filename}` );
            });
        };
        updateStatus();
        interval = setInterval( updateStatus  , 1000  );
    }
    this.unselect = function(){
        clearInterval(interval);
    }
}