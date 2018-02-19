let fs = require("fs");
module.exports = function( params ){
    let five = params.five;
    let display = params.display;
    let self = this;

    let rightArrow = new five.Button( { pin : "P1-35" , isPullup : true } );
    //rightArrow.on("down" , () => { console.log("rightArrow P1-35")});

	let downArrow = new five.Button( { pin : "P1-36" , isPullup : true } );
	//downArrow.on("down" , () => { console.log("downArrow P1-36")});

	let leftArrow = new five.Button( { pin : "P1-37" , isPullup : true } );
	//leftArrow.on("down" , () => { console.log("leftArrow P1-37")});

	let upArrow = new five.Button( { pin : "P1-38" , isPullup : true } );
	//upArrow.on("down" , () => { console.log("upArrow P1-38")});

    let centerButton = new five.Button( { pin : "P1-40" , isPullup : true } );
    let buttons = {
        rightArrow,
        leftArrow,
        downArrow,
        upArrow,
        centerButton
    };

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
                menus.push( new tmp( { five , display , buttons , menu : self } ));
            }
            menus = menus.sort( ( a , b ) => {
                return b.priority - a.priority;
            });
            drawMenu();
        });
    }
    let eval = ( str ) => {
        if(  atMenu === false && menus[currentPosition].hasOwnProperty("eval") && typeof menus[currentPosition].eval === "function" ){
            //Set new thread, so the select option does not submit to sub item
            setTimeout( () => {
                menus[currentPosition].eval( str );
            });
        }
    }
    readMenus();

    let selectMenu = () => {
        atMenu = false;
        display.clear();
        menus[currentPosition].select();
    }
    centerButton.on("down" , () => {
        if( atMenu === true ){
            selectMenu();
        } 
        eval("center");
    });
    this.unselectMenu = () => {
        atMenu = true;
        menus[currentPosition].unselect();
        drawMenu();
    }
    this.return = function(){
        this.unselectMenu();
    }
    leftArrow.on("down" , () => {
        if( atMenu === false ){
            this.unselectMenu();
        }
        eval("left");
    });

    downArrow.on("down" , () => {
        if( atMenu === true && currentPosition < menus.length ){
            currentPosition++;
            drawMenu();
        }
        eval("down");
    });
    upArrow.on("down" , () => {
        if( atMenu === true && currentPosition !== 0 ){
            currentPosition--;
            drawMenu();
        }
        eval("up");
    });
    rightArrow.on("right" , () =>{
        eval("right");
    });
    
}