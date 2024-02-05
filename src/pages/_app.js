import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Profile, Theme } from '@cutils'
import '@/styles/globals.css'

export { getServerSideProps } from "@cutils";


export default function App({ Component, pageProps }) {
	const [profile, setProfile] = useState(pageProps?.profile);
	const [theme, setTheme] = useState(null);
	const [cookies, setCookie] = useCookies(["theme"]);

	useEffect(() => {
		setTheme(cookies.theme || "light");
		console.log(pageProps);
	}, []);

	useEffect(() => {
		setCookie("theme", theme);
	}, [theme]);

	return (
		<div className={theme}>
			<Profile.Provider value={[profile, setProfile]}>
				<Theme.Provider value={[theme, setTheme]}>
					<Component {...pageProps} />
				</Theme.Provider>
			</Profile.Provider>
		</div>
	);
}
