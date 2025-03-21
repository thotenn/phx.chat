defmodule Chat.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :content, :text, null: false
      add :username, :string, null: false
      add :room_id, references(:rooms, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:messages, [:room_id])
  end
end
