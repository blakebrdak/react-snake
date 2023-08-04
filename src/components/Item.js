import "../css/Item.css";

export default function item(props) {
  return (
    <div
      className="item"
      style={{
        left: `${props.x * (100 / props.board) + (100 / props.board / 3)}%`,
        top: `${props.y * (100 / props.board)  + (100 / props.board / 3)}%`,
        width: `${100 / props.board / 3}%`,
        height:  `${100 / props.board / 3}%`,
        visibility: props.show ? "visible" : "hidden",
      }}
    ></div>
  );
}
