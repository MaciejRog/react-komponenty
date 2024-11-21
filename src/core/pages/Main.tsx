// import ExampleAnimation from "../components/function-components/Animation/_EXAMPLE/ExampleAnimation";
// import ExampleDragDrop from "../components/function-components/DragDrop/_EXAMPLE/ExampleDragDrop";
// import ExampleDragDrop2 from "../components/function-components/DragDrop2/_EXAMPLE/ExampleDragDrop2";

import { useState } from "react";
import RichTextEditor from "../components/function-components/form-elements/RichTextEditor/RichTextEditor";

function Main() {
  // const [textValue, setTextValue] = useState(`
  //   toJestWolnyBezNiczego<span>SPAN</span><div>ToJestWDivie</div>
  //   <ol>
  //     <li>ABC 1</li>
  //     <li>
  //       <div>
  //         ABC <span>SPAN 1</span>
  //       </div>
  //     </li>
  //     <li>
  //       <span>OPIS OL LI</span>
  //       <ol>
  //         <li>DEF 2</li>
  //         <li>
  //           <div>
  //             DEF <span>SPAN 2</span>
  //           </div>
  //         </li>
  //       </ol>
  //     </li>
  //   </ol>
  //   <p>PRAGRAF 1</p>
  //   <p><span>PRAGRAF 2</span></p>
  //   <p>PRAGRAF 3</p>
  // `);
  //##############################
  const [textValue, setTextValue] = useState(`
    <div>111</div><div>222</div><div>333</div><div>444<br></div>
  `);
  //##############################
  // const [textValue, setTextValue] = useState(``);

  return (
    <div>
      {/* <ExampleAnimation /> */}
      {/* <ExampleDragDrop /> */}
      {/* <ExampleDragDrop2 /> */}
      <RichTextEditor value={textValue} setValue={setTextValue} />
    </div>
  );
}

export default Main;
