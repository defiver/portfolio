import { useState, useEffect } from 'react'
import { Button, Form } from 'antd'

export default function SubmitButton(props) {
	const [submitForm, setSubmitForm] = useState(false);
	const values = Form.useWatch([], props.form);

	useEffect(() => {
		props.form.validateFields({ validateOnly: true })
			.then(
				() => setSubmitForm(true),
				() => setSubmitForm(false),
			);
	}, [values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Button
			// style={{ color: "green" }}
			icon={props.icon}
			htmlType="submit"
			disabled={!submitForm}
			loading={props.loading}
		/>
	);
}