const express = require('express')
const router = express.Router()
const indexService = require('../../services/index/index-service')
const log = require('@config/winston')
const { kafka } = require('@config/kafka')
const appRoot = require('app-root-path')
const env = require('dotenv')
const moment = require("moment");
env.config({path: `${appRoot}/.env`})

router.get('/test-case', testIndex)
router.get('/create-topic', createKafkaTopic)

module.exports = router

async function testIndex(req, res, next) {
	log.info("====== PROCESS BEGIN =======")
	try {

		/* Produce to Kafka */
		const producer = kafka.producer()
		log.info("Connecting Producer...")
		await producer.connect()
		log.info("Producer Connected..")

		log.info("Send Data to Kafka")
		await producer.send({
			topic: "nominal-test",
			messages: [
				{
					partition: 0,
					key: "adding-nominal",
					value: JSON.stringify({request_time: moment()})
				}
			]
		})

		res.json({"status" : "success, Process on Progress"})
	} catch (e) {
		log.error({error: e.message})
		res.json({"status" : "error:: " + e})
	}
}

async function createKafkaTopic(req, res, next) {
	let topicName = req.query.topic

	const admin = kafka.admin()

	log.info("Kafka Admin Connecting..")
	await admin.connect()

	log.info("Creating Topic ["+topicName+"]")
	await admin.createTopics({
		topics: [
			{
				topic: topicName,
				numPartitions: 2
			}
		]
	})

	log.info("Topic created Success")
	log.info("Disconnecting Admin...")
	await admin.disconnect()
	res.json({"status" : "success, Create Topic"})
}
