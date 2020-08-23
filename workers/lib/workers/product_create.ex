defmodule Workers.ProductCreate do
  use Broadway

  alias Broadway.Message

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {BroadwayKafka.Producer, [
          hosts: [localhost: 9092],
          group_id: "product",
          topics: ["create-product"],
          receive_interval: 1,
        ]},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 1
        ]
      ]
    )
  end

  @impl true
  def handle_message(_, message, _) do
    data = Poison.decode!(message.data)
    product = Entity.Product.createProduct(data)
    Kafka.producer("create-product-response", Poison.encode!(product), message.metadata.key)
    message
  end
end
