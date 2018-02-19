
const config = require("./config");

module.exports = function( params ){
    const five = params.five;
    let lcd = false;
    switch( String(config.lcd.mode).toLowerCase() ){
        case "shiftlcd":
            const register = new five.ShiftRegister({
                pins: config.lcd.shiftRegisterPins
            });
            lcd = new five.LcdShift(
                {
                    register,
                    pins : config.lcd.pins,
                    rows: 4,
                    cols: 20
                }
            );
        break;
    }
    
    lcd.clear();
    this.clear = function(){
        lcd.clear();
    };
    this.write = function( col , row , len , str ){
        str = str.substr( 0 , len );
        while( str.length < len ){
            str += " ";
        }
        lcd.cursor( col , row ).print( str );
    }
  
   
}