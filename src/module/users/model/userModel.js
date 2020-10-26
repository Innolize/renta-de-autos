const { Sequelize, DataTypes, Model, NOW } = require('sequelize')


module.exports = class UserModel extends Model {

    static setup(sequelizeInstance) {
        UserModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                nombre: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                apellido: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                tipoDocumento: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: "tipo_documento"
                },
                numeroDocumento: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    field: "numero_documento"
                },
                nacionalidad: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                direccion: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                telefono: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                nacimiento: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                disponible: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
                creado: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW
                },
                actualizado: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW
                }
            },
            {
                sequelize: sequelizeInstance,
                modelName: "User",
                createdAt: "creado",
                updatedAt: "actualizado"
            }
        )
        return UserModel
    }


}