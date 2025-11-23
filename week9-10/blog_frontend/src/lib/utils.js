export const formatDate = (dateString) => {
	if (!dateString) return 'Unknown date';
	try {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	} catch {
		return dateString;
	}
};
