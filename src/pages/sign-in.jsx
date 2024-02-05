import { Inter } from 'next/font/google'
import Cookies from 'cookies';
import { SHA3 } from "sha3";

import * as Server from "@sutils";
import { Header } from "@component/header";

const inter = Inter({ subsets: ['latin'] });


export async function getServerSideProps({ req, res }) {
	const cookies = new Cookies(req, res);
	try {
		if (req.method !== "POST") {
			const cookies = new Cookies(req, res);
			cookies.set("sess");
			return { props: {} };
		}

		await Server.getBody(req, res);
		console.log(req.body);
		let { email, password } = req?.body || {};
		email = email?.trim();

		const password_hash = new SHA3(256);
		password = password_hash.update(password).digest("hex");
		console.log(password);
		const profile = await Server.getProfile(email, password);
		if (!profile)
			throw new Error("Invalid email or password");

		cookies.set("sess", Server.generateToken(email, password));

		return {
			redirect: {
				permanent: false,
				destination: "/me",
			}
		};
	}
	catch (error) {
		cookies.set("sess");
		console.log(error);
		return {
			props: { error: error.message }
		}
	}
}

export default function ({ error }) {
	return (
		<>
			<Header profile={false} />
			<main
				className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
			>
				<form method="post">
					<div>
						<input type="email" name="email" placeholder="Professionnal email" pattern="^([\w\._-]+){1,255}@([\w\._-]+){1,63}\.(\w+){1,63}$" />
						<input
							name="password"
							type="password"
							placeholder="Password"
							pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,128}$"
							title="At least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and at least 12 characters long"
						/>
						<p className="error">{error}</p>
					</div>
					<div className="submit">
						<input type="submit" value="Sign in" />
						<a href="/sign-up">Sign up</a>
					</div>
				</form>
			</main>
		</>
	);
}
