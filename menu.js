let fs = require("fs");
module.exports = function( params ){
    let five = params.five;
    let display = params.display;

    let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
    //rightArrow.on("down" , () => { console.log("rightArrow P1-35")});

	let downArrow = new five.Button( { pin : "P1-36" , isPullup : true } );
	//downArrow.on("down" , () => { console.log("downArrow P1-36")});

	let leftArrow = new five.Button( { pin : "P1-37" , isPullup : true } );
	//leftArrow.on("down" , () => { console.log("leftArrow P1-37")});

	let upArrow = new five.Button( { pin : "P1-38" , isPullup : true } );
	//upArrow.on("down" , () => { console.log("upArrow P1-38")});

	let centerButton = new five.Button( { pin : "P1-40" , isPullup : true } );
    //centerButton.on("down" , () => { console.log("centerButton P1-40")});

    let menus = [];
    let currentPosition = 0;
    var atMenu = true;
   
    let drawMenu = () => {
        let start = 0;
        let end = 4;
        if( currentPosition > 4 ){
            start = currentPosition - 4;
            end = currentPosition;
        }
        let displayMenus = menus.slice( start , end );
        for( let dmIndex in displayMenus ){
            let icon = menus.indexOf( displayMenus[dmIndex]) === currentPosition ? '*' : ' ';
            display.write( dmIndex , 0 , 20 , `${icon} ${displayMenus[dmIndex].displayName}` );
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

    let selectMenu = () => {
        atMenu = false;
        display.clear();
        menus[currentPosition].select();
    }
    centerButton.on("down" , () => {
        console.log( atMenu );
        if( atMenu === true ){
            selectMenu();
        }
    });
    let unselectMenu = () => {
        atMenu = true;
        menus[currentPosition].unselect();
        drawMenu();
    }
    leftArrow.on("down" , () => {
        console.log( atMenu );
        if( atMenu === false ){
            unselectMenu();
        }
    });

    downArrow.on("down" , () => {
        if( atMenu === true && currentPosition < menus.length ){
            currentPosition++;
            drawMenu();
        }
    });
    upArrow.on("down" , () => {
        if( atMenu === true && currentPosition !== 0 ){
            currentPosition--;
            drawMenu();
        }
    });
    
}