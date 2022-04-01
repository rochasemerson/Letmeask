import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { useAuth } from '../hooks/useAuth'

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar?: string,
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
    likes: Record<string, {authorId:string}>
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar?: string,
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
    likeCount: number,
    likeId: string | undefined
}

export function useRoom(roomId: string) {
    const { user } = useAuth()
    const db = getDatabase()

    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`)

        onValue(roomRef, (room) => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            off(roomRef)
        }
    }, [roomId, user?.id])

    return { questions, title }
}
