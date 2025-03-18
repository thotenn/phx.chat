defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel
  alias Chat.Rooms
  alias Chat.Messages

  @impl true
  def join("room:lobby", _payload, socket) do
    {:ok, socket}
  end

  def join("room:" <> room_id, _payload, socket) do
    room_id = String.to_integer(room_id)

    # Intentar obtener la sala por ID
    room = Rooms.get_room!(room_id)

    # Obtener los mensajes de la sala
    messages = Messages.list_messages_by_room(room_id)
    response = %{
      room: %{id: room.id, name: room.name, description: room.description},
      messages: Enum.map(messages, fn msg ->
        %{
          id: msg.id,
          content: msg.content,
          username: msg.username,
          inserted_at: msg.inserted_at
        }
      end)
    }

    {:ok, response, assign(socket, :room_id, room_id)}
  rescue
    Ecto.NoResultsError ->
      {:error, %{reason: "Room not found"}}
  end

  @impl true
  def handle_in("new_message", %{"content" => content, "username" => username}, socket) do
    room_id = socket.assigns.room_id

    case Messages.create_message(%{
      content: content,
      username: username,
      room_id: room_id
    }) do
      {:ok, message} ->
        broadcast!(socket, "new_message", %{
          id: message.id,
          content: message.content,
          username: message.username,
          inserted_at: message.inserted_at
        })
        {:reply, :ok, socket}

      {:error, _changeset} ->
        {:reply, {:error, %{reason: "Failed to save message"}}, socket}
    end
  end

  # Maneja la creación de una nueva sala
  def handle_in("create_room", %{"name" => name, "description" => description}, socket) do
    case Rooms.create_room(%{name: name, description: description}) do
      {:ok, room} ->
        broadcast!(socket, "room_created", %{
          id: room.id,
          name: room.name,
          description: room.description
        })
        {:reply, {:ok, %{room_id: room.id}}, socket}

      {:error, _changeset} ->
        {:reply, {:error, %{reason: "Failed to create room"}}, socket}
    end
  end

  # Maneja la solicitud para obtener todas las salas
  def handle_in("get_rooms", _payload, socket) do
    rooms = Rooms.list_rooms()
    response = %{
      rooms: Enum.map(rooms, fn room ->
        %{id: room.id, name: room.name, description: room.description}
      end)
    }

    {:reply, {:ok, response}, socket}
  end
end
