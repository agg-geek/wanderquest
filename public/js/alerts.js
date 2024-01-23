export const hideAlert = () => {
	const el = document.querySelector('.alert');
	if (el) el.remove();
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
	// we hide alert even though the alert is being removed (see below)
	// if say login button is clicked multiple times on failed login
	// then multiple alerts will appear, so hide the previous alerts
	hideAlert();

	const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 2000);
};
