import axios from "axios";

export const makeHttpRequest = async (
	url: string,
	method: string,
	body: any,
	headers: any,
	responseType: any
) => {
	const response = await axios({
		url,
		method,
		headers,
		data: JSON.stringify(body),
		responseType: responseType
	});
	return response;
};
