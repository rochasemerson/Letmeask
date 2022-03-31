import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { getDatabase, ref, push  } from "firebase/database";


import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'


export function NewRoom() {
    const navigate = useNavigate()

    const { user } = useAuth()
    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()
        const db = getDatabase()

        if (newRoom.trim() === '') {
            return
        }
        const postData = {
            title: newRoom,
            authorId: user?.id
        }
        const roomRef = ref(db, 'rooms')

        const firebaseRoom = await push(roomRef, postData)

        navigate(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da usa audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
