defmodule Kafka do
  def producer(topic, message, key) do
    KafkaEx.produce(
      %KafkaEx.Protocol.Produce.Request{
        topic: topic,
        partition: 0,
        required_acks: -1,
        timeout: 1000,
        messages: [
          %KafkaEx.Protocol.Produce.Message{
            value: message,
            key: key
          }
        ]
      }
    )
  end
end
