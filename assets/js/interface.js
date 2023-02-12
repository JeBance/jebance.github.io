let hide = new Object();

hide.pages = function()
{
	infoPage.className = 'hide';
	accountPage.className = 'hide';
}

function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
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

