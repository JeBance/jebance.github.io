const VERSION = '0.3.1';
const API_URL = 'https://jebance.ru/api.php';
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

String.prototype.isJsonString = function()
{
	try {
		JSON.parse(this);
	} catch (e) {
		return false;
	}
	return true;
}

Object.prototype.hide = function()
{
	this.className = 'hide';
}

Object.prototype.show = function()
{
	this.className = 'show';
}

Object.prototype.incorrect = async function()
{
	this.classList.toggle('red');
	await sleep(100);
	this.classList.toggle('red');
	this.value = "";
}

Object.prototype.correct = async function()
{
	this.classList.toggle('green');
	await sleep(100);
	this.classList.toggle('green');
}

