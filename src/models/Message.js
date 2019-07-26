module.exports = function (sequelize, DataTypes) {

  const Message = sequelize.define('message', {
    points: {type: DataTypes.INTEGER, defaultValue: 0},
    media: {type: DataTypes.STRING},
    shader_id: {type: DataTypes.INTEGER, allowNull: false},
    victim_id: {type: DataTypes.INTEGER},
    status_id: {type: DataTypes.INTEGER, defaultValue: 1},
    deletedAt: {type: DataTypes.DATEONLY, defaultValue: null},
    offensive: {type: DataTypes.INTEGER, defaultValue: 0},
    flag_one: {type: DataTypes.INTEGER, defaultValue: null},
    flag_two: {type: DataTypes.INTEGER, defaultValue: null},
    flag_three: {type: DataTypes.INTEGER, defaultValue: null}
  }, {
    tableName: 'messages'
  });

  Message.associate = function (models) {
    Message.belongsTo(models.user, {
      foreignKey: 'shader_id',
      as: 'shader'
    });
    Message.belongsTo(models.user, {
      foreignKey: 'victim_id',
      as: 'victim'
    });
    Message.belongsTo(models.status, {
      foreignKey: 'status_id',
      as: 'message_status'
    });
  }

  return Message;
}