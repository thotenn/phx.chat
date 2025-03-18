# ChatPhoenix Application

This README provides instructions on how to set up and run the RealTimeChat application on your local machine.

## Prerequisites

* Elixir (~> 1.14)
* Erlang (~> 25.0)
* Phoenix (~> 1.7)
* PostgreSQL
* Node.js (~> 14.0 or newer)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/thotenn/phx.chat.git
cd chat
```

2. Install dependencies:

```bash
mix deps.get
```

3. Install Node.js dependencies:

```bash
cd assets && npm install && cd ..
```

## Database Setup

1. Create and migrate the database:

```bash
mix ecto.create
mix ecto.migrate
```

## Running the Application

1. Start the Phoenix server:

```bash
mix phx.server
```

Alternatively, you can run the application in interactive mode:

```bash
iex -S mix phx.server
```

2. Visit [`localhost:4042`](http://localhost:4042) in your browser to see the application running.

## Learn More

* Official website: https://www.phoenixframework.org/
* Guides: https://hexdocs.pm/phoenix/overview.html
* Docs: https://hexdocs.pm/phoenix
* Forum: https://elixirforum.com/c/phoenix-forum
* Source: https://github.com/phoenixframework/phoenix