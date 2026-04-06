import { signIn } from './auth.js';

export function submit() {
	document.querySelector('#sign-in-form').addEventListener('submit', signIn);
}
