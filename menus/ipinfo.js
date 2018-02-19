var os = require('os');

module.exports = function(params){
    let five = params.five;
    let display = params.display;
    this.priority = 1000;
    this.displayName = "IP Info";
    this.select = function(){
        display.write(0 , 0 , 10 , "IP Menu ");
        var ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach(function (ifname) {
            let i = 1;
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if( i <= 3 ) {
                    display.write( i , 0 , 20 , `${ifname}: ${iface.address}`);
                }
                i++;
            });
        });
    }
    this.unselect = function(){}
}