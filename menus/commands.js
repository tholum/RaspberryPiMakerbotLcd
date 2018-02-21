const http = require("http");
var request = require('request');
const config = require("../config");
const DisplayList = require("../display-list");
let postCommand = ( command , object ,cb = () => {} ) => {

    request.post(
        `${config.octoprintUrl}/${command}?apikey=${config.apikey}`,
        { json: object },
        function (error, response, body) {
            console.log( response );
	    cb( response );
        }
    );
}
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
    let display = params.display;
    let menu = params.menu;
    let buttons = params.buttons;

    this.displayName = "Commands";
    this.priority = 20;
    this.enabled = false;
    const displayList = new DisplayList({
        buttons,
        display,
        list : [ {
		"display" : "connect" , 
		command : ( cb ) => {		
	            postCommand(`/api/connection` , {
	                "command": "connect"
        	    } , cb );
		} 
	}],
        renderLine : (item) => {
            return item.display;
        },
        select : ( item ) => {
		item.command( () => {
			menu.return();
		});
            menu.return();
        }

    })
    this.select = function(){ 
            displayList.display();
        // Debounce for select
        setTimeout( () => {
            this.enabled = true;
        } , 250 );
    }
    this.unselect = function(){
        this.enabled = false;
        displayList.active = false;
    }
    this.eval = function( cmd ){
        if( this.enabled === true ){
            displayList.eval(cmd);
        }
    }

}
