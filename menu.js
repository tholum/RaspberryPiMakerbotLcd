let fs = require("fs");
const DisplayList = require("./display-list");
module.exports = function( params ){
    let five = params.five;
    let display = params.display;
    let buttons = params.buttons;
    let self = this;

    

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
    this.onList = [];
    this.on = function( cmd , callback ){
        this.onList.push( { cmd , callback });
    }
    this.eval = function( str ){
        if( atMenu === true ){
            displayList.eval( str );
        }
        if( currentItem  !== false && currentItem.hasOwnProperty("eval") && typeof currentItem.eval === "function" ){
            //Set new thread, so the select option does not submit to sub item
            setTimeout( () => {
                currentItem.eval( str );
            });
        }
        let callbacks = this.onList.filter( ( item) => {return item.cmd === str; });
        for( item of callbacks ){
            item.callback();
        }
    }
    readMenus();

    
    this.unselectMenu = () => {
        atMenu = true;
        currentItem.unselect();
        currentItem = false;
        drawMenu();
    }
    this.return = function(){
        this.unselectMenu();
    }
    canGoBack = () => {
        if( currentItem !== false && currentItem.hasOwnProperty("disableBack") ){
            return !currentItem.disableBack;
        }
        return true;
    }
    this.on("left" , () => {
        if( atMenu === false && canGoBack() === true ){
            this.unselectMenu();
        }
    });
    console.log(buttons);
    buttons.centerButton.on("down" , () => {
        this.eval("center");
    });
    buttons.leftArrow.on("down" , () => {
        
        this.eval("left");
    });

    buttons.downArrow.on("down" , () => {
        this.eval("down");
    });
    buttons.upArrow.on("down" , () => {
        this.eval("up");
    });
    buttons.rightArrow.on("right" , () =>{
        this.eval("right");
    });
    
}