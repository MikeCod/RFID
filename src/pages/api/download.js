
import stream from 'stream';
import { promisify } from 'util';

import * as Server from "@sutils";
import "@utils/proto";


export default async function (req, res) {
	const result = await Server.getSession({ req, res, resolvedUrl: "/me" });
	if (result.props === undefined)
		return result;

	try {
		const markdownReport = Server.generateMarkdownText(result.props.profile);
		console.log(markdownReport);

		const pipeline = promisify(stream.pipeline);
		res.setHeader('Content-Type', 'text/markdown');
		res.setHeader('Content-Disposition', 'attachment; filename=report.md');
		await pipeline(markdownReport, res);
	}
	catch (err) {
		console.log(err);
	}
}