# lib/chat/messages/message.ex
defmodule Chat.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  schema "messages" do
    field :content, :string
    field :username, :string
    belongs_to :room, Chat.Rooms.Room

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:content, :username, :room_id])
    |> validate_required([:content, :username, :room_id])
    |> foreign_key_constraint(:room_id)
  end
end
