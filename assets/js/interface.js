let hide = new Object();

hide.pages = function()
{
	contacts.hide();
	chats.hide();
	infoPage.hide();
	messagesPage.hide();
	accountPage.hide();
}

hide.tempDataInLocalStorage = function()
{
	localStorage.recipientFingerprint = '';
	localStorage.recipientPublicKey = '';
}

hide.pages();
menuButtonContacts.hide();
menuButtonChats.hide();

async function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	blockCenter.hide();
	hide.tempDataInLocalStorage();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonChats':
			chat.chatBlockUpdate();
			chats.show();
			break;

		case 'menuButtonContacts':
			contact.contactBlockUpdate();
			contacts.show();
			break;

		case 'menuButtonSettings':
			if (secureStorage.activeAllSecureData() == true) {
				await container.generate();
			} else {
				container.choice();
			}
			accountPage.show();
			break;

		case 'backCenterTopButton':
			blockLeft.show('left');
			blockCenter.hide();

		default:
			break;
	}
}

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

async function backWrap(elem)
{
	switch(elem.id) {
		case 'backCenterTopButton':
			hide.tempDataInLocalStorage();
			blockCenter.hide();
			blockLeft.show('left');

		default:
			break;
	}
}

window.onresize = function()
{
	if (document.documentElement.clientWidth > 799) {
		menu.show('menu');
		shade.hide();
		backCenterTopButton.hide();
		blockLeft.show('left');
	} else {
		backCenterTopButton.show('fa fa-chevron-left fa-2x square');
		if ((localStorage.recipientFingerprint.length > 0)
		&& (localStorage.recipientPublicKey.length > 0)) {
			blockLeft.hide();
			blockCenter.show('center');
		}

	}
}
