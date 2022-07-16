import db from '../models';

const Organization = db.Organization;

export async function muxInfo(id) {
	// Organization.findAll({ attributes: ['mux_accessToken', 'mux_secret'], where: { id } })
	// 	.then(organization => {
	// 		if(!organization.length) {
	// 			return { msg: 'Organization not found'};
	// 		}
	// 		return { organization };
	// 	})
	// 	.catch(err => {
	// 		return err;
	// 	});
	const organization = await Organization.findAll({attributes: ['mux_accessToken', 'mux_secret'], where: {id}});
	return organization[0].dataValues;
}
