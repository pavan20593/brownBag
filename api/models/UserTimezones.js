/**
 * UserTimezones.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    associations: function() {
        UserTimezones.belongsTo(Timezones, {
            foreignKey: {
                name: 'timezoneId',
                allowNull: true
            }
        });
        UserTimezones.belongsTo(Users, {
            foreignKey: {
                name: 'userId',
                allowNull: true
            }
        });
    }
};