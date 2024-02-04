import { Profile } from "@cutils";
import React, { useContext, useEffect, useState } from "react";
import * as Icon from "react-icons/fa";


export const Valid = ({ value }) => {
	return (
		<>
			{
				value ?
					<Icon.FaCheck className="ok" />
					:
					(value === false && <Icon.FaTimes className="ko" />)
			}
		</>
	);
}

export const Input = _props => {
	const [profile] = useContext(Profile);
	const [good, setGood] = useState(null);
	const [props, setProps] = useState(_props);

	useEffect(() => {
		let addProps = { ...props };
		if (typeof _props.pattern === "string")
			addProps.onBlur = ({ target: { value } }) => setGood(value.length === 0 || (profile || {})[_props.name] === value ? null : new RegExp(props.pattern, "s").test(value));
		if (typeof _props.onChange === "function")
			addProps.onChange = ({ target: { value } }) => setGood(value.length === 0 || (profile || {})[_props.name] === value ? null : _props.onChange(value));
		setProps(addProps)
	}, [_props]);

	return (
		<div>
			<Valid value={good} />
			<input
				type="text"
				required
				{...props}
			/>
		</div>
	)
}