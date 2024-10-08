import { InputNumber } from "antd"

export default function MyInputNumber(props) {
	return <InputNumber parser={v => v.replace(',', '.').replace(/[^\d.-]/g, '')} {...props} />
}