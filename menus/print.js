const http = require("http");
var request = require('request');
const config = require("../config");
const DisplayList = require("../display-list");
let printFile = ( path , object ,cb = () => {} ) => {

    request.post(
        `${config.octoprintUrl}/${path}?apikey=${config.apikey}`,
        { json: object },
        function (error, response, body) {
            console.log( response );
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
    let files = [];
    this.displayName = "Print";
    this.priority = 2;
    this.enabled = false;
    this.disableBack = true;
    let lists = [];

    const displayList = new DisplayList({
        buttons,
        display,
        list : [],
        renderLine : (item) => {
            return ( item.type === "folder" ? '>' : "" ) + item.display;
        },
        select : ( item ) => {
            
            if( item.type === "folder" ){
                lists.push( item.children );
                displayList.updateList( item.children );
                displayList.display();
                return;
            }
            printFile(`/api/files/local/${item.path}` , {
                "command": "select",
                "print": true
            });
            menu.return();
        }

    })
    this.select = function(){ 
        getJSON(`${config.octoprintUrl}/api/files?apikey=${config.apikey}&recursive=true`, ( data ) => {
            files = data.files.sort( ( a, b ) => { return b.date - a.date;} );
            lists.push( files );
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
        if( cmd === "left" ){
            if( lists.length <= 1 ){
                menu.unselectMenu();
            } else {
                lists.pop();
                displayList.updateList( lists[ lists.length -1 ] );
                displayList.display();
            }

        }
    }

}