import { hash } from 'bcrypt';
import { sign } from 'hono/jwt';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const ACCESS_JWT_EXPIRATION_MINUTES = 60;

export async function generateEmailToken() {
	const randomNumber = new Uint32Array(1);
	crypto.getRandomValues(randomNumber);
	let passcode = randomNumber[0].toString();
	passcode = passcode.padStart(6, '0');
	passcode = passcode.slice(-6);
	const passcodeHash = await hash(passcode, 10);

	const expiration = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);
	return {
		passcode,
		passcodeHash,
		expiration,
	};
}

export function generateAccessJWTExpiration() {
	const expiration = new Date(Math.floor((Date.now() + ACCESS_JWT_EXPIRATION_MINUTES * 60 * 1000) / 1000));
	return expiration;
}

export async function generateAccessJWT(id: string, expiration: Date) {
	const payload = {
		id: id,
		sub: 'user',
		exp: expiration.getTime() / 1000,
	};
	const token = await sign(payload, process.env.ACCESS_JWT_SECRET, 'HS256');
	return token;
}
