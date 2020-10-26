const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = class RentModel extends Model {

    /**
     * 
     * @param {import('sequelize').Sequelize} sequelizeInstance 
     */

    static setup(sequelizeInstance) {
        RentModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                rentaInicio: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    field: "renta_inicia"
                },
                rentaTermina: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    field: "renta_termina"
                },
                precioTotal: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    field: "precio_total"
                },
                formaPago: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: "forma_pago"
                },
                abonado: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                }
            },
            {
                sequelize: sequelizeInstance,
                modelName: "Rent",
                createdAt: "creado",
                updatedAt: "actualizado"
            }
        )
        return RentModel
    }

    static setupCarAssociation(CarModel) {
        RentModel.belongsTo(CarModel, { foreignKey: "auto_rentado_id" })
    }
    static setupUserAssociation(UserModel) {
        RentModel.belongsTo(UserModel, { foreignKey: "usuario_rentado_id" })
    }
}