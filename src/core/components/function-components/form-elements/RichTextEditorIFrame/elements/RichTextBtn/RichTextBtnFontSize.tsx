import { useEffect, useState } from "react";
import styles from "./RichTextBtn.module.css";
import {
  getInnerRanges,
  getNearestNotTextElement,
  isInRichTextEditor,
} from "../../RichTextEditor.utils";

const INIT_VALUE = "16";

function RichTextBtnFontSize({
  selection,
  handleUpdate,
}: {
  selection: Selection | null;
  handleUpdate: Function;
}) {
  const [value, setValue] = useState(INIT_VALUE);
  const selectionString = selection?.toString();

  useEffect(() => {
    const range = selection?.getRangeAt(0);
    const firstSelectedElement = getNearestNotTextElement(
      range?.startContainer
    );
    if (firstSelectedElement && isInRichTextEditor(firstSelectedElement)) {
      const fontSize = getComputedStyle(firstSelectedElement)["fontSize"];
      setValue(fontSize.split("px")[0] ?? INIT_VALUE);
    }
  }, [selection, selectionString]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    const range = selection?.getRangeAt(0);
    const newRangesElements: Element[] = [];
    if (range) {
      const nearestWrappingElement = getNearestNotTextElement(
        range?.commonAncestorContainer
      );
      const ranges = getInnerRanges(range, nearestWrappingElement);
      ranges.forEach((rangeEl) => {
        const clone = rangeEl.cloneRange().cloneContents();
        const nearestElement = getNearestNotTextElement(rangeEl.startContainer);
        if (nearestElement) {
          if (clone.textContent === nearestElement.innerHTML) {
            nearestElement.style["fontSize"] = newHeight + "px";

            newRangesElements.push(nearestElement);
          } else {
            const boldElement = document.createElement("span");
            boldElement.style["fontSize"] = newHeight + "px";
            boldElement.appendChild(clone);
            rangeEl?.extractContents();
            rangeEl?.insertNode(boldElement);

            newRangesElements.push(boldElement);
          }
        }
      });
    }
    setValue(newHeight);
    handleUpdate();
  };

  return (
    <div className={`${styles.RichTextBtn}`}>
      <div>H</div>
      <label>
        <input type="number" value={value} onChange={handleChange} />
        <span>px</span>
      </label>
    </div>
  );
}

export default RichTextBtnFontSize;
