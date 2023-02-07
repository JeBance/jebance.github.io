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
