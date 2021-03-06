module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    points: {type: DataTypes.INTEGER, defaultValue: 0},
    status_id: {type: DataTypes.INTEGER, defaultValue: 1},
    deletedAt: {type: DataTypes.DATEONLY, defaultValue: null},
    role_id: {type: DataTypes.INTEGER, defaultValue: 1},
    resetPasswordToken: {type: DataTypes.STRING},
    resetPasswordExpires: {type:DataTypes.DATE},
  }, {
    tableName: 'users'
  });

  User.associate = function (models) {
    User.belongsTo(models.status, {
      foreignKey: 'status_id',
      as: 'user_status'
    });
    User.hasMany(models.message, {
      foreignKey: 'shader_id',
      as: 'offense'
    });
    User.hasMany(models.message, {
      foreignKey: 'flag_one',
      as: 'offended_user'
    });
    User.hasMany(models.message, {
      foreignKey: 'flag_two',
      as: 'another_offended_user'
    });
    User.hasMany(models.message, {
      foreignKey: 'flag_three',
      as: 'yet_another_offended_user'
    });
    User.hasMany(models.message, {
      foreignKey: 'victim_id',
      as: 'defense'
    });
    User.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role'
    });
    User.hasMany(models.rumor, {
      foreignKey: 'user_id',
      as: 'target'
    });
  };
  return User;
};