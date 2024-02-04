import jwt from "jsonwebtoken";


const get_current_datetime = () => (new Date()).getTime();
const get_expiry = () => get_current_datetime() + parseInt(process.env.TOKEN_DURATION);


export function validate(token) {
	if (!token)
		throw new Error("Token required");

	const { email, password, expiry } = jwt.verify(token, process.env.TOKEN_SECRET);

	if (typeof expiry !== "number")
		throw new Error("Expiry is not a number");

	if (get_current_datetime() > expiry)
		throw new Error("Expired token");

	if (typeof email !== "string" || typeof password !== "string")
		throw new Error("Invalid token");
	return { email, password };
}


export const generateToken = (email, password) => jwt.sign(
	{ email, password, expiry: get_expiry() },
	process.env.TOKEN_SECRET,
	{ algorithm: "HS512" }
);
