const config = require("./config");

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
console.reset = function () {
    return process.stdout.write('\033c');
}

module.exports = function( params ){
    let text = [
        "                    ",
        "                    ",
        "                    ",
        "                    ",
    ]
    this.clear = function(){
        text = [
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ]
        this.write();
    };
    this.write = function( col , row , len , str ){
        str = String(str).substr( 0 , len );
        while( str.length < len ){
            str += " ";
        }
        text[col] = String(text[col]).replaceAt( row  , str );
        console.reset();
        console.log("########################");
        for( str of text ){
            console.log( `#${str}#` );
        }
        console.log("######################");
    }
  
   
}