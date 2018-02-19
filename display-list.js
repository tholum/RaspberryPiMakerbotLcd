
module.exports = function( params ){
    let display = params.display;
    let list = params.list;
    
    let buttons = params.buttons;
    let renderLine = params.renderLine;

    let selectedItem = 0;
    let displayTop = 0;
    this.active = false;
    let select = (item) => {
        if( typeof params.select === "function" ){
            params.select( item );
        }
        if( params.hasOwnProperty("keepActive")  ){
            this.active = params.keepActive;
        } else {
            this.active = false;
        }
    }
    this.display = function(){
        this.active = true;
        let subItems = list.slice( displayTop , displayTop + 4 );
        let i = 0;
        for( item of subItems ){
            let icon = list.indexOf( item ) === selectedItem ? "* " : "  ";
            display.write( i , 0 , 20 , `${icon}${renderLine(item)}`);
            i++;
        }
    }
    this.updateList = function(newList){
        list = newList;
        selectedItem = 0;
        displayTop = 0;
    }
    this.eval = function(cmd){
        console.log( `display list ${cmd}`);
        switch( cmd ){
            case "center":
                select( list[selectedItem] );
            break;
            case "up":
                if( selectedItem !== 0 ){
                    selectedItem--;
                    if( displayTop  > selectedItem ){
                        displayTop = selectedItem;
                    }
                }
                this.display();
            break;
            case "down":
                if( (selectedItem +1 ) < list.length ){
                    selectedItem++;
                    if( displayTop + 3 < selectedItem ){
                        displayTop++;
                    }
                }
                this.display();
            break;
        }
        
    }
}