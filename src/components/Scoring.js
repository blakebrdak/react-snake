import '../css/Scoring.css';

export default function Scoring (props) {
    return <div className='scoring-wrapper'>
        <p>High Score: {props.highScore}</p>
        <p>Current Score: {props.score}</p>
    </div>
}