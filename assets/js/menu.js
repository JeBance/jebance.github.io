menu.animation = function()
{
	if ((menu.className == 'menu') || (menu.className == 'hideMenu menu')) {
		menu.className = 'showMenu menu';
		shade.className = 'shade';
	} else {
		menu.className = 'hideMenu menu';
		shade.className = 'hide';
	}
}

window.onresize = function()
{
	if (document.documentElement.clientWidth > 799) {
		menu.className = 'menu';
		shade.className = 'hide';
	}
}
