module.exports = function(params){
    let five = params.five;
    let display = params.display;
    this.priority = 1000;
    this.displayName = "IP Info";
    this.select = function(){
        display.write(0 , 0 , 10 , "IP Menu");
        display.write(1 , 0 , 10 , "TODO : GET IP");
    }
    this.unselect = function(){}
}