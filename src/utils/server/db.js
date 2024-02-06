import { MongoClient, ObjectId } from "mongodb";


export const db = new Promise(async (resolve, reject) => {
	try {
		const { MONGO_SCHEME, MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;
		console.log(`${MONGO_SCHEME}://${MONGO_USER}:****@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`);
		const client = new MongoClient(`${MONGO_SCHEME}://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`);
		await client.connect();
		resolve(client.db());
	}
	catch (err) {
		reject(err);
	}
});

const exists = async query => await (await db).collection("user").findOne(query) === null;
const query = async (q, _id) => (
	_id !== null ?
		exists({
			$and: [
				q,
				{ _id: { $ne: new ObjectId(_id) } }
			]
		})
		:
		exists(q)
);

export const Available = {
	name: async (name, _id = null) => typeof name === "string" && await query({ name }, _id),
	email: async (email, _id = null) => typeof email === "string" && await query({ email }, _id),
	phone: async (phone, _id = null) => typeof phone === "string" && await query({ phone }, _id),
}
