The primary methods for providing Repository and Service instances to Application Services are through **Dependency Injection (DI)** and **Service Factories**. Application Services act as the direct clients of the Domain Model, coordinating use case tasks and requiring access to these components to perform operations against domain objects.

Here are the ways these dependencies are provided, drawing on concepts often associated with maintaining proper architectural layering, such as the Dependency Inversion Principle (DIP):

### 1. Dependency Injection (DI)

Dependency Injection is a common way to acquire implementations of Repositories and Domain Services in the Application Layer.

*   **Mechanism:** An inversion-of-control (IoC) container, such as Spring, manages and injects the required service or repository instance into the Application Service.
*   **Usage:** It is quite suitable to inject references to Repositories and Domain Services into Application Services. For instance, an Application Service might use an `@Autowired` annotation to acquire a reference to a repository needed for its tasks.
*   **Constructors and Parameters:** While field injection is common, setting up inbound dependencies explicitly by way of a **constructor** or by passing them in as method parameters is also a way to wire dependencies and make code more testable.
*   **Goal:** The Application Service depends on the **interface** defined in the Domain Layer, but the concrete implementation (often housed in the Infrastructure Layer) is injected, thus supporting DIP.

### 2. Service Factory (DomainRegistry)

A Service Factory provides an alternative mechanism for Application Services to look up and acquire the required instances.

*   **Mechanism:** A dedicated component, often named `DomainRegistry` in the provided context, is used to look up references to components implementing interfaces defined by the domain model, including Repositories and Domain Services.
*   **Usage Example:** An Application Service might look up a repository instance using the registry, such as accessing the `tenantRepository` via `DomainRegistry.tenantRepository()`. Similarly, it can look up a Domain Service, such as the `authenticationService`.
*   **Benefits:** Using a Service Factory decouples the client (the Application Service) from the implementation details. The registry itself may use an IoC container (like Spring) to manage and retrieve the underlying beans.

### Context and Principles

These mechanisms are used to maintain a clean architecture, particularly when adhering to the Dependency Inversion Principle (DIP):

*   **Dependency Inversion Principle (DIP):** Using Dependency Injection or a Service Factory allows the Application Layer to depend only on **abstractions (interfaces)** defined by the Domain Layer. This arrangement prevents the higher-level components (Application Services) from coupling directly to the lower-level technical components (like persistence mechanisms in the Infrastructure Layer), as the Infrastructure Layer implementations depend *upward* on the domain abstractions.
*   **Function:** Once an Application Service acquires a Repository instance, it uses it to obtain an Aggregate instance and execute a command operation on it. If a calculation or complex domain process is required, the Application Service would typically use a Domain Service instance.
*   **Alternative General Term:** The process of acquiring implementations may also be referred to generally as **Plug In**.
