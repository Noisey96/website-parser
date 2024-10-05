import 'dotenv/config';
import { hash } from 'bcrypt';
import { database } from '../../src/services/dbServices';
import { users } from './schema';

const db = database(false);

async function generateUser(email: string, password: string) {
	let passwordHash = await hash(password, 10);
	let user = {
		email: email,
		password: passwordHash,
	};
	await db.insert(users).values(user);
}
