const siteURL = 'https://jebance.github.io/';

let darkModeState = false;
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

function toggleDarkMode(state) {
	document.documentElement.classList.toggle("dark-mode", state);
	darkModeState = state;
	lamp.checked = !state;
}

function setDarkModeLocalStorage(state) {
	localStorage.setItem("dark-mode", state);
}

if ((localStorage.getItem("dark-mode") == "true")
|| ((useDark.matches) && (localStorage.getItem("dark-mode") !== "false")))
toggleDarkMode(true);

//useDark.addListener((evt) => toggleDarkMode(evt.matches));

lamp.onclick = function() {
	darkModeState = !darkModeState;
	toggleDarkMode(darkModeState);
	setDarkModeLocalStorage(darkModeState);
}

menu.animation = function() {
	if ((menu.className == 'menu') || (menu.className == 'hideMenu menu')) {
		menu.className = ('showMenu menu');
		hide.className = ('background');
	} else {
		menu.className = ('hideMenu menu');
		hide.className = ('hide');
	}
}

window.onresize = function() {
	if (document.documentElement.clientWidth > 799) {
		menu.className = ('menu');
		hide.className = ('hide');
	}
}

let myProjects = new Object();
myProjects.refresh = function()
{
	let requestURL = 'https://jebance.github.io/assets/json/projects.json';
	let request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		myProjects.info = request.response;
	}
	request.onerror = function() {
		myProjects.refresh();
	}
}
myProjects.refresh();

function wrap(elem) {
	switch(elem.id) {
		case 'myProjectsButton':
			page.innerHTML = '';
			let keys = Object.keys(myProjects.info.attachments);
			for (var i = 0, l = keys.length; i < l; i++) {
				let newItem = document.createElement('div');
				newItem.id = keys[i];
				newItem.name = 'item';
				newItem.className = 'item';
				let newImg = document.createElement('img');
				newImg.src = siteURL + myProjects.info.attachments[keys[i]]['icon'];
				newImg.style.float = 'left';
				newImg.style.margin = '0.7em 0.7em 0.7em 0';
				let newName = document.createElement('h3');
				newName.innerHTML = myProjects.info.attachments[keys[i]]['name'];
				let newTitle = document.createElement('p');
				newTitle.innerHTML = myProjects.info.attachments[keys[i]]['title'];
				let newDescription = document.createElement('p');
				newDescription.innerHTML = myProjects.info.attachments[keys[i]]['description'];
				newItem.append(newImg);
				newItem.append(newName);
				newItem.append(newTitle);
				newItem.append(newDescription);
				let newClear = document.createElement('div');
				newClear.className = 'clear';
				page.append(newItem);
				page.append(newClear);
			}

			for (var i = 0, l = keys.length; i < l; i++) {
				let newItem = document.createElement('div');
				newItem.id = keys[i];
				newItem.name = 'item';
				newItem.className = 'item';
				let newImg = document.createElement('img');
				newImg.src = siteURL + myProjects.info.attachments[keys[i]]['icon'];
				newImg.style.float = 'left';
				newImg.style.margin = '0.7em 0.7em 0.7em 0';
				let newName = document.createElement('h3');
				newName.innerHTML = myProjects.info.attachments[keys[i]]['name'];
				let newTitle = document.createElement('p');
				newTitle.innerHTML = myProjects.info.attachments[keys[i]]['title'];
				let newDescription = document.createElement('p');
				newDescription.innerHTML = myProjects.info.attachments[keys[i]]['description'];
				newItem.append(newImg);
				newItem.append(newName);
				newItem.append(newTitle);
				newItem.append(newDescription);
				let newClear = document.createElement('div');
				newClear.className = 'clear';
				page.append(newItem);
				page.append(newClear);
			}

			for (var i = 0, l = keys.length; i < l; i++) {
				let newItem = document.createElement('div');
				newItem.id = keys[i];
				newItem.name = 'item';
				newItem.className = 'item';
				let newImg = document.createElement('img');
				newImg.src = siteURL + myProjects.info.attachments[keys[i]]['icon'];
				newImg.style.float = 'left';
				newImg.style.margin = '0.7em 0.7em 0.7em 0';
				let newName = document.createElement('h3');
				newName.innerHTML = myProjects.info.attachments[keys[i]]['name'];
				let newTitle = document.createElement('p');
				newTitle.innerHTML = myProjects.info.attachments[keys[i]]['title'];
				let newDescription = document.createElement('p');
				newDescription.innerHTML = myProjects.info.attachments[keys[i]]['description'];
				newItem.append(newImg);
				newItem.append(newName);
				newItem.append(newTitle);
				newItem.append(newDescription);
				let newClear = document.createElement('div');
				newClear.className = 'clear';
				page.append(newItem);
				page.append(newClear);
			}
			break;

		default:
			break;
	}
}
