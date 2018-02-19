let fs = require("fs");
const DisplayList = require("./display-list");
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
    let currentItem = false;
    let displayList = new DisplayList({
        display,
        list : menus,
        renderLine : ( item ) => {
            return item.displayName;
        },
        select : ( item ) => {
            atMenu = false;
            currentItem = item;
            display.clear();
            currentItem.select();
        }
    });    
    let drawMenu = () => {
        displayList.updateList( menus );
        displayList.display();
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
                return a.priority - b.priority;
            });
            drawMenu();
        });
    }
    let eval = ( str ) => {
        if( atMenu === true ){
            displayList.eval( str );
        }
        if( currentItem  !== false && currentItem.hasOwnProperty("eval") && typeof currentItem.eval === "function" ){
            //Set new thread, so the select option does not submit to sub item
            setTimeout( () => {
                currentItem.eval( str );
            });
        }
    }
    readMenus();

    centerButton.on("down" , () => {
        eval("center");
    });
    this.unselectMenu = () => {
        atMenu = true;
        currentItem.unselect();
        currentItem = false;
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
        eval("down");
    });
    upArrow.on("down" , () => {
        eval("up");
    });
    rightArrow.on("right" , () =>{
        eval("right");
    });
    
}