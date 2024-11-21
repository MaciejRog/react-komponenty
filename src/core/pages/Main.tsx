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
    <div>1111</div>
    <ul>
      <li>AAA</li>
      <li>
        BBB
        <div>DDD</div>
        <ul>
          <li>FFF111</li>
          <li>GGG111</li>
          <li>HHH111</li>
        </ul>
        <div>EEE</div>
        <ul>
          <li>FFF222</li>
          <li>GGG222</li>
          <li>HHH222</li>
        </ul>
      </li>
      <li>CCC</li>
    </ul>
    <div>2222</div>

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
