import { Profile } from "@cutils";
import { useContext } from "react";


export const HeaderProfile = () => {
	const [profile] = useContext(Profile);

	return (
		<>
			{
				!profile ?
					<div id="head-sign">
						<a href="/sign-in">Sign in</a>
						<a href="/sign-up">Sign up</a>
					</div> :
					<a id="head-profile" href="/api/logout">
						<img src={profile?.photo} className="rounded-full" />
						{profile?.name}
					</a>
			}
		</>
	);
}