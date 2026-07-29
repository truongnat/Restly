```markdown
# Restly Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the Restly TypeScript codebase. It covers file organization, import/export styles, commit message conventions, and testing patterns, providing clear examples and suggested commands to streamline your workflow.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - **Example:** `user-service.ts`, `api-client.test.ts`

### Import Style
- Use **alias imports** for modules.
  - **Example:**
    ```typescript
    import { fetchData as apiFetchData } from './api-client';
    ```

### Export Style
- Use **named exports** for all exported entities.
  - **Example:**
    ```typescript
    // In user-service.ts
    export function getUser() { ... }
    export const USER_ROLE = 'admin';
    ```

### Commit Message Conventions
- Follow **conventional commit** format.
- Prefixes used: `fix`, `test`
- Keep commit messages concise (average ~35 characters).
  - **Example:**
    ```
    fix: handle null response in api-client
    test: add edge case for user-service
    ```

## Workflows

### Fixing a Bug
**Trigger:** When a bug or issue is identified in the codebase  
**Command:** `/fix-bug`

1. Locate the bug in the relevant TypeScript file.
2. Apply the fix, following kebab-case file naming and alias import conventions.
3. Write or update a corresponding test in a `*.test.ts` file.
4. Commit your changes using the `fix:` prefix.
    ```
    fix: correct error handling in api-client
    ```
5. Push your branch and open a pull request.

### Writing a Test
**Trigger:** When adding new features or fixing bugs  
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.ts`.
2. Write tests for the relevant functions or modules.
3. Use named imports and exports in your test files.
4. Commit with the `test:` prefix.
    ```
    test: add tests for getUser function
    ```

## Testing Patterns

- Test files follow the `*.test.ts` naming convention.
- The testing framework is not explicitly defined; use standard TypeScript testing practices.
- Place tests alongside or near the modules they test.
- Use named imports/exports in test files.
  - **Example:**
    ```typescript
    import { getUser } from './user-service';

    describe('getUser', () => {
      it('returns user data', () => {
        // test implementation
      });
    });
    ```

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /fix-bug     | Guide for fixing bugs and committing    |
| /write-test  | Steps for writing and committing tests  |
```
