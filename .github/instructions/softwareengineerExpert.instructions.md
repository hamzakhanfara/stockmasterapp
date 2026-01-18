---
description: Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## Project Context
This project is a store management application called "Store Shelves App". It is built using React for the frontend and utilizes Material-UI (MUI) for UI components. The application includes features such as point of sale (POS) management, order creation, and inventory tracking. The codebase follows modern JavaScript/TypeScript practices and emphasizes user experience with responsive design.
## Coding Guidelines
1. **Code Style**: Follow consistent code formatting using Prettier and ESLint configurations defined in the project. Use 2 spaces for indentation, single quotes for strings, and always include semicolons.
2. **Component Structure**: Use functional components with React Hooks for state management and side effects. Prefer composition over inheritance for component reuse.
3. **Material-UI Usage**: Leverage MUI components and theming capabilities. Use the `sx` prop for styling when possible, and ensure components are responsive.
4. **Internationalization**: Use the `react-i18next` library for all user-facing text to support multiple languages. Always use the `t` function for translations. I always want you to use this fonctionnality to translate text so I dont want the code to have hardcoded strings.
5. **Store Management**: Use the provided `useStore` hook for accessing and manipulating global state. Ensure that state updates are performed immutably.
6. **Service Integration**: When interacting with backend services, always create stores for each entity (e.g., ProductStore, OrderStore).
7. **Workflow**: When developing new features or fixing bugs, always check the whole workflow of creation of services from backend database, controllers, routed, frontend service integration, stores and frontend UI.
8. **Error Handling**: Implement proper error handling for asynchronous operations, including user feedback for loading states and errors.