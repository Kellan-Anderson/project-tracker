const LENGTH = 8;
const KEY = 'abcdefhijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateUrlId() {
	let urlId = '';
	for(let i = 0; i < LENGTH; i++) {
		const randChar = KEY[Math.floor(Math.random() * KEY.length)]!;
		urlId = `${urlId}${randChar}`
	}
	return urlId;
}