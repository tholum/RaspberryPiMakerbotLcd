const http = require("http");
const config = require("../config");
const DisplayList = require("../display-list");
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
    let menu = params.menu;
    let buttons = params.buttons;

    this.displayName = "Print";
    this.priority = 2;
    this.enabled = false;
    const displayList = new DisplayList({
        buttons,
        display,
        list : [],
        renderLine : (item) => {
            return item.display;
        },
        select : ( item ) => {
            console.log( item );
            menu.return();
        }

    })
    this.select = function(){ 
        getJSON(`http://localhost/api/files?apikey=${config.apikey}&recursive=true`, ( data ) => {
            let files = data.files.sort( ( a, b ) => { return a.date - b.date;} );
            displayList.updateList( files );
            displayList.display();
        });
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