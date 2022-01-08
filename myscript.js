let spellDiv;
let classBoxes;
let schoolBoxes;
let message = "";
let schoolSave ={};
let spellsList = [];
let levelCount = -1;
let settingLevel = 0;
let schoolsPicked = "";
let spellsOfSchools = [];
let classSpellsList = [];
let parameterCount = 0; //check how many parameters are used

window.onload = function () {
	spellDiv = document.getElementById("spells");
	closeLightBox();
	getInfo();
	fillPage();
	schoolBoxes = document.getElementsByClassName("schoolbox");
	classBoxes = document.getElementsByClassName("classbox");
	document.addEventListener("keyup", function(event) {
		//loads the spells on key press, find a better way to do this.
	  if (event.keyCode === 13) {
	   event.preventDefault();
	   fillPage();
		}
	
	});
	
}
function getInfo(parameter,type){
	
	if(type && type == "c"){
				//constructs a url for a class' spell list and gets it sorted
				toFetch = "https://www.dnd5eapi.co/api/classes/";
				toFetch += parameter;
				toFetch += "/spells/"
				fetch(toFetch)
				.then(response => response.json())
				.then(data => sortSpells(data,parameter,type))
				;
			}
	else{
		levelCount = -1;
		 while (levelCount < 9) {
			levelCount++;
			let toFetch = "https://www.dnd5eapi.co/api/spells?level=";
			toFetch += levelCount;
			if(type && type == "s"){
				//makes a fetch request 
				toFetch += "&school=" + parameter;
			}
					
			fetch(toFetch)
			.then(response => response.json())
			.then(data => checkLevel(data,parameter,type))
			;
		}
	}
}

function spellsByParameters(){
	parameterCount = 0;
	spellsOfSchools = [];
	classSpellsList = [];
	schoolsPicked = "";
	for(classx in classBoxes){
		//each class gets a fetch for its spell list and counts as one parameter
		if(classBoxes[classx].checked == true){
			getInfo(classBoxes[classx].value,"c");
			parameterCount++;
		}
	}
	for(schoolx in schoolBoxes){
		if(schoolBoxes[schoolx].checked == true){
			console.log(schoolBoxes[schoolx].value);
			schoolsPicked += schoolBoxes[schoolx].value;
			schoolsPicked += ",";
		}
	}
	if(schoolsPicked){
		//if the user is filtering by school, do a search for that.
		//
		//parameterCount = parameterCount + 10;
		schoolsPicked = schoolsPicked.slice(0, -1);
		getInfo(schoolsPicked,"s");
	}else{ getInfo();}
}

function levelSpells(data){
	console.log(data);
	
	let levelCounter = 0;
	for (levelListed in data){
		let spellsAdded = "";
		if(data[levelListed].length > 0){
			spellsAdded += "<h2>" + levelListed + "</h2>"; 
			console.log(levelListed);
			for (spell in data[levelListed]) {
				let output = "";
				let spellID = data[levelListed][spell]
				output += "<a href='javascript:getSpell(\"" + spellID.url + "\")'>";
				output += spellID.name + "</a> <br>";
				spellsAdded += output;
			}
		}
		spellsList[levelCounter] = (spellsAdded);
		levelCounter++;
	}
	fillPage();
}

function fillPage(){
	spellDiv.innerHTML = "";
	for (levelList in spellsList){
		spellDiv.innerHTML += spellsList[levelList];
	}
}

function getSpell(spellUrl){
	console.log('https://www.dnd5eapi.co' + spellUrl);
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
 
function checkLevel(data,parameter,type){
	//gets the url of the first spell
	let spellData = data;
	if(data.results.length > 0){
		let urlEnd = data.results[0].url;
		//Looks up the first spell of a set to find its level
		parameterCount++;
		fetch('https://www.dnd5eapi.co' + urlEnd)
		.then(response => response.json())
		.then(data => sortSpells(spellData,parameter,type,data.level))
		;
	}
}

function sortSpells(spellData,parameter,type,levelData){
	//if the API allowed 'class' as a parameter in requests for spells, we wouldn't be here.
	if(!type || type =="s"){
		spellsOfSchools[levelData] = spellData.results;
		parameterCount--;
	}else if(type&&type=="c"){
		for(spell in spellData.results){
			classSpellsList.push(spellData.results[spell]);
		}
		parameterCount--;
	}
	if (parameterCount == 0){
		let spellsToProcess = [];
		if(classSpellsList.length > 0){	
			for(levelListed in spellsOfSchools){
				spellsToProcess[levelListed] = [];
				//spellsToProcess[levelListed] = spellsOfSchools.filter(x => classSpellsList.includes(x));
				//spellsToProcess[levelListed] = spellsOfSchools[levelListed].filter(classIntersect);
				for(spell in spellsOfSchools[levelListed]){
					if(classSpellsList.find(el => el.index === spellsOfSchools[levelListed][spell].index)){
						spellsToProcess[levelListed].push(spellsOfSchools[levelListed][spell]);
					}
				}
			}
		}else{
			spellsToProcess = spellsOfSchools;
			}
			
		levelSpells(spellsToProcess);
	}
	
}

function classIntersect(el){
	if (classSpellsList.find(el => el.index === spellsOfSchools[levelListed][spell].index)){
		return true;
	}else { return false;}
}