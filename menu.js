let fs = require("fs");
module.exports = function( params ){
    let five = params.five;
    let display = params.display;
    let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
    let menus = [];
    let currentPosition = 0;
    
    let drawMenu = () => {
        console.log( menus );
        let start = 0;
        let end = 4;
        if( currentPosition > 4 ){
            start = currentPosition - 4;
            end = currentPosition;
        }
        let displayMenus = menus.slice( start , end );
        for( let dmIndex in displayMenus ){
            let selected = menus.indexOf( displayMenus["dmIndex"]) === currentPosition;
            display.write( dmIndex , 0 , 10 , `${selected ? ' ' : '*'} ${displayMenus[dmIndex].displayName}` );
            console.log( `${selected ? ' ' : '*'} ${displayMenus[dmIndex].displayName}`);
        }
    }
    let readMenus = () => {
        fs.readdir("./menus", function(err, items) {
            menus = [];
            let menuItems = items.filter( ( item ) => {
                return /\.js$/.test( item );
            }).map(
                (item) => {
                    return item.slice(0 , -3 );
                } 
            );
            for( menu of menuItems ){
                let tmp = require(`./menus/${menu}`);
                menus.push( new tmp( { five , display } ))
            }
            drawMenu();
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