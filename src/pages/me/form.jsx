import React, { useEffect, useState, useContext } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Header, Question, Progress } from "@component";

import * as Server from "@sutils";
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
		for (const key in form) {
			if (questions.findIndex(({ name }) => name === ans) === -1)
				delete form[key];
			else
				form[key] = parseInt(form[key]);
		}
		console.log(email, form);

		switch (_method?.toUpperCase()) {
			case "PUT":
				if (!await (await Server.db).collection("user").updateOne({ email }, { $addToSet: { form } }))
					throw new Error("Could not update");
				break;
			case "DELETE":
				break;
		}
		return {
			props: {
				...result,
				error: err.message
			}
		};
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
	const [answers, setAnswers] = useState(
		questions
			.reduce((prev, curr) => ({ ...prev, [curr.name]: -1 }), {})
	);
	const [filled, setFilled] = useState(0);
	const [position, setPosition] = useState(0);
	const [positionMax, setPositionMax] = useState(0);
	const [type, setType] = useState(null);
	const [typeTitle, setTypeTitle] = useState(null);
	const [typeQuestions, setTypeQuestions] = useState(null);

	useEffect(() => {
		setTypeTitle(type === 0 ? "Secure data" : "Secure area");
		let form = type === 0 ? questions_data : questions_area;
		setTypeQuestions(form);
	}, [type]);

	const isEnd = () => (
		position >= 2 &&
		typeQuestions !== null &&
		typeQuestions.findIndex(({ name }, _, a) => a[name] === -1) === -1
	);


	return (
		<div id="me">
			<Header>
				<a href="/me">My profile</a>
				<a href="/me/form">Audit form</a>
			</Header>
			<main className="flex flex-col min-h-screen items-center">
				<Progress position={position} positionMax={positionMax} max={3} />
				<form id="form" method="post" className="container" style={{ minHeight: "calc(100vh - 200px)" }}>
					<CarouselProvider
						naturalSlideWidth={700}
						naturalSlideHeight={1000}
						isIntrinsicHeight
						totalSlides={3}
						touchEnabled={false}
						dragEnabled={false}
					>
						<Slider className="border-0 border-white">
							{
								Object.entries(questions_generic)
									.map(([title, questions], sectionIndex) => (
										<Slide
											index={sectionIndex}
											className="w-screen overflow-scroll min-h-screen border-l border-green-600 pl-8 pr-40"
											key={sectionIndex}
										>
											<h1 className="capitalize">{title}</h1>
											{
												questions.map((item, index, arr) => (
													<Question
														{...item}
														show={item.dependsOn !== undefined ? (answers[item.dependsOn[0]] === item.dependsOn[1]) : true}
														selected={answers[item.name]}
														onChange={selected => {
															console.log(selected);
															setAnswers({ ...answers, [item.name]: selected });
															setFilled(arr.find(({ name }) => name !== item.name && answers[name] === -1) === undefined);
															if (item?.name === "target_1")
																setType(selected);
														}}
														key={index}
													/>
												))
											}
										</Slide>
									))
							}
							<Slide index={2} className="w-screen border-l border-green-600 pl-8">
								<h1 className="capitalize">{typeTitle}</h1>
								{
									typeQuestions?.map((item, index, arr) => (
										<Question
											{...item}
											show={item.dependsOn !== undefined ? (answers[item.dependsOn[0]] === item.dependsOn[1]) : true}
											selected={answers[item.name]}
											onChange={selected => {
												console.log(selected);
												setAnswers({ ...answers, [item.name]: selected });
												setFilled(arr.find(({ name }, _, a) => name !== item.name && a[name] === -1) === undefined);
											}}
											key={index}
										/>
									))
								}
							</Slide>
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
			</main>
		</div>
	);
}
