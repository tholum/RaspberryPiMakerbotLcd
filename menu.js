let fs = require("fs");
module.exports = function( params ){
    let five = params.five;
    let display = params.display;
    let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
    let menus = [];
    
    let drawMenu = () => {
        
    }
    let readMenus = () => {
        fs.readdir(path, function(err, items) {
            console.log(items);
        });
    }
    readMenus();

	rightArrow.on("down" , () => { console.log("rightArrow P1-35")});

	let downArrow = new five.Button( { pin : "P1-36" , isPullup : true } );
	downArrow.on("down" , () => { console.log("downArrow P1-36")});

	let leftArrow = new five.Button( { pin : "P1-37" , isPullup : true } );
	leftArrow.on("down" , () => { console.log("leftArrow P1-37")});

	let upArrow = new five.Button( { pin : "P1-38" , isPullup : true } );
	upArrow.on("down" , () => { console.log("upArrow P1-38")});

	let centerButton = new five.Button( { pin : "P1-40" , isPullup : true } );
    centerButton.on("down" , () => { console.log("centerButton P1-40")});
    
}