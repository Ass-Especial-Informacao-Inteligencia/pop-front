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