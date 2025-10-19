import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';

export type NexusUser = Pick<
  User,
  'uid' | 'displayName' | 'email' | 'photoURL'
>;

type AuthContextValue = {
  user: NexusUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<NexusUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser({
        uid: 'demo-user',
        displayName: 'Modo Demonstrativo',
        email: 'demo@nexus.app',
        photoURL: null,
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginWithGoogle: async () => {
        if (!isFirebaseConfigured || !auth) {
          setUser({
            uid: 'demo-user',
            displayName: 'Modo Demonstrativo',
            email: 'demo@nexus.app',
            photoURL: null,
          });
          return;
        }

        setLoading(true);
        try {
          await signInWithPopup(auth, googleProvider);
        } finally {
          setLoading(false);
        }
      },
      logout: async () => {
        if (!isFirebaseConfigured || !auth) {
          setUser(null);
          return;
        }

        setLoading(true);
        try {
          await signOut(auth);
        } finally {
          setLoading(false);
        }
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}

function mapFirebaseUser(user: User): NexusUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}
