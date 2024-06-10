const {faker} = require("@faker-js/faker");
const moment = require("moment");

module.exports = {
	generateRandomStartEndDate(format = 'YYYY-MM-DD') {
		/* faker */
		const dateStart = faker.date.between({from: '2014-01-01T00:00:00.000Z', to: '2016-12-30T00:00:00.000Z'})
		const dateEnd = faker.date.between({from: '2022-01-01T00:00:00.000Z', to: '2024-05-29T00:00:00.000Z'})

		return  {
			start: moment(dateStart).format(format),
			end: moment(dateEnd).format(format)
		}
	},
	generateDateRange(firstDate, lastDate, format = 'DD-MM-YYYY') {
		if (moment(firstDate, format).isSame(moment(lastDate, format), 'day'))
			return [firstDate, lastDate];

		let upperLimitDate = [firstDate, moment(firstDate, format).endOf('month').format(format)]
		let [lowerLimitStartOfMonth, lowerLimitEndDate] = [moment(lastDate, format).startOf('month').format(format), lastDate]

		let date = moment(firstDate, format).startOf('month');
		const dates = [upperLimitDate];
		while (moment(date, format).isBefore(moment(lowerLimitStartOfMonth, format).subtract(1, 'month'))) {
			date = date.add(1, 'month');
			dates.push([date.format(format), moment(date).endOf('month').format(format)]);
		}

		dates.push([lowerLimitStartOfMonth, lowerLimitEndDate])

		return dates;
	},
	getDateDiff(firstDate, lastDate, format = 'DD-MM-YYYY') {
		let stDate = moment(firstDate, format)
		let endDate = moment(lastDate, format)

		return endDate.diff(stDate, 'day') + 1
	}
}
