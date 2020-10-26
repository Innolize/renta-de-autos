const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = class CarModel extends Model {

    /**
     * 
     * @param {import('sequelize').Sequelize} sequelizeInstance 
     */

    static setup(sequelizeInstance) {
        CarModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                marca: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                modelo: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                año: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                kilometraje: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                color: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                aireAcondicionado: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    field: 'aire_acondicionado'
                },
                pasajeros: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                cajaCambios: {
                    type: DataTypes.STRING,
                    field: 'caja_cambios'
                },
                precio: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                imagen: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                disponible: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                }

            },
            {
                sequelize: sequelizeInstance,
                modelName: "Car",
            }
        )
        return CarModel
    }

}