import "../css/Player.css";

export default function Player(props) {
  return (
    <div
      className="player"
      style={{
        left: `${props.x * (100 / props.board)}%`,
        top: `${props.y * (100 / props.board)}%`,
        width: `${100 / props.board}%`,
        height:  `${100 / props.board}%`,
        opacity: !props.gameOver ? 1 : 0,
      }}
    ></div>
  );
}
