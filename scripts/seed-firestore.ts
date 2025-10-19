import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { mockProjects, mockTasks } from '../src/features/tasks/data/mock-data';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Configure as variáveis de ambiente antes de executar o seed. Faltando: ${missing.join(', ')}`,
    );
  }
}

async function seed() {
  assertConfig();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const batch = writeBatch(db);

  mockProjects.forEach((project) => {
    const reference = doc(db, 'projects', project.id);
    batch.set(reference, {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  mockTasks.forEach((task) => {
    const reference = doc(db, 'tasks', task.id);
    batch.set(reference, {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
  console.log('Seed concluído com sucesso.');
}

seed().catch((error) => {
  console.error('Falha ao executar seed do Firestore:', error);
  process.exitCode = 1;
});
