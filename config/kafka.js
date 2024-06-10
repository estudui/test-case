const { Kafka } = require("kafkajs")

exports.kafka = new Kafka({
	clientId: "kafka-app",
	brokers: ["localhost:9092"]
})
