# NEXUS – Gestão de Projetos e CRM

Projeto em React + TypeScript + Vite com integração a Firebase (Auth, Firestore e Storage), gestão de CRM e tarefas com experiência responsiva.

## Scripts úteis

### Popular o Firestore com dados mockados

1. Crie um arquivo `.env` na raiz com as chaves `VITE_FIREBASE_*` usadas no front-end.
2. Instale as dependências do projeto (`npm install`).
3. Execute `npx tsx scripts/seed-firestore.ts` para escrever os mocks nas coleções `tasks` e `projects`.
   - Alternativa sem `tsx`: `node -r dotenv/config scripts/seed-firestore.ts`.

## Comandos principais

- `npm run dev` – inicia o modo de desenvolvimento (Vite).
- `npm run build` – build de produção com code-splitting.
- `npm run preview` – visualiza o build localmente.

## Stack e recursos

- React + TypeScript + Vite
- Zustand para gerenciamento de estado
- Firebase Authentication, Firestore e Storage
- DnD Kit para interações de drag & drop
- Tailwind CSS para estilização
