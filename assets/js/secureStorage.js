class SecureStorage {
	#publicKey = '';
	#privateKey = '';
	#passphrase = '';
	#fingerprint = '';

	constructor(publicKey, privateKey, passphrase) {
		this.#publicKey = publicKey;
		this.#privateKey = privateKey;
		this.#passphrase = passphrase;
		this.#fingerprint = (await openpgp.readKey({ armoredKey: publicKey })).getFingerprint();
	}

	get fingerprint() {
		return this.#fingerprint;
	}

	activeAllSecureData() {
		((this.#publicKey) && (this.#privateKey) && (this.#passphrase)) ? check = true : check = false;
		return check;
	}

	eraseAllSecureData() {
		this.#publicKey = '';
		this.#privateKey = '';
		this.#passphrase = '';
		this.#fingerprint = '';
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
