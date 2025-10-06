The choice between an **Entity** and a **Value Object** is fundamental in Domain-Driven Design (DDD) tactical modeling. You should strive to model using **Value Objects wherever possible**, as Value types are generally easier to create, test, use, optimize, and maintain.

The decision hinges primarily on whether the domain concept is fundamentally defined by its unique identity and continuity over time (an **Entity**) or purely by its descriptive attributes (a **Value Object**).

Here is a comprehensive breakdown of the characteristics that distinguish Entities from Value Objects, guiding your choice:

### 1. Choose an Entity When Identity Matters

An Entity is used when you care about its **individuality** and when distinguishing it from all other objects in the system is a mandatory constraint.

| Entity Characteristics | Description and Source Support |
| :--- | :--- |
| **Unique Identity** | An Entity is distinguished primarily by its identity, not its attributes. It must have a means of distinguishing each object regardless of its form or history. Unique identity is primary to its definition in the model. |
| **Continuity and Change** | An Entity is capable of being **changed continuously** over a long period of time (it is **mutable**). Changes may be extensive, but it remains the same object due to its identity. |
| **Life Cycle Tracking** | You may be interested in **tracking** when, how, and by whom changes were made over its entire lifetime. The unique identity and mutability are what set Entities apart from Value Objects. |
| **Aggregate Root** | The root of an Aggregate (a cluster of domain objects ensuring transactional consistency) is always an Entity. |

Developers should purposefully focus only on the attributes and behaviors central to the Entity's unique identity in the early stages of design. If the concept does not require unique identity, model it as a Value Object.

### 2. Choose a Value Object When Attributes Matter

A Value Object is chosen when you care **only about the attributes** of the element of the model. Value Objects measure, quantify, or describe a thing in the domain.

| Value Object Characteristics | Description and Source Support |
| :--- | :--- |
| **Immutability** | A Value Object must be treated as **immutable** (unchangeable) after it has been created. Any method, whether public or hidden, should not cause its state to change. |
| **Value Equality** | Instances are compared using **Value equality**. Equality is determined by comparing both the types of the objects and all of their corresponding attributes. |
| **Conceptual Whole** | It models a **conceptual whole** by composing related attributes as an integral unit (e.g., currency and amount gathered as a `MonetaryValue`). |
| **Side-Effect-Free Behavior** | All methods of an immutable Value Object must be **Side-Effect-Free Functions**. They produce output without modifying the object’s own state. |
| **Replaceability** | If the state of a Value is no longer correct, the entire Value is **completely replaced** with a new Value that represents the currently correct whole. You use object replacement rather than mutating the original instance. |
| **No Unique Identity** | A Value Object should not be given identity. |

### 3. Key Guidance on Making the Choice

The decision process involves challenging your assumptions, prioritizing DDD principles over technical influences, and focusing on the **Ubiquitous Language**.

| Decision Point | Guidance and Source Support |
| :--- | :--- |
| **Prioritize Values** | It is generally recommended to **strive to model using Value Objects instead of Entities wherever possible**. When designing Aggregates, you should **favor Value Object Parts** over Entities. |
| **Handling Change** | If you are tempted to create an Entity because its attributes must change frequently, **challenge your assumption**. Instead, determine if **Whole Value replacement** would work. |
| **Avoiding Pitfalls** | The tendency to focus primarily on the database often leads to "entity-think," resulting in misappropriated use and widespread **overuse of Entities**. This approach can lead to an Anemic Domain Model. |
| **Data Model Influence**| Do not allow persistence concerns (like Object-Relational Mapping, where a Value Object might be stored as a database entity) to dictate your domain model design. If a concept describes a thing, possesses value characteristics, and does not require unique identity or continuity of change, it **should be modeled as a Value Object**, regardless of how the persistence layer stores it. |
| **Simple Data** | If an object uses basic language Value types (like simple strings or numbers) and needs no special functionality or domain-specific logic, it may not need to be modeled as a specialized Value Object, though doing so unnecessarily is better than neglecting Value Objects entirely. |
| **Integration** | When integrating Bounded Contexts, prioritize using **Value Objects** to model concepts flowing from an upstream Context into a downstream Context, as this results in assuming less responsibility for synchronization compared to creating a local Entity. |
