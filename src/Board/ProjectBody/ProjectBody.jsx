import axios from 'axios';
import React from 'react';
import ModalWindow from './ModalWindow/ModalWindow';
import './ProjectBody.scss'

const ProjectBody = () => {
    const [start, setStart] = React.useState(false)
    const [end, setEnd] = React.useState(false)
    const [text, setText] = React.useState([])
    const [sumMisstac, setSumMisstac] = React.useState(100)

    let countingLetter = 0
    let misstacsCount = 0
    let countSeconds = 0
    let letterCount = 0
    let interval
    let result

    async function restart() {
        let getData = await axios.get('https://baconipsum.com/api/?type=meat-and-filler')
        let data = getData.data[0] ? getData.data[0] : []
        if (data.length > 510) {
            data = data.slice(0, 510)
        }
        data = data.trim()
        data = data.split('')
        setText(data)
    }

    React.useEffect(() => {
        let functionGetData = async () => {
            let getData = await axios.get('https://baconipsum.com/api/?type=meat-and-filler')
            let data = getData.data[0] ? getData.data[0] : []
            if (data.length > 510) {
                data = data.slice(0, 510)
            }
            data = data.trim()
            data = data.split('')
            setText(data)
        }
        functionGetData()
    }, [])

    result = text.map((item, i) => {
        return <span key={i}>
            {item}
        </span>
    })

    function firstLetter() {
        let spans = document.querySelectorAll('.border span')
        spans.forEach(item => {
            item.classList.remove('loyal')
        })
        spans[0].classList.add('trueLetter')
    }

    function checkKey(e) {
        let span = document.querySelectorAll('.border span')
        let strLength = span.length
        if (!(e.key == 'Shift' || e.key == 'Control' || e.key == 'Meta' || e.key == 'Backspace' || e.key == 'Escape' || e.key == 'Tab')) {
            if (e.key == span[countingLetter].textContent) {
                span[countingLetter].classList.remove('trueLetter')
                span[countingLetter].classList.remove('falseLetter')
                span[countingLetter].classList.add('loyal')
                countingLetter++
                if (span[countingLetter]) {
                    span[countingLetter].classList.remove('falseLetter')
                    span[countingLetter].classList.add('trueLetter')
                }
                letterCount++
                if (!(span[countingLetter])) {
                    setEnd(true)
                    removeEvent()
                    window.removeEventListener('keydown', checkKey)
                }
            } else {
                var audio = new Audio('');
                audio.src = 'https://zvukipro.com/uploads/files/2019-06/1561356080_b5f0886abfa6621.mp3'
                audio.play();
                span[countingLetter].classList.remove('trueLetter')
                span[countingLetter].classList.add('falseLetter')
                misstacsCount++
                let sum = 100 - ((misstacsCount * 100) / strLength)
                if (sum < 0) {
                    sum = 0
                }
                setSumMisstac(sum.toFixed(1))
            }
        }

    }

    function resize() {
        if (window.innerWidth <= 740) {
            document.querySelector('.smallScreen').style.display = 'flex'
            document.querySelector('.bigScreen').style.display = 'none'
        }
        if (window.innerWidth > 740) {
            document.querySelector('.smallScreen').style.display = 'none'
            document.querySelector('.bigScreen').style.display = 'block'
        }
    }

    function tryAgain() {
        setSumMisstac(100)
        window.addEventListener('keydown', checkKey)
        let span = document.querySelectorAll('.border span')
        span.forEach(item => {
            item.classList.remove('loyal')
        })
        countingLetter = 0
    }
    
    function inter() {
        interval = setInterval(() => {
            countSeconds = countSeconds+3
            let speed = (letterCount / countSeconds) * 60
            document.querySelector('.right-column .speed span').innerHTML = speed.toFixed(0)
        }, 3000);
    }

    function removeEvent() {
        window.removeEventListener('load', inter)
        clearInterval(interval)
        document.querySelector('.right-column .speed span').innerHTML = '0'
    }
    
    return (
        <div className='projectBody'>
            <div className="left-column">
                <div className="border">
                    <div className='smallScreen' style={{display: 'none'}}>
                        <p className='smallScreen__title'>Web приложине не работает с таким размером экрана</p>
                    </div>
                    <div className="bigScreen">
                        {result}
                    </div>
                </div>
            </div>

            <div className="right-column">
                <div className="speed">
                    Скорость:
                    <br/>
                    <span>0</span>зн/мин
                </div>
                <div className="accuracy">
                    Точность:
                    <br/>
                    <span>{sumMisstac}</span>%
                </div>
            </div>

            {/* <audio className="audio" data-key="71" src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"></audio> */}
            {start || <ModalWindow>
                <button onClick={() => {
                    setStart(true)
                    firstLetter()
                    window.addEventListener('resize', resize)
                    window.addEventListener('keydown', checkKey)
                    inter()
                }}>Начать</button>
            </ModalWindow>}
            {end && <ModalWindow countSeconds={countSeconds}>
                <p>Ваш результат:</p>
                <p>Точность: {sumMisstac}%</p>
                <button onClick={() => {
                    restart()
                    setEnd(false)
                    firstLetter()
                    tryAgain()
                    inter()
                }}>Заного</button>
            </ModalWindow>}
        </div>
    );
};

export default ProjectBody;