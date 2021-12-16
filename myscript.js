let spellDiv;
let message = "";
let schoolSave ={};
let levelCount = -1;
let settingLevel = 0;
let spellsList = [];

window.onload = function () {
	spellDiv = document.getElementById("spells");
	closeLightBox();
	getInfo();
	fillPage();
	document.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
	   event.preventDefault();
	   fillPage();
		}
	});
}
function getInfo(){
	 
		 while (levelCount < 9) {
			levelCount++;
			fetch('https://www.dnd5eapi.co/api/spells?level=' + levelCount)
			.then(response => response.json())
			.then(data => levelSpells(data))
			.then(console.log(levelCount))
			;
			
		}
}

function levelSpells(data){
	console.log(data);
	level = checkLevel(data.results);
	let spellsAdded = "";
	spellsAdded += "<h2>" + level + "</h2>"; 
	for (spell in data.results) {
		let output = "";
		output += "<a href='javascript:getSpell(\"" + data.results[spell].url + "\")'>";
		output += data.results[spell].name + "</a> <br>";
		spellsAdded += output;
	}
	spellsList[level] = (spellsAdded);
}

function fillPage(){
	spellDiv.innerHTML = "";
	for (levelList in spellsList){
		spellDiv.innerHTML += spellsList[levelList];
	}
}

function getSpell(spellUrl){
	
	fetch('https://www.dnd5eapi.co' + spellUrl)
	.then(response => response.json())
	.then(data => showSpell(data));
}

function showSpell(data){
	console.log(data);
	message = "";
	message += "<h2>" + data.name + "</h2>";
	message += "<i>School: <span id='magicschool' onclick='getSchool(\""+data.school.index+"\")'>" + data.school.name + "</span></i>"
	message += "<div class='basicData'>"
	message += "Level " + data.level + " | ";
	//casting time
	message += "Casting Time: " + data.casting_time;
	if (data.ritual) { message += " (Ritual)"; }
	message += " | ";
	//range
	message += "Range: " + data.range;
	message += " | ";
	if (data.area_of_effect){
		message += "Area of Effect: "
		if (data.area_of_effect.size){
			message += data.area_of_effect.size;
		}
		if (data.area_of_effect.type){
			message += " foot " + data.area_of_effect.type;
		} 
		message += " | ";
	}
	//duration
	message += "Duration: " + data.duration;
	if (data.concentration) { message += " (Concentration)"; }
	message += " | ";
	message += "Components:&nbsp;"
	for (component in data.components){
		message += data.components[component] + "&nbsp;";
	}
	if (data.material){ message += "(" + data.material + ")"; }
	
	message += "</div> <br>";
	//end basic data, start spell description
	message += "<div class='description'>";
	for (line in data.desc) {
		message += data.desc[line];
		if (line < data.desc.length) { message += "<br><br>"; }
	}
	
	if(data.higher_level){
		message += "<h3>At Higher Levels</h3>";
		for (line in data.higher_level) {
		message += data.higher_level[line];
		if (line < data.higher_level.length) { message += "<br><br>"; }
	}
	}
	message += "<h3>Classes</h3>";
	for (allowedClass in data.classes){
		message += data.classes[allowedClass].name + "<br>";
	}
	
	if (data.subclasses && data.subclasses != [] && data.subclasses[0]){
		message += "<h3>Subclasses</h3>";
		for (allowedClass in data.classes){
			if (data.subclasses[allowedClass]){
				message += data.subclasses[allowedClass].name + "<br>";
			}
		}
	}
	
	message += "</div>"
	
	showLightbox(message);
}

function getSchool(schoolIndex){
	fetch('https://www.dnd5eapi.co/api/magic-schools/' + schoolIndex)
	.then(response => response.json())
	.then(data => showSchool(data));
}

function showSchool(data){
	schoolSave[data.index] = data;
	console.log(schoolSave);
}

function showLightbox(message){
	 document.getElementById("message").innerHTML=message;
	 document.getElementById("lightbox").style.display="block";
}

 function closeLightBox(){
     document.getElementById("lightbox").style.display="none";
 } // closeLightBox 
 
function checkLevel(data){
	//improve later
	if (data[0].index == "acid-splash"){
		return 0;
	}
	if (data[0].index == "alarm"){
		return 1;
	}
	if (data[0].index == "acid-arrow"){
		return 2;
	}if (data[0].index == "animate-dead"){
		return 3;
	}if (data[0].index == "arcane-eye"){
		return 4;
	}if (data[0].index == "animate-objects"){
		return 5;
	}if (data[0].index == "blade-barrier"){
		return 6;
	}if (data[0].index == "arcane-sword"){
		return 7;
	}if (data[0].index == "animal-shapes"){
		return 8;
	}if (data[0].index == "astral-projection"){
		return 9;
	}
}