module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define(
		'Organization',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			mux_accessToken: DataTypes.STRING,
			mux_secret: DataTypes.STRING,
		},
		{}
	);

	Organization.associate = function(models) {
		// associations go here
	};

	return Organization;
};