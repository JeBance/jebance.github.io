let darkModeState = false;
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

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

menu.animation = function()
{
	if ((menu.className == 'menu') || (menu.className == 'hideMenu menu')) {
		menu.className = 'showMenu menu';
		hide.className = 'background';
	} else {
		menu.className = 'hideMenu menu';
		hide.className = 'hide';
	}
}

window.onresize = function()
{
	if (document.documentElement.clientWidth > 799) {
		menu.className = 'menu';
		hide.className = 'hide';
	}
}
/*
hide.pages = function()
{
	infoPage.className = 'hide';
	accountPage.className = 'hide';
}
*/
function isEmailValid(value) {
	return EMAIL_REGEXP.test(value);
}

function wrap(elem)
{
	menu.animation();
	window.onresize();
//	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonSettings':
			if (localStorage.getItem('pubKey')) {
			} else {
				containerInfo.innerHTML = 'Все данные передаются через сервера в зашифрованном виде. Подключите свой ранее созданный PGP контейнер с расширением .nz, или создайте новый.';
				containerBrowse.className = 'show';
				containerCreate.className = 'show';
				containerNameInput.className = 'hide';
				containerEmailInput.className = 'hide';
				containerPasswordInput.className = 'hide';
				containerPasswordAccept.className = 'hide';
				containerSave.className = 'hide';
				containerOff.className = 'hide';
			}
			accountPage.show();
			break;

		default:
			break;
	}
}

