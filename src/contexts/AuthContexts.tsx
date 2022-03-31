import { createContext, ReactNode, useState, useEffect } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"


type User = {
    id: string,
    name: string,
    avatar: string | null
}

type AuthContextType = {
    user: User | undefined,
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const auth = getAuth();
    const [user, setUser] = useState<User>()
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const { displayName, photoURL, uid } = user
  
            if (!displayName) {
              throw new Error('Missing information from Google Account.')
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
        }
      })
  
      return () => {
        unsubscribe()
      }
    }, [])
  
    async function signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
          if (result.user) {
            const { displayName, photoURL, uid } = result.user
  
            if (!displayName) {
              throw new Error('Missing information from Google Account.')
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}
