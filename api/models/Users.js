/**
 * Users.js
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
        fullName: {
            type: Sequelize.STRING(512),
            require: true
        },
        linkedInPublicProfileUrl: {
            type: Sequelize.STRING(512),
            require: true,
            validate: {
                isUrl: true
            }
        },
        designation: {
            type: Sequelize.STRING(512),
            require: true
        },
        profilePic: {
            type: Sequelize.STRING,
            require: true,
            validate: {
                isUrl: true
            }
        },
        mobile: {
            type: Sequelize.BIGINT(11),
            require: true,
            unique: true,
            validate: {
                isNumeric: true,
                len: [10, 11]
            }
        },
        companyName: {
            type: Sequelize.STRING(512),
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
        Users.belongsTo(Roles, {
            foreignKey: {
                name: 'roleId',
                allowNull: true
            }
        });
        Users.belongsTo(AuthenticationProviders, {
            foreignKey: {
                name: 'authenticationProviderId',
                allowNull: true
            }
        });
        Users.belongsTo(Professions, {
            foreignKey: {
                name: 'professionId',
                allowNull: true
            }
        });
        Users.belongsTo(CountryCodes, {
            foreignKey: {
                name: 'countryCodeId',
                allowNull: true
            }
        });
    }
};