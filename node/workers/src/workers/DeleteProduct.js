import { Kafka as kafkajs, CompressionTypes } from 'kafkajs';
import kafkaLib from 'kafka-node';
import Product from '../Models/Product';
const client = new kafkaLib.KafkaClient('localhost:2181');
const consumer = new kafkaLib.Consumer(
  client,
  [{topic: 'delete-product', partition: 0}],
  {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    groupId: "delete-product",
    fromOffset: false
  }
);
const kafka = new kafkajs({
  clientId: 'worker-delete-product',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  },
});
const producer = kafka.producer()
const admin = kafka.admin()



async function run() {
  await producer.connect()
  await consumer.connect()
  await admin.connect()

  await admin.createTopics({
    topics: [{
      topic: 'delete-product',
    },
    {
      topic: 'delete-product-response',
    }],
  })


  consumer.on('message', async (message)=>{
    const value = JSON.parse(message.value);
    console.log(value._id)
    const response = await Product.findByIdAndDelete(value._id)
    
    await producer.send({
      topic: 'delete-product-response',
      compression: CompressionTypes.GZIP,
      messages: [
        { value: JSON.stringify(response), key: message.key},
      ],
    }) 
  });
}

run().catch(console.error)