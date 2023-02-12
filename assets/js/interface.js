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
		menu.className = ('showMenu menu');
		hide.className = ('background');
	} else {
		menu.className = ('hideMenu menu');
		hide.className = ('hide');
	}
}

window.onresize = function()
{
	if (document.documentElement.clientWidth > 799) {
		menu.className = ('menu');
		hide.className = ('hide');
	}
}

hide.pages = function()
{
	infoPage.className = 'hide';
	accountPage.className = 'hide';
}

hide.checkWindows = function()
{
	if (localStorage.getItem('lang')) {
		selectLanguage();
		if (localStorage.getItem('key')) {
			if (header.className == 'hide') {
				ping();
				auth.hide();
				header.show();
				if (!user.info) user.login()
			}
		} else {
			if (auth.className == 'hide') {
				hide.menu();
				hide.board();
				header.hide();
				auth.show();
			}
		}
	} else {
		if (language.className == 'hide') {
			if (document.getElementById("newContainer") !== null) newContainer.remove();
			hide.menu();
			hide.board();
			header.hide();
			auth.hide();
			language.show();
		}
	}
	if ((user.info) && (user.info.location)) {
		if (Coordinates1.value.length == 0) Coordinates1.value = user.info.location.latitude + ', ' + user.info.location.longitude;
	}
}

//setInterval(hide.checkWindows, 1000);

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

function isEmailValid(value) {
	return EMAIL_REGEXP.test(value);
}

function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.className = 'show';
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
			accountPage.className = 'show';
			break;

		default:
			break;
	}
}

/*
let hide = new Object();
hide.menu = function()
{
//	mFS.hide();
	menu.hide();
	glass.hide();
	search.hide();
}
hide.board = function()
{
	brdSearch.hide();
	brdMessages.hide();
	brdOrders.hide();
	brdProducts.hide();
	brdAccount.hide();
	if (document.getElementById("newContainer") !== null) newContainer.remove();
}
hide.checkWindows = function()
{
	if (localStorage.getItem('lang')) {
		selectLanguage();
		if (localStorage.getItem('key')) {
			if (header.className == 'hide') {
				ping();
				auth.hide();
				header.show();
				if (!user.info) user.login()
			}
		} else {
			if (auth.className == 'hide') {
				hide.menu();
				hide.board();
				header.hide();
				auth.show();
			}
		}
	} else {
		if (language.className == 'hide') {
			if (document.getElementById("newContainer") !== null) newContainer.remove();
			hide.menu();
			hide.board();
			header.hide();
			auth.hide();
			language.show();
		}
	}
	if ((user.info) && (user.info.location)) {
		if (Coordinates1.value.length == 0) Coordinates1.value = user.info.location.latitude + ', ' + user.info.location.longitude;
	}
}

setInterval(hide.checkWindows, 1000);

function wrap(elem)
{
	loader.show();
	switch(elem.id) {
		case 'bS':
			if (search.className == 'search') {
				hide.menu()
			} else {
				hide.menu()
				glass.show();
				search.show();
			}
			break;

		case 'bM':
			if (menu.className == 'menu') {
				hide.menu()
			} else {
				hide.menu()
				glass.show();
				menu.show();
//				mFS.show();
			}
			break;

		case 'glass':
			hide.menu();
			break;

		case 'bFS':
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				document.documentElement.requestFullscreen();
			}
			break;

		case 'mS':
			hide.menu()
			hide.board()
			brdSearch.show();
			break;

		case 'mM':
			hide.menu()
			hide.board()
			brdMessages.show();
			break;

		case 'mO':
			hide.menu()
			hide.board()
			brdOrders.show();
			break;

		case 'mP':
			hide.menu();
			hide.board();
			brdProducts.show();
			product.getMyProducts();
			break;

		case 'mA':
			hide.menu()
			hide.board()
			brdAccount.show();
			break;

		case 'srch':
			search.hide()
			break;

		case 'addNewProduct':
			hide.menu()
			brdProducts.hide();
			let newContainer = document.createElement('div');
			newContainer.id = 'newContainer';
			newContainer.name = 'newContainer';
			newContainer.className = 'container';
			let newH1 = document.createElement('h1');
			newH1.innerHTML = 'Add new product';
			let closeButton = document.createElement('button');
			closeButton.id = 'mP';
			closeButton.innerHTML = '❌';
			closeButton.className = 'square-button';
			closeButton.setAttribute('onclick', 'wrap(this)');
			let newForm = document.createElement('div');
			newForm.id = 'newForm';
			newForm.className = 'card';
			let newLabelName = document.createElement('label');
			newLabelName.setAttribute('for', 'productName');
			newLabelName.innerHTML = 'Name:';
			let newInputName = document.createElement('input');
			newInputName.id = 'productName';
			newInputName.type = 'text';
			newInputName.value = '';
			newInputName.setAttribute('placeholder', 'Name');
			newInputName.className = 'selectable';
			let newLabelDescription = document.createElement('label');
			newLabelDescription.setAttribute('for', 'productDescription');
			newLabelDescription.innerHTML = 'Description:';
			let newInputDescription = document.createElement('textarea');
			newInputDescription.id = 'productDescription';
			newInputDescription.setAttribute('placeholder', 'Description');
			newInputDescription.className = 'selectable';
			let newLabelPrice = document.createElement('label');
			newLabelPrice.setAttribute('for', 'productPrice');
			newLabelPrice.innerHTML = 'Price:';
			let newInputPrice = document.createElement('input');
			newInputPrice.id = 'productPrice';
			newInputPrice.type = 'text';
			newInputPrice.value = '';
			newInputPrice.setAttribute('placeholder', 'Price');
			newInputPrice.className = 'selectable';
			let newLabelCurrency = document.createElement('label');
			newLabelCurrency.setAttribute('for', 'productCurrency');
			newLabelCurrency.innerHTML = 'Currency:';
			let newSelectCurrency = document.createElement('select');
			newSelectCurrency.id = 'productCurrency';
			let curKeys = Object.keys(ticker.info);
			for (var i = 0, l = curKeys.length; i < l; i++) {
				newOption = new Option(curKeys[i], curKeys[i]);
				newSelectCurrency.append(newOption);
				if (user.info.currency == curKeys[i]) { newOption.selected = true; }
			}
			let addButton = document.createElement('button');
			addButton.id = 'addButton';
			addButton.innerHTML = 'Add';
			addButton.setAttribute('onclick', 'product.create(this)');
			newForm.append(newLabelName);
			newForm.append(newInputName);
			newForm.append(newLabelDescription);
			newForm.append(newInputDescription);
			newForm.append(newLabelPrice);
			newForm.append(newInputPrice);
			newForm.append(newLabelCurrency);
			newForm.append(newSelectCurrency);
			newForm.append(addButton);
			newContainer.append(newH1);
			newContainer.append(closeButton);
			newContainer.append(newForm);
			wraper.append(newContainer);

		default:
			break;
	}
	loader.hide();
}
*/
