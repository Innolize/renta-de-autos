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
                capacidad: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                cambios: {
                    type: DataTypes.STRING
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