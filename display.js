
module.exports = function( params ){
    const five = params.five;
    const register = params.register;
    const lcd = new five.LcdShift(
		{
			register,
			pins : [ 1 , 3 , 4 , 5 ,6 , 7],
					rows: 4,
					cols: 20
		}
    );
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