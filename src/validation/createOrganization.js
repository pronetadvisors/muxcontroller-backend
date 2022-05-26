import Validator from 'validator';
import isEmpty from './isEmpty';

function validateCreateOrganizationForm(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.mux_accessToken = !isEmpty(data.mux_accessToken) ? data.mux_accessToken : '';
	data.mux_secret = !isEmpty(data.mux_secret) ? data.mux_secret : '';

	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Organization name must be between 2 and 30 character long';
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Organization name field is required';
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'email field is required';
	}

	if (!Validator.isEmail(data.email)) {
		errors.email = 'email is invalid';
	}

	if (Validator.isEmpty(data.mux_accessToken)) {
		errors.mux_accessToken = 'Mux AccessToken field is required';
	}

	if (Validator.isEmpty(data.mux_secret)) {
		errors.mux_secret = 'Mux Secret field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
}

export default validateCreateOrganizationForm;