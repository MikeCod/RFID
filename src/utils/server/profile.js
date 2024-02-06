import Cookies from "cookies";
import bodyParser from "body-parser";
import { promisify } from "util";
import { validate, db } from ".";


/* Server side */
export const getProfile = async (email, password) => (
	await (await db).collection("user").findOne({ email, password }, { password:0 })
);

export async function getServerSideProps({ req, res, resolvedUrl }) {
	console.log(resolvedUrl);
	const cookies = new Cookies(req, res);

	try {
		const { email, password } = validate(cookies.get('sess'));
		const profile = await getProfile(email, password);
		if(!profile)
			throw new Error("Invalid account");
		if (resolvedUrl === "/sign-in")
			return {
				redirect: {
					permanent: false,
					destination: "/me",
				}
			};
		delete profile.password;
		profile._id = profile._id.toString();
		return { props: { profile } };
	}
	catch (error) {
		console.log(error);
		cookies.set('sess');
		if (resolvedUrl !== "/sign-in" && resolvedUrl.startsWith("/me")) {
			return {
				redirect: {
					permanent: false,
					destination: "/sign-in",
				}
			};
		}
		return { props: {  } };
	}
};

export const getSession = getServerSideProps;

export const getBody = promisify(bodyParser.urlencoded());
