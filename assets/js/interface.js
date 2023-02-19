let hide = new Object();

hide.pages = function()
{
	contacts.hide();
	chats.hide();
	infoPage.hide();
	messagesPage.hide();
	accountPage.hide();
}

hide.pages();
chats.show();

async function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonChats':
			chats.show();
			break;

		case 'menuButtonContacts':
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

		default:
			break;
	}
}

