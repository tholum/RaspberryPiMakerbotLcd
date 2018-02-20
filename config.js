let clock  = "P1-11";
let data = "P1-13";
let latch = "P1-15";

module.exports = {
    "apikey" : "994084602B3541E7A658BED294299B60",
    "octoprintUrl" : "http://localhost",
    "lcd" : {
        "mode" : "ShiftLCD",
        "shiftRegisterPins" : {
            "data" : "P1-13",
            "clock" : "P1-11",
            "latch" : "P1-15"
        },
        "pins" : [ 1 , 3 , 4 , 5 ,6 , 7],
    }
    ,
    "ledPin" : "P1-7"
}