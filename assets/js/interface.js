let hide = new Object();

hide.pages = function()
{
	infoPage.hide();
	accountPage.hide();
}

async function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonMessages':
			messagesPage.show();
			break;

		case 'menuButtonSettings':
			if (secureStorage.activeAllSecureData() == true) {
				await container.generate();
			} else {
				container.choice();
			}
			accountPage.show();
			break;

		default:
			break;
	}
}

