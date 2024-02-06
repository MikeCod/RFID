import Cookies from "cookies";

export default async function (req, res) {
	const cookies = new Cookies(req, res);
	cookies.set("sess");
	res.redirect(307, '/');
}