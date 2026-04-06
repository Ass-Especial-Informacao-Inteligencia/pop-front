export function panelActive() {
	const ghostSignInButton = document.getElementById('ghostSignIn');
	const container = document.getElementById('container');

	ghostSignInButton.addEventListener('click', () => {
		container.classList.remove('right-panel-active');
	});
}
