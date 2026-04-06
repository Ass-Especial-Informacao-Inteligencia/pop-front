export function checkEmptyFields(values, considerWhitespaceEmpty = false) {
	for (const value of values) {
		if (
			value === null ||
			value === undefined ||
			(typeof value === 'string' &&
				!value.trim() &&
				!considerWhitespaceEmpty)
		) {
			return true; // Returns true if it finds an empty field
		}
	}
	return false; // Returns false if no field is empty
}

function validateCpfOrEmail(inputValue) {
	// Expressão regular para validar um CPF
	const cpfRegex = /^\d{11}$/;

	// Expressão regular para validar um e-mail
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (cpfRegex.test(inputValue)) {
		return 'CPF';
	} else if (emailRegex.test(inputValue)) {
		return 'Email';
	} else {
		return 'Invalid';
	}
}