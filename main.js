//import MiniMap from 'leaflet-minimap';
var id;
function saveLocation(latitude, longitude) {
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    requestCoordinateTranslation(latitude, longitude)
}
function restoreLocation() {
    var lat = document.getElementById("latitude");
    var lon = document.getElementById("longitude");

    lat.innerHTML = "Latitude: " + localStorage.getItem("latitude");
    lon.innerHTML = "Longitude: " + localStorage.getItem("longitude");
    requestCoordinateTranslation(latitude, longitude)

}
function monitorLocation() {
    id = navigator.geolocation.watchPosition(showPosition);
}
function stopMonitoring() {
    navigator.geolocation.clearWatch(id);
}

function showPosition(position) {
    console.log(position);
    var lat = document.getElementById("latitude");
    var lon = document.getElementById("longitude");
    lat.innerHTML = "Latitude: " + position.coords.latitude;
    lon.innerHTML = "Longitude: " + position.coords.longitude;
    saveLocation(position.coords.latitude, position.coords.longitude);
    showLocationOnMap(position.coords.latitude, position.coords.longitude, position.coords.accuracy)
}
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}
function closeDialog(){
    const dialog = document.getElementById("dialog");
    const title = document.getElementById("title");
    const buttons = document.getElementById("buttons");
    dialog.open=false;
    title.style.display="block"
    buttons.style.display="block"
}
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuos=true
function exitVoiceMode(){
    document.getElementById("voice-control").checked=false; 
    recognition.stop()
    let instructions = new SpeechSynthesisUtterance("Goodbye.");
    speechSynthesis.speak(instructions)
}
recognition.onresult = function(event) {
    console.log(event.results);
        var command = event.results[0][0].transcript;
        console.log(command);
        if (command == 'find me') {
        getLocation(); // function that returns user's current location
    } else if(command == 'restore'){restoreLocation()}
    else if(command == 'monitor'){monitorLocation()}
    else if(command == 'stop'){stopMonitoring()}
    else if(command == 'exit'){exitVoiceMode()}
}
recognition.onspeechend = function() {
    console.log("The speaker just stopped.")
}
function speakInstructions() {
    var instructions = new SpeechSynthesisUtterance("Hello, you can give the following commands: Find me, restore, monitor, stop, exit.");
    speechSynthesis.speak(instructions);
}
function toggleVoice() {
    var checkBox = document.getElementById("voice-control");
    if (checkBox.checked == true){
        speakInstructions()
        recognition.start();  
    } else {
    exitVoiceMode()
    }
}
function requestCoordinateTranslation(latitude, longitude) {
    var url = "https://nominatim.openstreetmap.org/reverse.php?" + "lat=" + latitude + "&lon=" + longitude + "&zoom=18&format=json";
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            console.log(data);
            document.getElementById("place").innerHTML = data.display_name;
            let instructions = new SpeechSynthesisUtterance("Your location is: " +data.display_name);
            speechSynthesis.speak(instructions);
            document.getElementById("placeLabel").style.display="block"
        } 
    };
    request.send();
}

// Leaflet part below
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
/*new MiniMap(layer, options).addTo(map);

var miniMap = new L.Control.MiniMap(osm).addTo(map);*/

var osmOverview = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var map = L.map('map', {
center: [0, 0],
zoom: 5,
layers: [osm]
});
/*
var mapOverview = L.map('mapOverview', {
center: [0, 0],
zoom: 1,
attributionControl: false,
zoomControl: false ,
layers: [osmOverview]
});*/
function showLocationOnMap(latitude, longitude, accuracy) {
map.setView([latitude, longitude], 15);
// mapOverview.setView([latitude, longitude], 10);
var marker = L.marker([latitude, longitude]).addTo(map);  
//var markerOverview = L.marker([latitude, longitude]).addTo(mapOverview); 
var circle = L.circle([latitude, longitude], {
color: 'blue',
fillColor: 'blue',
fillOpacity: 0.1,
radius: accuracy
}).addTo(map);
/*
var circleOverview = L.circle([latitude, longitude], {
color: 'blue',
fillColor: 'blue',
fillOpacity: 0.1,
radius: accuracy
}).addTo(mapOverview);*/
}



