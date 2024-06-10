'use strict';
const {
	Model, Sequelize
} = require('sequelize');
/** @type {import('sequelize').Model} */
module.exports = (sequelize, DataTypes) => {
	class Detil extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Detil.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		id_header: DataTypes.STRING,
		tanggal_awal: DataTypes.STRING,
		tanggal_akhir: DataTypes.STRING,
		nominal: DataTypes.DOUBLE,
	}, {
		sequelize,
		modelName: 'Detil',
		tableName: 'detil',
		createdAt: false,
		updatedAt: false
	});
	return Detil;
};
