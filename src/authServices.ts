import { hash } from 'bcrypt';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

export async function generateEmailToken() {
	const randomNumber = new Uint32Array(1);
	crypto.getRandomValues(randomNumber);
	let passcode = randomNumber[0].toString();
	passcode = passcode.padStart(6, '0');
	passcode = passcode.slice(-6);
	const passcodeHash = await hash(passcode, 10);

	const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);
	return {
		passcode,
		passcodeHash,
		expiration,
	};
}
