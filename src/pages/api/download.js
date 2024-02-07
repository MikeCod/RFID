import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import * as Server from "@sutils";
import "@utils/proto";


export default async function (req, res) {
	const result = await Server.getSession({ req, res, resolvedUrl: "/me" });
	if (result.props === undefined)
		return result;

	try {
		const { profile } = result.props;
		const { name, email, phone } = profile;
		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
		let textList = Server.generateMarkdownText(result.props.profile).split("\n").filter(l => typeof l === "string" && l.length !== 0);

		let page = pdfDoc.addPage();
		var { width, height } = page.getSize();
		page.drawText("RFID Audit Report", {
			x: 180,
			y: height/2,
			lineHeight: 32,
			font: helveticaFont,
			size: 28,
			maxWidth: 400,
			color: rgb(0.35, 0.6, 0.5)
		});


		page.drawText(`${name}\n${email}\n${phone}`, {
			x: 40,
			y: 120,
			lineHeight: 20,
			font: helveticaBoldFont,
			size: 14,
			maxWidth: 400,
			color: rgb(0.4, 0.45, 0.45)
		});

		const date = new Date();
		page.drawText(`${date.toDateString()}`, {
			x: width - 160,
			y: 80,
			lineHeight: 32,
			font: helveticaFont,
			size: 13,
			maxWidth: 400,
			color: rgb(0.45, 0.45, 0.45)
		});

		for (let i = 0; i < textList.length;) {
			page = pdfDoc.addPage();
			for (let j = 0; j < height - 110; j += 20) {
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
					console.log(text);
					switch (textList[i][0]) {
						case "#":
							text = text.substring(spacePos + 1);
							options.lineHeight = 24 - ((spacePos - 1) * 2);
							options.size = options.lineHeight;
							options.x += 20 * spacePos;
							options.color = rgb(0.4 - (spacePos * 0.08), 0.6 - (spacePos * 0.08), 0.7 - (spacePos * 0.08));
							j += (4 - spacePos) * 16 + 10;
							options.y -= (4 - spacePos) * 15;
							break;
						case "-":
							text = text.substring(spacePos + 1);
							options.lineHeight = 14;
							options.color = rgb(0.1, 0.18, 0.18);
							// page.drawText(text, options);
							break;
						case "*":
							const boldPos = text.substring(3).indexOf("**");
							const textBold = text.substring(2, boldPos + 2);
							text = text.substring(boldPos + 6);

							options.color = rgb(0.1, 0.18, 0.18);
							page.drawText(textBold, { ...options, font: helveticaBoldFont });
							options.x += textBold.length * (options.size / 2.1) + 20;
							options.maxWidth -= options.x;
							break;
						default:
							break;
					}
					page.drawText(text, options);
					const linesCount = parseInt((text.length) / (options.size * 2.3));
					console.log(linesCount);
					j += 4 * linesCount;
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