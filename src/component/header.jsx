import { useContext, createElement } from "react";
import { HeaderProfile } from "./profile";
import { Theme } from "@cutils";
import { BsSun, BsSunFill, BsMoon, BsMoonFill } from "react-icons/bs";

function ThemeSelect() {
	const [theme, setTheme] = useContext(Theme);

	return (
		<div id="theme">
			{
				createElement(
					theme === "light" ? BsSunFill : BsSun,
					{ size: 22, className:"sun", onClick: () => setTheme("light") }
				)
			}
			{
				createElement(
					theme === "dark" ? BsMoonFill : BsMoon,
					{ size: 22, className:"moon", onClick: () => setTheme("dark") }
				)
			}
		</div>
	)
}

export const Header = ({ children, profile = true }) => {
	return (
		<header>
			<a id="name" href="/"><img src="/logo.svg" />NFC Auditor</a>
			<div id="tab">{children}</div>
			<div>
			<ThemeSelect />
			{
				profile !== false &&
				<HeaderProfile />
			}
			</div>
		</header>
	);
}