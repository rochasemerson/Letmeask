import { useParams, useNavigate } from 'react-router-dom'
import { Children } from 'react'
import { getDatabase, ref, remove, update } from 'firebase/database'


import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import '../styles/room.scss'

type RoomParams = {
    id: any
}

export function AdminRoom() {
    const navigate = useNavigate()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const db = getDatabase()
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        const roomRef = ref(db, `rooms/${roomId}`)
        await update(roomRef, {
            endedAt: new Date()
        })

        navigate('/')
    }

    async function handleDeleteQuestion(questionId: string) {
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await remove(questionRef)
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
        await update(questionRef, {
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
        await update(questionRef, {
            isHighlighted: true
        })
    }



    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
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
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como repondida" />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Destacar pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    }))}
                </div>
            </main>
        </div>
    )
}
