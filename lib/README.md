# lib

Non-component logic: Firebase clients (`firebase/`), scroll and motion helpers
(`motion/`, `scroll.ts`), Zod schemas (`validation/`), and the Gmail/mailto URL
builders used by Contact.

Anything here that can be tested without a DOM should have a Vitest unit test
alongside the project's `tests/unit` suite.
