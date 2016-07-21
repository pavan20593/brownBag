/**
 * Groups.js
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isDisabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
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
        Groups.belongsTo(Timeslots, {
            foreignKey: {
                name: 'timeslotId',
                allowNull: true
            }
        });
        Groups.belongsTo(Timezones, {
            foreignKey: {
                name: 'timezoneId',
                allowNull: true
            }
        });
        Groups.belongsTo(Company, {
            foreignKey: {
                name: 'companyId',
                allowNull: true
            }
        });
    }
};