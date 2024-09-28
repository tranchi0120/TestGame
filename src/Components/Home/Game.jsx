import { useState, useEffect } from 'react'
import './style.css'
import Button from '../Button/Button'

const Game = () => {
    const [numbers, setNumbers] = useState([])
    const [hiddenNumbers, setHiddenNumbers] = useState([])
    const [positions, setPositions] = useState([])
    const [clickedNumber, setClickedNumber] = useState(null)
    const [maxNumber, setMaxNumber] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [points, setPoints] = useState(0)
    const [clicked, setClicked] = useState(1)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [gameEnded, setGameEnded] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [gameStatus, setGameStatus] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        let interval

        if (!gameEnded && startTime) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime)
            }, 100)
        }

        return () => clearInterval(interval)
    }, [gameEnded, startTime])

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        const ms = milliseconds % 1000

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
            .toString()
            .padStart(3, '0')}`
    }

    const startGame = () => {
        const number = Number(inputValue)
        if (number < 1 || number > 1000 || isNaN(number)) {
            setError('Please enter a number between 1 and 1000')
            setStartTime(null)
            setElapsedTime(0)
            setGameStatus('')
            setNumbers([])
            return
        }

        const nums = Array.from({ length: number }, (_, i) => i + 1)

        setNumbers(nums)
        setPoints(0)
        setClicked(1)
        setGameEnded(false)
        setGameStatus('')
        setHiddenNumbers(Array(number).fill(false))
        generateRandomPositions(nums.length)
        setError('')
        setStartTime(Date.now())
        setElapsedTime(0)
        setMaxNumber(number)
    }

    const generateRandomPositions = (count) => {
        const pos = []
        const containerSize = 300
        const margin = 10
        const radius = 30

        for (let i = 0; i < count; i++) {
            const x = Math.random() * (containerSize - 2 * radius - margin)
            const y = Math.random() * (containerSize - 2 * radius - margin)
            pos.push({ x, y })
        }

        setPositions(pos)
    }

    const handleClick = (number) => {
        if (gameEnded || numbers.length === 0) return

        if (number === clicked) {
            setPoints((prevPoints) => prevPoints + 1)
            setClicked((prevClicked) => prevClicked + 1)
            setClickedNumber(number)

            setTimeout(() => {
                setHiddenNumbers((prev) => {
                    const newHidden = [...prev]
                    newHidden[number - 1] = true
                    return newHidden
                })
                setClickedNumber(null)
            }, 1000)

            if (clicked === maxNumber) {
                setGameEnded(true)
                setGameStatus('You Win!')
            }
        } else {
            setGameEnded(true)
            setGameStatus('Game Over!')
        }
    }
    const getStyle = (number) => {
        return {
            position: 'absolute',
            left: `${positions[number]?.x}px`,
            top: `${positions[number]?.y}px`,
            visibility: hiddenNumbers[number - 1] ? 'hidden' : 'visible',
            pointerEvents: hiddenNumbers[number - 1] ? 'none' : 'auto',
            zIndex: hiddenNumbers[number - 1]
                ? '0'
                : number < clicked
                ? '10000'
                : `${maxNumber - number + 1}`
        }
    }

    return (
        <div className='App'>
            <h1>GAME</h1>
            {gameEnded && <h2 className='noti'>{gameStatus}</h2>}
            <div className='form'>
                <div className='formGroup'>
                    <input
                        type='number'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Enter a number (1-1000)'
                    />
                    <button onClick={startGame}>Start Game</button>
                </div>
                {error && <p className='error'>{error}</p>}
            </div>
            <p className='point'>Points: {points}</p>
            <p className='time'>Elapsed Time: {formatTime(elapsedTime)}</p>

            <div className='number-container'>
                {numbers.map((number) => (
                    <Button
                        key={number}
                        clickedNumber={clickedNumber}
                        number={number}
                        getStyle={getStyle}
                        hiddenNumbers={hiddenNumbers}
                        handleClick={handleClick}
                    />
                ))}
            </div>
        </div>
    )
}

export default Game
