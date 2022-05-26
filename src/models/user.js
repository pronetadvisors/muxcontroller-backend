export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            role: DataTypes.STRING
        },
        {}
    );

    User.associate = function(models) {
        // associations go here
        User.belongsTo(models.Organization, {foreignKey: 'organization_id'})
    };

    return User;
};