# Resource Guide chatbot for the Resource Hub

Yes — this is very doable. A small assistant lives on the Resource Hub, answers questions about the library in plain language, and recommends the actual resources that fit the person's situation.

## What the user gets

- A floating chat button in the bottom-right corner of the Resource Hub (kept clear of the mobile bottom menu).
- Clicking it opens a chat panel styled in the platform's purple/teal look, with a short welcome line and 3 starter suggestions, for example:
  - "I'm starting a youth council from scratch"
  - "Show me templates for meeting facilitation"
  - "What can help with reaching under-represented youth?"
- The assistant replies as it types, and when relevant it shows compact resource cards (cover, title, type, area) below its answer. Clicking a card opens that resource's link in a new tab.
- A "Conversations" list inside the panel: the user can start a new chat and switch between the chats from the current visit. Nothing is stored — closing the browser starts fresh, as chosen.
- If the assistant can't help or the service is busy, it says so clearly in the panel instead of failing silently.

## How it answers

The assistant only talks about resources that are actually in the library. It reads them from the database at answer time, so newly added publications are covered automatically, and it never invents titles or links. Questions outside the library's scope get a short, friendly redirect.

## Technical notes

- New server route `src/routes/api/resource-chat.ts` using the AI SDK `streamText` with the Lovable AI Gateway provider helper (`src/lib/ai-gateway.server.ts`), keys stay server-side.
- One tool, `searchResources`, queries `public.resources` (published only) on `title`, `description`, `area`, `resource_type`, `topics` and returns a compact set of rows including `image_url` and `url`. The system prompt forbids recommending anything not returned by the tool.
- Client uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`; messages rendered from `message.parts`, with a custom card renderer for `searchResources` tool output.
- UI built from AI Elements primitives (conversation, message, prompt-input, shimmer, tool) installed via the shadcn registry, restyled to the brand.
- In-memory conversation list (React state) keyed per chat id — no database tables, no localStorage.
- New components under `src/components/resource-chat/`; mounted only in `src/routes/resource-hub.tsx`.
- Packages to add: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`.

## Out of scope

- It does not change the hub's filters for you (it recommends and links instead).
- No chat history saved to accounts, and the bubble does not appear on other pages.
