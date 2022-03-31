import { useParams } from 'react-router-dom'
import { useState, FormEvent, Children } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getDatabase, ref, push } from 'firebase/database'


import logoImg from '../assets/images/logo.svg'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import '../styles/room.scss'

type RoomParams = {
    id: any
}

export function AdminRoom() {
    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('')
    const db = getDatabase()
    const { questions, title } = useRoom(roomId)

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()
        if (newQuestion.trim() === '') {
            return
        }

        if (!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        const roomRef = ref(db, `rooms/${roomId}/questions`)
        await push(roomRef, question)

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>


                <div className="question-list">
                    {Children.toArray(questions.map((question) => {
                        return (
                            <Question
                                content={question.content}
                                author={question.author}
                            />
                        )
                    }))}
                </div>
            </main>
        </div>
    )
}