import { useEffect, useState, useContext } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Header } from "@component/header";
import { Profile } from "@cutils";

import questions_generic from "@asset/question/generic.json";
import questions_area from "@asset/question/area.json";
import questions_data from "@asset/question/data.json";

export { getServerSideProps } from "@sutils";


const Question = ({ text, dependsOn, show, name, answers, selected, onChange }) => {
	return (
		show &&
		<div className={`mb-8 ${dependsOn !== undefined ? "ml-12" : ""}`}>
			<p className="text-lg bold mb-2">{text}</p>
			<div className="flex-col ml-8 max-w-96">
				{
					answers
						.map((ans, index) => (
							<p
								className={`mt-1 px-8 py-2 rounded-full w-full cursor-pointer border ${selected === index ? "bg-blue-500 text-white" : "border-slate-300"}`}
								onClick={() => onChange(index)}
								key={index}
							>
								{ans}
							</p>
						))
				}
			</div>
		</div>
	);
}

export default function () {
	const [profile] = useContext(Profile);
	const [answers, setAnswers] = useState(
		[...Object.values(questions_generic), ...questions_data, ...questions_area]
			.reduce((prev, curr) => ({ ...prev, [curr.name]: -1 }), {})
	);
	const [filled, setFilled] = useState(0);

	return (
		<div id="me">
			<Header>
				<a href="/me">My profile</a>
				<a href="/me/form">Audit form</a>
			</Header>
			<main>
				<h1>Hello {profile.name}</h1>
				<div>
					<form method="post" className="container flex flex-row h-4/5">
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
												className="w-screen border-l border-cyan-600 pl-8 pr-40"
												key={sectionIndex}
											>
												<h1>{title}</h1>
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
															}}
															key={index}
														/>
													))
												}
											</Slide>
										))
								}
								<Slide index={2} className="w-screen border-l border-cyan-600 pl-8">
									{
										(() => {
											switch (answers.target_1) {
												case 0:
													return <h1>Secure data</h1>;
												case 1:
													return <h1>Secure an area</h1>;
												default:
													return null;
											}
										})()
									}
									{
										(() => {
											switch (answers.target_1) {
												case 0:
													return questions_data;
												case 1:
													return questions_area;
												default:
													return [];
											}
										})().map((item, index) => (
											<Question
												{...item}
												show={item.dependsOn !== undefined ? (answers[item.dependsOn[0]] === item.dependsOn[1]) : true}
												selected={answers[item.name]}
												onChange={selected => {
													console.log(selected);
													setAnswers({ ...answers, [item.name]: selected });
													setFilled(arr.find(({ name }) => name !== item.name && answers[name] === -1) === undefined);
												}}
												key={index}
											/>
										))
									}
								</Slide>
							</Slider>
							<ButtonBack className="py-4 px-16 border border-gray-400 rounded-full">Back</ButtonBack>
							<ButtonNext className={`ml-2 py-4 px-16 bg-gray-700 rounded-full text-white ${!filled ? "opacity-40" : ""}`} disabled={!filled} onClick={() => setFilled(false)}>Next</ButtonNext>
						</CarouselProvider>
					</form>
				</div>
			</main>
		</div>
	)
}

function Progress({ index, max }) {
	return (
		<div className="flex flex-row w-full px-80 h-24 justify-between">
			{
				Array.from(Array(max).keys())
					.map(point => (
						<div className="rounded-full w-6 h-6 bg-white" />
					))
			}
		</div>
	);
}