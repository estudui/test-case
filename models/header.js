'use strict';
const {
	Model
} = require('sequelize');
/** @type {import('sequelize').Model} */
module.exports = (sequelize, DataTypes) => {
	class Header extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Header.init({
		id: { type: DataTypes.STRING, primaryKey: true },
		tanggal_awal: DataTypes.STRING,
		tanggal_akhir: DataTypes.STRING,
		nominal: DataTypes.DOUBLE,
	}, {
		sequelize,
		modelName: 'Header',
		tableName: 'header',
		createdAt: false,
		updatedAt: false
	});
	return Header;
};
