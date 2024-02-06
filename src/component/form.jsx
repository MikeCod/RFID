import React, { useContext } from 'react';
import { Slide } from 'pure-react-carousel';
import FadeIn from 'react-fade-in/lib/FadeIn';
import { Answers, Filled } from '@cutils';
import * as Form from "@asset/question";


export const Question = ({ text, dependsOn, show, name, answers, selected, onChange }) => {

	return (
		show &&
		<FadeIn>
			<div className={`mb-8 ${dependsOn !== undefined ? "ml-12" : ""}`}>
				<p className="text-lg bold mb-2 font-bold">{text}</p>
				<div className="flex-col ml-8 max-w-96">
					{
						answers
							.map((ans, index) => (
								<p
									className={`mt-1 px-8 py-2 rounded-full w-full font-semibold cursor-pointer border ${selected === index ? "bg-green-600/90 text-white border-green-200" : "border-green-600/30"}`}
									onClick={() => onChange(index)}
									key={index}
								>
									{ans}
								</p>
							))
					}
				</div>
				<input type="hidden" name={name} value={selected} />
			</div>
		</FadeIn>
	);
}

export function Section({ title, questions, slideIndex }) {
	const [answers, setAnswers] = useContext(Answers);
	const setFilled = useContext(Filled);

	console.log(questions);

	return (
		questions?.length > 0 &&
		<Slide
			index={slideIndex}
			className="w-screen overflow-scroll min-h-screen border-l border-green-600 pl-8 pr-40"
			key={slideIndex}
		>
			{
				title !== null &&
				<h1 className="capitalize">{title}</h1>
			}
			{
				questions?.map((item, index, arr) => {
					const visible = item.dependsOn !== undefined ? (item.dependsOn.slice(1).findIndex(i => i === answers[item.dependsOn[0]]) !== -1) : true;
					return (
						<Question
							{...item}
							show={visible}
							selected={answers[item.name]}
							onChange={selected => {
								console.log(selected);
								setAnswers({ ...answers, [item.name]: selected });
								setFilled(arr.find(({ name }) => name !== item.name && (answers[name] === -1 )) === undefined);
							}}
							key={index}
						/>
					);
				})
			}
		</Slide>
	);
}

export const questionsFormatted = (() => {
	let arr = [];
	for (const a of Form.questions) {
		if (Array.isArray(a))
			arr.push(<Section questions={a} slideIndex={arr.length} />);
		else for (const title in a) {
			console.log();
			arr.push(<Section title={title} questions={a[title]} slideIndex={arr.length} />);
		}
	}
	console.log(arr);
	return arr;
})()

export function Progress({ position, positionMax, max }) {
	const style = i => {
		if (i === position)
			return { backgroundColor: "var(--text-standard)" };
		else if (i < positionMax)
			return { backgroundColor: "var(--text)" };
		return { backgroundColor: "var(--placeholder)", opacity: 0.4 };
	}
	return (
		<div className="flex flex-row w-2/5 py-10 h-24 justify-between">
			{
				Array.from(Array(max).keys())
					.map((_, i) => (
						<div className="rounded-full w-6 h-6" style={style(i)} />
					))
			}
		</div>
	);
}