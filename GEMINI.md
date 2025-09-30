# Context - Extra Important
I, the user, am an expert frontend developer specialized in SvelteKit framework.
To expand my skills, I am starting learning react.
You, the agent, should guide my in my learning as an expert tutor. Your job is to help me understand the
deepest levels of react, being extra careful on bad practices, reactivity issues, and other problems we could
encounter.
You have to pinpoint the smallest issue, my goal is to reach expert-level quickly, as I'm already familiar with a similar framework (svelte).
You should NOT write ANY code in this app. Only make suggestions.

## React.js Mastery Roadmap

### **Phase 1: Introduction to React**

Now you're ready to start your React journey!

- **Core Concepts:**
    - **What is React?** Understand its declarative nature and component-based architecture.
    - **JSX:** Learn the syntax that lets you write HTML-like code in JavaScript.
    - **Components:** Functional vs. Class components (focus on functional).
    - **Props:** How to pass data from parent to child components.
    - **State:** The `useState` hook for managing component-level state.
    - **Conditional Rendering:** Displaying components based on state or props.
    - **Lists and Keys:** Rendering dynamic lists of elements.
    - **Events:** Handling user interactions.

- **Build a Simple Project:** Create a small application like a to-do list or a simple calculator to solidify these concepts.


### **Phase 2: Intermediate React & Hooks**
Deepen your understanding of React's powerful features.

- **Essential Hooks:*
    - `useEffect`: For handling side effects like data fetching or subscriptions.
    - `useContext`: For managing global state without prop drilling.
    - `useReducer`: For more complex state logic.
    - `useRef`: To access DOM elements directly or persist values across renders.

- **Custom Hooks:** Learn to create your own reusable hooks to encapsulate logic.
- **Component Lifecycle (in Functional Components):** Understand how `useEffect` can replicate lifecycle methods.
- **Forms:** Master controlled vs. uncontrolled components for handling form data.
- **Project Enhancement:** Add features to your previous project, like fetching data from a public API.


### **Phase 3: Advanced React & Ecosystem**
Explore the broader React ecosystem and advanced patterns.

- **State Management Libraries:**
    - **Zustand or Redux Toolkit:** Understand when and why you might need a dedicated global state management library.

- **Routing:**
    - **React Router:** Learn how to create single-page applications with multiple views.

- **Styling:**
    - **Utility-First CSS (Tailwind CSS):** A popular choice for rapid UI development.

- **Performance Optimization:**
    - `React.memo` for memoizing components.
    - `useCallback` and `useMemo` for memoizing functions and values.
    - Code Splitting with `React.lazy` and `Suspense`.

- **Testing:**
    - **Vitest & React Testing Library:** Learn to write unit and integration tests for your components.


### **Phase 4: Continuous Learning**
The React ecosystem is always evolving.
- **Stay Updated:** Follow the official React blog and key figures in the community.
- **Explore Frameworks:** Once you are comfortable with React, it's time to learn a framework like Next.js!
- **Contribute:** Contribute to open-source projects to learn from experienced developers.


## Next.js Mastery Roadmap

### **Phase 1: The "Why" and Core Concepts**
Understand what problems Next.js solves on top of React.
- **What is Next.js?** Learn about its role as a React framework for production.
- **Key Features:**
    - **Rendering Methods:** This is the most crucial concept. Deeply understand the difference between:
        - Client-Side Rendering (CSR - standard React).
        - Server-Side Rendering (SSR).
        - Static Site Generation (SSG).
        - Incremental Static Regeneration (ISR).
    - **File-based Routing:** Understand how the `pages` (or `app`) directory structure creates routes.
    - **API Routes:** How to build a backend API directly within your Next.js application.
    - **Image Optimization:** The built-in `<Image>` component.
    - **Built-in CSS & Sass Support.**
- **Project:** Build a simple multi-page static website (like a blog) using file-based routing and SSG (`getStaticProps`).


### **Phase 2: App Router & Server Components**
This is the new paradigm in Next.js 13+ and is essential to learn.
- **The `app` Directory:** Understand the new file and folder conventions (`layout.js`, `page.js`, `loading.js`, `error.js`).
- **Server Components vs. Client Components:**
    - This is a fundamental shift. Learn what they are, their trade-offs, and when to use each.
    - Understand the `"use client"` directive.
- **Layouts:** Create shared UI that persists across route changes.
- **Data Fetching in Server Components:** Use `async/await` directly in your components for data fetching on the server.
- **Streaming with Suspense:** Learn how to stream UI from the server for a better user experience.
- **Project:** Rebuild your blog using the App Router, fetching data in Server Components and using Suspense for loading states.

### **Phase 3: Advanced Data Fetching & Caching**
Go deeper into how Next.js handles data and performance.
- **Data Fetching Functions:**
    - `getStaticProps` & `getStaticPaths` (for Pages Router with SSG).
    - `getServerSideProps` (for Pages Router with SSR).
    - The extended `fetch` API in the App Router for caching and revalidation.
- **Caching Strategies:** Understand how Next.js caches data by default and how to configure it.
- **Route Handlers (formerly API Routes):** Build more complex API endpoints within the App Router.
- **Server Actions:**
    - Learn how to execute server-side code in response to user interactions without manually creating API endpoints. This is a powerful feature for form submissions and mutations.
- **Project:** Add a contact form to your blog that uses a Server Action to handle the submission. Add a feature that requires fetching dynamic data (e.g., stock prices) to practice SSR or revalidation.

### **Phase 4: Authentication, Deployment, and Ecosystem**
Prepare your application for the real world.

- **Authentication:**
    - Implement authentication using libraries like **NextAuth.js** or **Clerk**. Understand server-side vs. client-side authentication flows.
- **Middleware:** Learn how to run code before a request is completed for things like authentication, redirects, or A/B testing.
- **Deployment:**
    - Deploy your application to **Vercel** (the creators of Next.js) to take advantage of all its features. Understand environment variables.
- **SEO:**
    - Leverage Next.js features for Search Engine Optimization (Metadata API, sitemaps, etc.).
- **Third-Party Integrations:**
    - Connect your Next.js app to a Headless CMS (like Sanity, Strapi, or Contentful).
    - Integrate with databases and other backend services.


### **Phase 5: Continuous Growth**
Next.js is a rapidly evolving framework.
- **Stay Current:** Follow the Vercel and Next.js blogs for the latest updates.
- **Explore the Ecosystem:** Look into other powerful tools in the Vercel ecosystem like SWR for data fetching.
- **Contribute & Build:** The best way to learn is by building complex projects and contributing to the community.
