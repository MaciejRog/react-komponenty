import {
  useContextDrapDropDispatch,
  useContextDrapDropValue,
} from "../DragDrop.context";
import { CONTEXT_ACTIONS_DRAG_DROP } from "../DragDrop.utils";
import styles from "./Drop.module.css";
import InnerDropElement from "./InnerDropElement/InnerDropElement";

function Drop() {
  const {
    drop: { position },
  } = useContextDrapDropValue();
  const dispatch = useContextDrapDropDispatch();

  const handlePointerMove = () => {
    if (position !== 4) {
      dispatch({
        type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
        payload: 4,
      });
    }
  };

  return (
    <div className={`${styles.Drop}`} onPointerMove={handlePointerMove}>
      <InnerDropElement dropPosition={1}>
        <div className="test">OBIEKT 1</div>
      </InnerDropElement>

      <InnerDropElement dropPosition={2}>
        <div className="test">OBIEKT 2</div>
      </InnerDropElement>

      <InnerDropElement dropPosition={3}>
        <div className="test">OBIEKT 3</div>
      </InnerDropElement>

      <InnerDropElement dropPosition={4}></InnerDropElement>
    </div>
  );
}

export default Drop;
