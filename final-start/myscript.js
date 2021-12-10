window.onload = function () {
	getInfo();
}
function getInfo(){
	fetch('https://www.dnd5eapi.co/api')
		.then(response => response.json())
		.then(data => console.log(data) 
		);
	fetch('https://www.dnd5eapi.co/api/magic-schools')
		.then(response => response.json())
		.then(data => console.log(data) 
		);
}