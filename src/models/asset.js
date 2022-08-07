module.exports = (sequelize, DataTypes) => {
	const Asset = sequelize.define(
		'Asset',
		{
			asset_id: DataTypes.STRING,
		},
		{}
	);

	Asset.associate = function(models) {
		// associations go here
		Asset.belongsTo(models.Organization, {foreignKey: 'organization_id'});
	};

	return Asset;
};