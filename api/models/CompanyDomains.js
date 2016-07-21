/**
 * CompanyDomains.js
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
        CompanyDomains.belongsTo(Company, {
            foreignKey: {
                name: 'companyId',
                allowNull: true
            }
        });
        CompanyDomains.belongsTo(Domains, {
            foreignKey: {
                name: 'domainId',
                allowNull: true
            }
        });
    }
};
