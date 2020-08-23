defmodule Entity.Product do
  def getProduct(id) do
    product = Mongo.find_one(:mongo, "products", %{_id: BSON.ObjectId.decode!(id)})
    case product["_id"] do
      nil -> product
      _ ->  product |> Map.put("_id", BSON.ObjectId.encode!(product["_id"]))
    end
  end

  def createProduct(data) do
    response = Mongo.insert_one!(:mongo, "products", data)
    %{_id: BSON.ObjectId.encode!(response.inserted_id)}
  end
end
