const http = require("http");
const config = require("../config");
const DisplayList = require("../display-list");
let printFile = ( path , object ,cb = () => {} ) => {
    var post_data = querystring.stringify(object);
  
    // An object of options to indicate where to post to
    var post_options = {
        host: 'localhost',
        port: '80',
        path : `${path}?apikey=${config.apikey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    console.log( post_options);
  
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        let data = "";
        res.on('data', function (chunk) {
            data += chunk;
            console.log('Response: ' + chunk);
        });
        res.on("end" , () => { cb( data ); console.log( data ); } );
    });
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
            printFile(`/api/files/local/${item.path}` , {
                "command": "select",
                "print": true
            });
            menu.return();
        }

    })
    this.select = function(){ 
        getJSON(`http://localhost/api/files?apikey=${config.apikey}&recursive=true`, ( data ) => {
            let files = data.files.sort( ( a, b ) => { return b.date - a.date;} );
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