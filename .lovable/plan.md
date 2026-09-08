# Resource Guide chatbot that reads inside the documents

An assistant on the Resource Hub that answers questions about the library, recommends the right resources, and quotes the exact passage and page number from inside the documents.

## What the user gets

- A floating chat button in the bottom-right of the Resource Hub (kept clear of the mobile bottom menu).
- A chat panel in the platform's purple/teal style, with a short welcome and 3 starter prompts, e.g. "I'm starting a youth council from scratch", "How do I reach under-represented young people?", "Give me a meeting agenda template".
- Answers stream as they are written, and each answer ends with the sources it used: a compact card per resource showing cover, title, type, area, and the page(s) the answer came from. Clicking a card opens the document.
- A "Conversations" list inside the panel: start a new chat, switch between chats from the current visit. Nothing is saved — closing the browser starts fresh, as chosen.
- If the assistant can't find anything in the library, it says so instead of guessing.

## How the documents get in

- Each resource gets a **document file**: for the direct PDF links we fetch the file automatically; for the nine web-page resources you upload the PDF in the admin form.
- In Admin → Resources, each row gets an **Index document** button plus a status label (Not indexed / Indexing / Indexed, 42 pages / Failed). Indexing runs only when you press it, and can be re-run after replacing a file.
- Indexing reads the PDF page by page, splits it into passages, and stores them with a searchable meaning-based fingerprint so the assistant can find the right passage later.

## Technical notes

- New private storage bucket `resource-files` for the PDFs; admin-only write, read via signed URL from the server.
- New columns on `resources`: `file_path`, `index_status`, `page_count`, `indexed_at`.
- New table `resource_chunks` (`resource_id`, `page`, `content`, `embedding vector`, ordinal) with the `vector` extension, an index for similarity search, GRANTs, RLS (admins write; read only via server), and a `match_resource_chunks` search function.
- Indexing as an admin-only `createServerFn` in `src/lib/resource-index.functions.ts`: fetch/read the PDF (pure-JS extraction, Worker-compatible), chunk ~1000 chars with page numbers, embed via the Lovable AI Gateway embeddings endpoint in batches, upsert chunks, update status.
- Chat as a streaming server route `src/routes/api/resource-chat.ts` using the AI SDK `streamText` with the Lovable AI Gateway provider (`src/lib/ai-gateway.server.ts`), keys server-side only. Two tools: `searchResourceContent` (embeds the question, retrieves top passages with page numbers) and `listResources` (filters by area/type/topic). System prompt forbids anything not returned by the tools.
- Client uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`; UI built from AI Elements primitives (conversation, message, prompt-input, shimmer, tool) restyled to the brand, in `src/components/resource-chat/`, mounted only on `src/routes/resource-hub.tsx`.
- In-memory conversation list (React state) keyed by chat id — no chat tables, no localStorage.
- Packages to add: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, plus a JS PDF text extractor.

## Order of work

1. Storage bucket, database changes, admin upload + Index button.
2. Index the direct-PDF resources; you upload the nine remaining PDFs.
3. Chat route, tools, and the floating chat panel on the Resource Hub.

## Out of scope

- The bot recommends and links; it does not change the hub's filters for you.
- No chat history saved to accounts, and the bubble does not appear on other pages.
