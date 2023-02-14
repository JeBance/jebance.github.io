class SecureStorage {
	#publicKey = '';
	#privateKey = '';
	#passphrase = '';
	fingerprint = '';

	constructor() {
	}

	async createStorage(name, email, passphrase) {
		const { privateKey, publicKey } = await openpgp.generateKey({
			type: 'rsa',
			rsaBits: 4096,
			userIDs: [{ name: name, email: email }],
			passphrase: passphrase
		});
		this.#publicKey = publicKey;
		this.#privateKey = privateKey;
		this.#passphrase = passphrase;
		this.fingerprint = (await openpgp.readKey({ armoredKey: publicKey })).getFingerprint();
	}

	openStorage(data, passphrase) {
		const armMessage = await openpgp.readMessage({
			armoredMessage: data
		});
		const { data: decrypted } = await openpgp.decrypt({
			message: armMessage,
			passwords: [ passphrase ],
		});
		if (decrypted.isJsonString()) {
			let parseData = JSON.parse(decrypted);
			this.#publicKey = parseData.publicKey;
			this.#privateKey = parseData.privateKey;
			this.#passphrase = passphrase;
			this.fingerprint = (await openpgp.readKey({ armoredKey: publicKey })).getFingerprint();
		} else {
			alert('Неверный пароль!');
		}
	}

	activeAllSecureData() {
		((this.#publicKey) && (this.#privateKey) && (this.#passphrase)) ? check = true : check = false;
		return check;
	}

	eraseAllSecureData() {
		this.#publicKey = '';
		this.#privateKey = '';
		this.#passphrase = '';
		this.fingerprint = '';
	}

	async generateSecureFile() {
		let string = JSON.stringify({
			publicKey: this.#publicKey,
			privateKey: this.#privateKey
		});
		let encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: string }),
			passwords: [ this.#passphrase ],
			config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
		});
		let fileHref = 'data:application/pgp-encrypted,' + encodeURIComponent(encrypted);
		return fileHref;
	}
}
