defmodule Workers.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      {Workers.ProductCreate, []},
      {Workers.ProductGet, []},
      {Workers.Log, []},
      {Mongo, [name: :mongo, url: "mongodb://localhost:27017/IMAY"]}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
