import React, { useEffect, useState } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { Header, questionsFormatted, Progress } from "@component";
import * as Form from "@asset/question";
import * as Server from "@sutils";
import { Answers, Filled } from '@cutils';
import "@utils/proto";


export async function getServerSideProps(ctx) {
	const result = await Server.getSession(ctx);
	if (result.props === undefined || ctx.req.method === "GET")
		return result;

	try {
		const { props } = result;
		const { profile } = props;
		const { req, res } = ctx;
		const { email } = profile;

		await Server.getBody(req, res);
		const form = req?.body || {};
		const { _method } = form;
		delete form._method;

		console.log(form);

		switch (_method?.toUpperCase()) {
			case "PUT":
				if (!await (await Server.db).collection("user").updateOne({ email }, { $addToSet: { form } }))
					throw new Error("Could not update");
				break;
			case "DELETE":
				break;
		}
		return result;
	}
	catch (err) {
		return {
			props: {
				...result,
				error: err.message
			}
		};
	}
}

export default function () {
	const [answers, setAnswers] = useState(Form.questions.reduce((prev, curr) => ({ ...prev, [curr.name]: -1 }), {}));
	const [filled, setFilled] = useState(0);
	const [position, setPosition] = useState(0);
	const [positionMax, setPositionMax] = useState(0);

	const isEnd = () => (
		position > questionsFormatted.length
	);


	return (
		<div id="me">
			<Header>
				<a href="/me">My profile</a>
				<a href="/me/form">Audit form</a>
			</Header>
			<main className="flex flex-col min-h-screen items-center">
				<Answers.Provider value={[answers, setAnswers]}>
					<Filled.Provider value={setFilled}>
						<Progress position={position} positionMax={positionMax} max={Form.questions.length} />
						<form id="form" method="post" className="container" style={{ minHeight: "calc(100vh - 200px)" }}>
							<CarouselProvider
								naturalSlideWidth={700}
								naturalSlideHeight={1000}
								isIntrinsicHeight
								totalSlides={questionsFormatted.length}
								touchEnabled={false}
								dragEnabled={false}
							>
								<Slider className="border-0 border-white">
									{
										questionsFormatted
									}
								</Slider>
								<input type="hidden" name="_method" value="put" />
								<div className="flex-row">
									<ButtonBack
										className={position === 0 ? "opacity-40" : ""}
										disabled={position === 0}
										onClick={() => {
											setPosition(position - 1);
											setFilled(true);
										}}
									>
										Back
									</ButtonBack>
									<ButtonNext
										className={!filled && position > 0 ? "opacity-40" : ""}
										disabled={!filled && position > 0}
										onClick={() => {
											if (isEnd())
												return document.getElementById("form").submit();
											if ((position + 1) >= positionMax) {
												setFilled(false);
												setPositionMax(position + 1);
											}
											setPosition(position + 1);
										}}
									>
										{
											isEnd() ?
												"Submit" :
												(!filled && position === 0 ? "Skip" : "Next")
										}
									</ButtonNext>
								</div>
							</CarouselProvider>
						</form>
					</Filled.Provider>
				</Answers.Provider>
			</main>
		</div>
	);
}
