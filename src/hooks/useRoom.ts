import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar?: string,
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean
}>


type Question = {
    id: string,
    author: {
        name: string,
        avatar?: string,
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean
}

export function useRoom(roomId: string) {
    const db = getDatabase()

    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`)

        return onValue(roomRef, (room) => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    }, [roomId])

    return { questions, title }
}
