import db from '../models';

const Organization = db.Organization;

export async function muxInfo(id) {
	const organization = await Organization.findAll({attributes: ['mux_accessToken', 'mux_secret'], where: {id}});
	return organization[0].dataValues;
}
