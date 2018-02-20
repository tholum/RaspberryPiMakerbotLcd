let Display = require("./display-terminal");
//let keypress = require('./lib/keypress');
//keypress(process.stdin);
process.stdin.setRawMode(true);
const Menu = require("./menu");
let display = new Display();
display.write( 0 , 0 , 20 , "12345678901234567890");
display.write( 3 , 0 , 10 , "TEST");
process.stdin.setEncoding('utf8');

const menu = new Menu( { display  });

process.stdin.on('data', (data) => {
    if( data === "e"){
        process.exit();
    }
    switch( data ){
        case "w":
            menu.eval("up");
        break;
        case "d":
            menu.eval("right");
        break;
        case "a":
            menu.eval("left");
        break;
        case "s":
            menu.eval("down");
        break;
        case "c":
            menu.eval("center");
        break;
    }
});