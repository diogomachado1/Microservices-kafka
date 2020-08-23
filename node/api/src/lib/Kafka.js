import { v4 as uuidv4 } from 'uuid'
import kafkaLib from 'kafka-node';

import { Kafka as kafkajs, CompressionTypes } from 'kafkajs';

class Kafka {
  constructor(){
    const client = new kafkaLib.KafkaClient('localhost:2181');
    this.consumer = new kafkaLib.Consumer(
      client,
      [],
      {
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false
      }
    );
    const kafka = new kafkajs({
      clientId: 'api',
      brokers: ['localhost:9092'],
      retry: {
        initialRetryTime: 300,
        retries: 10
      },
    });
    this.producer = kafka.producer()
    this.producer.connect()
  }

  async request(topic, message) {
    this.consumer.addTopics([{ topic: `${topic}-response`, partition: 0 }])
    const messageId = uuidv4();
    await this.producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [
        { value: JSON.stringify(message), key: messageId},
      ],
    })
    const {data, funct} = await new Promise (async(resolve, reject) => { 
     const funct = async function(message) {
        if(messageId === message.key){
          resolve({data:JSON.parse(message.value), funct}); 
        }
      }

      this.consumer.on('message',funct);
      setTimeout(() => {
        resolve({data: {error: "timeout"}, funct})
      }, 3000);
    })
    this.consumer.removeListener('message', funct);

    return data;
  }
}

export default new Kafka();