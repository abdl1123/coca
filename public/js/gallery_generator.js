// JavaScript Document
function getXMLHttp() {
	var xmlHttp
	try {
		xmlHttp = new XMLHttpRequest ();
	} catch (e) {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				return false;
			}
		}
	}
	return xmlHttp;
}

//Make AJAX request to the server
var xmlHttp = getXMLHttp();
//stores newly generated gallery HTML code
var htmlCode = "";
//temporarily stores server response while code is generated
var response = [];

$(document).ready(function() {
	// Set up the path to the PHP function that reads the image directory to find the thumbnail file names
	var send = "./public/backend/image.xml";
	// Open the connection to the web server
	xmlHttp.open("GET", send, true);
	// Tell the server that the client has no outgoing message, i.e. we are sending nothing to the server
	xmlHttp.send(null);
	// Check we get a valid server response
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4) {
			// Response handler code
			if(xmlHttp.responseText != ""){
				var images = xmlHttp.responseText.split(", ");
				for(let i=0;i<images.length;i++){
					let text = "./public/imgs/" + images[i] + ".png";
					response.push(text);
				}
				// response = ["./public/imgs/model1.png", "./public/imgs/model2.png", "./public/imgs/model3.png", "./public/imgs/model4.png", "./public/imgs/model5.png", "./public/imgs/model6.png"];
			}
			// Loop round the response array
			for (var i=0;i<response.length;i++) {
				// Handler to build the HTML string
				// Use this to provide a link to the image
				htmlCode += '<a href="#" onclick="set_image(\''+ response[i] +'\')"> ';
				htmlCode += '<img class="card-img-top img-thumbnail" src="' + response[i] + '"/>';
				htmlCode += '</a>';	
			}
			// Return the HTML string to each of the 4 3D App pages
			document.getElementById('gallery').innerHTML = htmlCode;
			
		}
	}
});

var model = "model4";
var viewPoint="default";
var texture="mark_first";
var rotation = 0;
var light = 0;

function set_image(image){
	switch(image){
		case "./public/imgs/model1.png":
			texture = "mark_diet";
			break;
		case "./public/imgs/model2.png":
			texture = "mark_coke";
			break;
		case "./public/imgs/model3.png":
			texture = "mark_classic";
			break;
		case "./public/imgs/model4.png":
			texture = "mark_fanta";
			break;
		case "./public/imgs/model5.png":
			texture = "mark_sprite";
			break;
		default:
			texture = "mark_first";
	}
	display();
}
function camera(position){
	viewPoint = position;
	display();
}

function rotate(val){
	rotation = val;
	display();
}

function lighting(val){
	light = val;
	display();
}

function display() {
	var iframe='<iframe id="modelView" frameborder="0" src="./x3dom.html#'+
	'texture='+ texture +'&'+
	'model='+ model +'&'+
	'camera='+ viewPoint +'&'+
	'rotation='+ rotation +'&'+
	'light=' + light +
	'" height="650px" width="450px"></iframe>';
	document.querySelector("#currentModel").innerHTML = "";
	document.querySelector("#currentModel").innerHTML = iframe;
}