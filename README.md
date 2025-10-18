# Pixel War: A Domain-Driven Design Demo with Next.js

This project is a practical demonstration of applying Domain-Driven Design (DDD) principles to a full-stack web application built with Next.js and TypeScript. The application itself is a "Pixel War" canvas where users can collaboratively place colored pixels on a grid.

The primary goal is not to build a feature-complete application, but to showcase a structured, maintainable, and scalable architecture that separates core business logic from framework-specific implementation details.

## Core DDD Concepts in this Project

The codebase is organized around key DDD patterns to create a clear and decoupled system.

### 1. Bounded Contexts

The application is divided into distinct Bounded Contexts, each with its own ubiquitous language and business rules.

-   **`src/pixelwar-context`**: This is the core domain of the application. It manages the grid, pixels, players, and the rules for changing pixel colors (e.g., cooldowns). It has no knowledge of authentication or how the UI is rendered.
-   **`src/auth-context`**: This context handles user registration and login. It is responsible for creating and validating users. *(Note: This was the initial implementation and has since been simplified, but serves as a good example of a separate context.)*

### 2. Shared Kernel

-   **`src/shared-kernel`**: This directory contains code that is shared across all bounded contexts. It includes generic building blocks like `AggregateRoot`, `EntityId`, `DomainEventPublisher`, and base error classes. This code is not specific to any single domain.

## Architecture: From Core to UI

The application follows a "Clean Architecture" or "Hexagonal" approach, with dependencies flowing inwards. The domain core knows nothing about the layers outside of it.

1.  **Domain Layer (The Core)**:
    -   Located inside each context's `domain/` directory (e.g., `src/pixelwar-context/domain/`).
    -   Contains Entities (`Grid`, `User`), Value Objects (`Email`, `Pixel`), and Domain Events (`CellColorChanged`).
    -   This layer is pure TypeScript with zero dependencies on external frameworks or libraries like databases or Next.js.

2.  **Application Layer**:
    -   Located inside each context's `application/` directory.
    -   Orchestrates the domain logic by defining Use Cases (e.g., `ChangePixelColorUseCase`, `LoginUserUseCase`).
    -   It acts as a bridge between the UI/API and the domain, but still doesn't know about specific technologies.

3.  **Infrastructure Layer**:
    -   Located inside each context's `infrastructure/` directory.
    -   Provides concrete implementations for the interfaces defined in the domain layer (Repositories, Services).
    -   This is where external concerns are handled:
        -   **Persistence**: `PrismaGridRepository` implements `IGridRepository` to save domain entities to a PostgreSQL database.
        -   **Broadcasting**: `HttpBroadcaster` sends real-time updates to a WebSocket server when a domain event occurs.

4.  **Presentation/Framework Layer (Next.js)**:
    -   Located in the `src/app/` directory.
    -   This is the outermost layer, containing the Next.js pages, components, and API routes.
    -   It interacts with the Application Layer through Adapters and Service Providers to keep the framework decoupled from the core logic. Server Actions (`CanvasPageServerActions.adapter.ts`) are used to invoke the use cases from the UI.

## Integration Testing with Testcontainers

To ensure our persistence logic works correctly against a real database, we use **integration tests** instead of mocking our repositories.

-   **Testcontainers (`@testcontainers/postgresql`)**: This library automatically spins up a genuine PostgreSQL database inside a Docker container for each test run.
-   **Setup (`test/setupIntegration.ts`)**: This file contains the global `beforeAll` logic to start the container, apply the Prisma schema, and create a `PrismaClient` connected to the test database. It also includes `afterAll` to tear down the container.
-   **Benefits**: This approach gives us high confidence that our repository implementations (`PrismaUserRepository`, `PrismaGridRepository`) work exactly as expected with a real database, catching issues that unit tests with mocks would miss.

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy Anywhere with Docker

This project is fully containerized using Docker, allowing it to be deployed on any platform that supports Docker.

The `docker-compose.yml` file defines the services required to run the application in a production-like environment, including the Next.js app, the WebSocket server, and the PostgreSQL database.

### Building the Images

To build the production-ready Docker images, run the following command. This will build the `app` and `ws` images and push them to your configured container registry.

```bash
bun run build:docker
```

### Running the Application

Once the images are built, you can start all the services in detached mode:

```bash
docker compose up -d
```

This will start the Next.js application, the WebSocket server, and the database.