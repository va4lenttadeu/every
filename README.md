# Task App

This repository contains the task management application built as part of an interview process. The app is structured as a mono repo and utilizes Apollo GraphQL for the backend, Turbo for speeding up development, and Zod for data validations. It also includes a logger for monitoring application activities and both unit and end-to-end (e2e) tests for ensuring the reliability of the application.

## Features

- **Task Management**: Allows users to create, update, and archive tasks.
- **Authentication**: Users can register, login, and manage their tasks securely.
- **GraphQL API**: Utilizes Apollo GraphQL for efficient data fetching and manipulation.
- **Data Validations**: Implements Zod for robust data validations, ensuring data integrity.
- **Mono Repo Structure**: Organizes the application as a mono repo for better code management.
- **Logging**: Includes a logger for monitoring application activities and debugging.
- **Testing**: Incorporates unit tests for individual components and e2e tests for end-to-end scenarios.

## Technologies Used

- **Apollo GraphQL**: For building a flexible and efficient API.
- **Turbo**: Speeds up development by providing pre-configured tools and libraries.
- **Zod**: For robust data validations to maintain data integrity.
- **Logger**: Helps in monitoring application activities and debugging.
- **Unit Tests**: Ensures the correctness of individual components.
- **End-to-End Tests**: Validates the entire application flow for reliability.

## Getting Started

To get started with the task app, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the root directory of the repository.
3. Install dependencies by running `npm install`
3. Install the app containers by running `docker-compose up db`.
4. Run the migrations by running `npm run db:migrate:deploy`.
4. Execute locally using `npm run dev`.
6. Access the application API via the provided URL: http://localhost:3001/graphql.
