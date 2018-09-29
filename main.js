const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const request = require('request');
const open = require('openurl').open;
const parse = require('node-html-parser').parse;


const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;
let win = null;

var DATA_URL = "http://jiofi.local.html";
var updateData = function(){
    request(DATA_URL, (err, res, body) => {
        if(err) { return console.log(err);}

        var root = parse(body);
        
        var batteryPercentage = root.querySelector("#batterylevel").attributes.value;
        var noOfClient = root.querySelector('#noOfClient').attributes.value;
        var signalStrength = root.querySelector("#signalstrength").attributes.value;
        var batteryStatus = root.querySelector('#batterystatus').attributes.value;
        var chargeIcon = ""
        if ( batteryStatus == "Charging" ) {
            chargeIcon = " ⚡";
        }

        var message = "🔋"+ chargeIcon+ " : "+ batteryPercentage
                        + "\n📱 : " + noOfClient
                        + "\n📶 : " + signalStrength;

        appIcon.setToolTip(message);
    });
}

app.on('ready', function(){

    win = new BrowserWindow({show: false});
    appIcon = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'JioFi Status',
            enabled: false
        },
        {
            label: 'About',
            click: function() {
                open("https://anandu.net/jiofi-status")
            }
        },
        {
            label: 'Quit',
            accelerator: 'Ctrl+W',
            selector: 'terminate:',
        }
    ]);

  
  
    appIcon.setToolTip("Loading");
    appIcon.setContextMenu(contextMenu);


    updateData();
    var requestLoop = setInterval(updateData, 10000)
});