import { useContext, useEffect } from 'react';
import { ObjectId } from "mongodb";
import Cookies from 'cookies';

import { Profile } from '@cutils';
import { Header, Input } from '@component';
import * as Check from "@utils/check";
import * as Server from "@sutils";

export async function getServerSideProps(ctx) {
	const result = await Server.getSession(ctx);
	if (result.props === undefined || ctx.req.method === "GET")
		return result;

	try {
		const { props } = result;
		const { profile } = props;
		const { req, res } = ctx;

		await Server.getBody(req, res);
		console.log(req.body);
		let { _method, name, email, phone, password, newPassword } = req?.body || {};

		switch (_method?.toUpperCase()) {
			case "PUT":
				var filter = { _id: new ObjectId(profile._id) }
				let update = {};
				if (password !== undefined && newPassword !== undefined) {
					if (!Check.password(password) || !Check.password(newPassword))
						throw new Error("Invalid password");

					const password_hash = new SHA3(256);
					filter.password = password_hash.update(password).digest("hex");
					password_hash.reset();
					password = password_hash.update(newPassword).digest("hex");
					update = { password };
				}
				else {
					name = name?.trim();
					email = email?.trim();
					phone = phone?.trim();

					if (typeof email !== "string" || !email || typeof phone !== "string" || !phone || typeof name !== "string" || !name)
						throw new Error("One or several fields are missing");

					if (!Check.name(name))
						throw new Error("Invalid name (between 1 and 32 characters)");
					if (!Check.email(email))
						throw new Error("Invalid email");
					if (!Check.phone(phone))
						throw new Error("Invalid phone");

					if (!await Server.Available.name(name, profile._id))
						throw new Error("Name already taken");
					if (!await Server.Available.email(email, profile._id))
						throw new Error("Email already taken");
					if (!await Server.Available.phone(phone, profile._id))
						throw new Error("Phone already taken");

					update = { name, email, phone };
				}
				console.log(filter, update);
				if (!await (await Server.db).collection("user").updateOne(filter, { $set: update }))
					throw new Error("Could not update");
				props.profile = { name, email, phone };

				const cookies = new Cookies(req, res);
				cookies.set("sess", Server.generateToken(email, password));
				break;
			case "DELETE":
				if (!Check.password(password))
					throw new Error("Invalid password");
				const password_hash = new SHA3(256);
				password = password_hash.update(password).digest("hex");
				password_hash.reset();
				var filter = { _id: new ObjectId(profile._id), password };
				if (!await (await Server.db).collection("user").deleteOne(filter))
					throw new FatalError("Could not update");
				break;
			default:
				break;
		}
		return { props };
	}
	catch (error) {
		console.log(error);
		return result;
	}
}

export default function ({ profile }) {
	return (
		<div id="me">
			<Header>
				<a href="/me">My profile</a>
				<a href="/me/form">Audit form</a>
			</Header>
			<main className="w-screen h-screen justify-start px-40 flex-col">
				<h1>Hello {profile.name}</h1>
				<div className="w-screen h-3/5 flex flex-row justify-center items-center">
					<form method="post" className="h-4/5 w-1/4 justify-between">
						<h2>Update my profile</h2>
						<Input name="name" placeholder="Enterprise name" defaultValue={profile.name} pattern="^(\w+){1,32}$" />
						<Input type="email" name="email" placeholder="Professionnal email" defaultValue={profile.email} pattern="^([\w\._-]+){1,255}@([\w\._-]+){1,63}\.(\w+){1,63}$" />
						<Input type="tel" name="phone" placeholder="Professionnal phone" defaultValue={profile.phone} pattern="^\+?([0-9]+){6,15}$" />
						<input type="hidden" name="_method" value="put" />
						<input type="submit" value="Update profile" />
					</form>
					<form method="post" className="h-4/5 w-1/4 border-l rounded-none justify-between">
						<h2>Update my password</h2>
						<Input
							type="password"
							name="password"
							placeholder="New password"
							pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,128}$"
							title="At least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and at least 12 characters long"
						/>
						<Input
							type="password"
							placeholder="Confirm new password"
							onChange={password => document.getElementsByName("password")[0] === password}
						/>
						<input type="hidden" name="_method" value="put" />
						<input type="submit" value="Update password" />
					</form>
				</div>
			</main>
		</div>
	);
}
