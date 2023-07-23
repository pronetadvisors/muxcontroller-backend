module.exports = (sequelize, DataTypes) => {
	const Relay = sequelize.define(
		'Relay',
		{
			name: DataTypes.STRING,
			port: DataTypes.INTEGER,
			stream_name: DataTypes.STRING,
			destination_urls: DataTypes.STRING,
		},
		{}
	);

	Relay.associate = function(models) {
		// associations go here
		Relay.belongsTo(models.Organization, {foreignKey: 'organization_id'});
	};

	return Relay;
};