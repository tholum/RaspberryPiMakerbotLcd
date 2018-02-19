let fs = require("fs");
const DisplayList = require("./display-list");
module.exports = function( params ){
    let display = params.display;
    let buttons = params.buttons;
    let self = this;

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
                menus.push( new tmp( {  display , buttons , menu : self } ));
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
        if( currentItem  !== false && typeof currentItem.eval === "function" ){
            currentItem.eval( str );
        }
        if( atMenu === true ){
            displayList.eval( str );
        }
        let callbacks = this.onList.filter( ( item) => item.cmd === str );
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
    
    
}