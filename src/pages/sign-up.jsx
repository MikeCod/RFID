import { useEffect, useState } from 'react';
import bodyParser from "body-parser";
import { promisify } from "util";
import { Inter } from 'next/font/google'
import { SHA3 } from "sha3";
import Cookies from 'cookies';

import { Header, Input } from "@component";
import * as Server from '@sutils';
import * as Check from "@utils";

const inter = Inter({ subsets: ['latin'] });

const getBody = promisify(bodyParser.urlencoded());


export async function getServerSideProps({ req, res }) {
	try {
		if (req.method !== "POST")
			return { props: {} };

		await getBody(req, res);
		console.log(req.body);
		let { name, email, phone, password } = req?.body || {};
		name = name?.trim();
		email = email?.trim();
		phone = phone?.trim();
		if (typeof email !== "string" || !email || typeof phone !== "string" || !phone || typeof name !== "string" || !name || typeof password !== "string" || !password)
			throw new Error("One or several fields are missing");

		if (!Check.name(name))
			throw new Error("Invalid name (between 1 and 32 characters)");
		if (!Check.email(email))
			throw new Error("Invalid email");
		if (!Check.phone(phone))
			throw new Error("Invalid phone");
		if (!Check.password(password))
			throw new Error("Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and at least 12 characters long");

		if (!await Server.Available.name(name))
			throw new Error("This name is already taken");
		if (!await Server.Available.email(email))
			throw new Error("This email isn't available. Have you forget your password ?");
		if (!await Server.Available.phone(phone))
			throw new Error("This phone isn't available. Have you forget your password ?");

		const password_hash = new SHA3(256);
		password = password_hash.update(password).digest("hex");
		console.log(password);

		(await Server.db).collection("user").insertOne({ name, email, phone, password });

		const cookies = new Cookies(req, res);
		cookies.set("sess", Server.generateToken(email, password));

		return {
			redirect: {
				permanent: false,
				destination: "/me",
			}
		};
	}
	catch (error) {
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
					<Input name="name" placeholder="Enterprise name" pattern="^(\w+){1,32}$" />
					<Input type="email" name="email" placeholder="Professionnal email" pattern="^([\w\._-]+){1,255}@([\w\._-]+){1,63}\.(\w+){1,63}$" />
					<Input type="tel" name="phone" placeholder="Professionnal phone" pattern="^\+?([0-9]+){6,15}$" />
					<Input
						type="password"
						name="password"
						placeholder="Confirm password"
						pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,128}$"
						title="At least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and at least 12 characters long"
					/>
					<Input
						type="password"
						placeholder="Password"
						onChange={password => document.getElementsByName("password")[0].value === password}
					/>
					<p className="error">{error}</p>
					<div className="submit">
						<input type="submit" value="Sign up" />
						<a href="/sign-in">Sign in</a>
					</div>
				</form>
			</main>
		</>
	)
}
