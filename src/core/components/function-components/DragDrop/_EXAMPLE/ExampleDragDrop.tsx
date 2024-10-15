import Drag from "../Drag";
import { ContextProviderDragDrop } from "../DragDrop.context";
import { DROP_LAYOUT } from "../DragDrop.utils";
import Drop from "../Drop";
import styles from "./ExampleDragDrop.module.css";

function ExampleDragDrop() {
  return (
    <ContextProviderDragDrop>
      <div className={`${styles.DragDropExample}`}>
        <p>EXAMPLE DRAG DROP</p>
        <ExampleDrop />
        <ExampleDrag1 id={1} />
        <ExampleDrag1 id={2} />
        <ExampleDrag1 id={3} />
      </div>
    </ContextProviderDragDrop>
  );
}

export default ExampleDragDrop;

const ExampleDrop = () => {
  return (
    <div className={`${styles.DropExample}`}>
      <Drop layout={DROP_LAYOUT.FLEX_COLUMN}></Drop>
    </div>
  );
};

const ExampleDrag1 = ({ id = 1 }: { id: number }) => {
  return (
    <Drag name={`example-${id}`} className="DragExample">
      <div>Przerzuć mnie {id}</div>
    </Drag>
  );
};
