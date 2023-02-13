const VERSION = '0.3.11';
console.log('VERSION: '+VERSION);
const API_URL = 'https://jebance.ru/api.php';
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const containerElements = document.getElementsByName("container");

containerElements.hide = function() {
	for (let i = 0, l = containerElements.length; i < l; i++) containerElements[i].hide();
}

async function HMAC(key, message)
{
	const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
	k = g(key),
	m = g(message),
	c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' },true, ['sign']),
	s = await crypto.subtle.sign('HMAC', c, m);
	return btoa(String.fromCharCode(...new Uint8Array(s)))
}

async function HMAC(key, message){
  const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
  k = g(key),
  m = g(message),
  c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' },true, ['sign']),
  s = await crypto.subtle.sign('HMAC', c, m);
  return btoa(String.fromCharCode(...new Uint8Array(s)))
}

String.prototype.isJsonString = function()
{
	try {
		JSON.parse(this);
	} catch (e) {
		return false;
	}
	return true;
}

Object.prototype.hide = function() { this.className = 'hide'; }

Object.prototype.show = function(attribute = null)
{
	if (attribute == null) {
		this.className = 'show';
	} else {
		this.setAttribute('class', attribute);
	}
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

