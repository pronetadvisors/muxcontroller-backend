import { getPolicyClass } from '../controllers/policyClass';

module.exports = (app) => {
	app.get('/api/class-types/all', getPolicyClass);
};

// 1. Basis Info
// 2. Detail Info
// 3. Insured Info