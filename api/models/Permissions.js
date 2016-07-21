/**
 * Permissions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            required: true
        },
        isEnable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            require: true
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
        Permissions.belongsTo(Capabilities, {
            foreignKey: {
                name: 'capabilityId',
                allowNull: true
            }
        });
        Permissions.belongsTo(SubCapabilities, {
            foreignKey: {
                name: 'subCapabilityId',
                allowNull: true
            }
        });
        Permissions.belongsTo(Roles, {
            foreignKey: {
                name: 'roleId',
                allowNull: true
            }
        });
    }
};