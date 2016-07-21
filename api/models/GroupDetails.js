/**
 * GroupDetails.js
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
        pictureUrl: {
            type: Sequelize.STRING(512),
            validate: {
                isUrl: true
            }
        },
        description: {
            type: Sequelize.STRING(512)
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
        GroupDetails.belongsTo(Groups, {
            foreignKey: {
                name: 'groupId',
                allowNull: true
            }
        });
    }
};