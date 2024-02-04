import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Profile, Theme } from '@cutils'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
	const [profile, setProfile] = useState(null);
	const [theme, setTheme] = useState(null);
	const [cookies, setCookie] = useCookies(["theme"]);

	useEffect(() => {
		setTheme(cookies.theme || "light")
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
