const useDark = window.matchMedia("(prefers-color-scheme: dark)");

let darkModeState = false;

function toggleDarkMode(state)
{
	document.documentElement.classList.toggle("dark-mode", state);
	darkModeState = state;
	lamp.checked = !state;
}

function setDarkModeLocalStorage(state)
{
	localStorage.setItem("dark-mode", state);
}

if ((localStorage.getItem("dark-mode") == "true")
|| ((useDark.matches) && (localStorage.getItem("dark-mode") !== "false")))
toggleDarkMode(true);

lamp.onclick = function()
{
	darkModeState = !darkModeState;
	toggleDarkMode(darkModeState);
	setDarkModeLocalStorage(darkModeState);
}
