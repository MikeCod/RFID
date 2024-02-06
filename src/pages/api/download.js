import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import * as Server from "@sutils";
import "@utils/proto";


export default async function (req, res) {
	const result = await Server.getSession({ req, res, resolvedUrl: "/me" });
	if (result.props === undefined)
		return result;

	try {
		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
		let textList = Server.generateMarkdownText(result.props.profile).split("\n").filter(l => typeof l === "string" && l.length !== 0);

		for (let i = 0; i < textList.length;) {
			const page = pdfDoc.addPage();
			const { width, height } = page.getSize();
			for (let j = 0; j < height; j += 20) {
				if (typeof textList[i] === "string" && textList[i].length > 1) {
					let text = textList[i];
					const spacePos = text.indexOf(' ');
					const options = {
						x: 40,
						y: height - 40 - j,
						lineHeight: 16,
						font: helveticaFont,
						size: 12,
						maxWidth: width - 90,
						color: rgb(0.1, 0.1, 0.1)
					};
					switch (textList[i][0]) {
						case "#":
							text = text.substring(spacePos + 1);
							options.lineHeight = 24 - ((spacePos - 1) * 2);
							options.size = options.lineHeight;
							options.color = rgb(0.05, 0.4, 0.1);
							j += (4 - spacePos) * 5;
							break;
						case "-":
							text = text.substring(spacePos + 1);
							options.lineHeight = 14;
							options.color = rgb(0.05, 0.1, 0.1);
							break;
						default:
							break;
					}
					page.drawText(text, options);
					const linesCount = parseInt(text.length/(options.size));
					console.log(linesCount);
					j += 20*linesCount;
				}
				++i;
			}
		}

		// const pipeline = promisify(stream.pipeline);
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
		res.send(Buffer.from(await pdfDoc.save()));
	}
	catch (err) {
		console.log(err);
	}
}