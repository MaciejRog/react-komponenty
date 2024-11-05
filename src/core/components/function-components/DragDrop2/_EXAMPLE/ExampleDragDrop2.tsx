import { ContextProviderDragDrop } from "../DragDrop.context";
import Drop from "../Drop/Drop";

function ExampleDragDrop2() {
  return (
    <div>
      <ContextProviderDragDrop>
        <Drop />
      </ContextProviderDragDrop>
    </div>
  );
}

export default ExampleDragDrop2;
