import React from 'react';
import FadeIn from 'react-fade-in/lib/FadeIn';


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
									className={`mt-1 px-8 py-2 rounded-full w-full font-semibold cursor-pointer border ${selected === index ? "bg-green-700 text-white border-green-200" : "border-green-600/30"}`}
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