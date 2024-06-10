const log = require('@config/winston');
const helpers = require('../../_helpers/index');
const Header = require('../../models').Header
const Detil = require('../../models').Detil
const sequelize = require('../../models')
const { faker } = require("@faker-js/faker");
const { v4 } = require('uuid')

module.exports = {
	async insertData() {
		try {
			const uuid = v4()
			const dates = helpers.generateRandomStartEndDate('YYYY-MM-DD') /* Dummy tanggal awal-akhir */
			const dateList = helpers.generateDateRange(dates.start, dates.end, 'YYYY-MM-DD') /* Men-generate tanggal awal-akhir perbulan dari rentang tanggal yang di input */
			const nominal = faker.finance.amount({min: 10000000, max: 50000000, dec: 0}) /* Dummy nominal */
			let dayTotal = helpers.getDateDiff(dates.start, dates.end, 'YYYY-MM-DD') /* jumlah hari dalam rentang tanggal yang di input */

			/*
			* Membagi nominal dengan jumlah hari dalam rentang tanggal yang di input
			* */
			let nominalEachDay = nominal/dayTotal
			nominalEachDay = nominalEachDay.toFixed(2)

			let headerData = {
				id: uuid,
				tanggal_awal: dates.start,
				tanggal_akhir: dates.end,
				nominal: nominal
			}
			log.info("INSERT HEADER: " + JSON.stringify(headerData) + " WITH " + dateList.length + " DETIL DATA")

			let totalTmp = 0
			let detilData = []
			dateList.map((value, index, row) => {
				console.log("Map ", value)

				/*
				* Menjumlahkan nominal sesuai jumlah hari dalam setiap iterasi
				* */
				let diffVal = helpers.getDateDiff(value[0], value[1], 'YYYY-MM-DD')
				let eachNominal = nominalEachDay * diffVal

				/*
				* Mencari index terakhir, untuk menyesuaikan sisa nominal
				* */
				if (index + 1 === row.length) {
					eachNominal = nominal - totalTmp
				}

				let eachDetilData = {
					id_header: uuid,
					tanggal_awal: value[0],
					tanggal_akhir: value[1],
					nominal: eachNominal.toFixed(2)
				}

				detilData.push(eachDetilData)
				totalTmp += eachNominal
			})

			/* Insert DB */
			const result = sequelize.sequelize.transaction(async t => {
				const headerInsert = await Header.create(headerData, {transaction: t})
				await Detil.bulkCreate(detilData, {transaction: t})
				return headerInsert
			})

			console.log("result ", result)
			return 1;
		} catch (e) {
			console.log("err::", e.message)
			return 0;
		}

	}

}
