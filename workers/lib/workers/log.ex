defmodule Workers.Log do
  use Broadway

  alias Broadway.Message

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {BroadwayKafka.Producer, [
          hosts: [localhost: 9092],
          group_id: "log",
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
    #data = message.data |> Poison.decode!
    IO.puts("log: #{message.data}")
    message
  end
end
