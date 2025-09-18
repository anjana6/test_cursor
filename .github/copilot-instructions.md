# Copilot Instructions

These are the coding conventions and rules that must always be followed when reviewing pull requests for this project.

---

## Naming Conventions
- All **variables and functions** must use `camelCase`.
- Do not allow `snake_case` or inconsistent naming.

---

## Code Style
- Follow **ESLint + Prettier defaults**.
- Ensure proper indentation and spacing.
- Always use **`const`** or **`let`** instead of `var`.
- Avoid unused imports, variables, and functions.
- Prefer **arrow functions** unless a named function is required.
- Do not allow hardcoded numbers (magic numbers).  
  - Always define numeric values as named **constants** or configuration variables.
