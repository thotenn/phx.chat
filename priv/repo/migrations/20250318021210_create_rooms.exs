defmodule Chat.Repo.Migrations.CreateRooms do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :name, :string, null: false
      add :description, :string

      timestamps()
    end

    create unique_index(:rooms, [:name])
  end
end
