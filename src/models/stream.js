module.exports = (sequelize, DataTypes) => {
	const Stream = sequelize.define(
		'Stream',
		{
			name: DataTypes.STRING,
			stream_id: DataTypes.STRING,
		},
		{}
	);

	Stream.associate = function(models) {
		// associations go here
		Stream.belongsTo(models.Organization, {foreignKey: 'organization_id'});
	};

	return Stream;
};