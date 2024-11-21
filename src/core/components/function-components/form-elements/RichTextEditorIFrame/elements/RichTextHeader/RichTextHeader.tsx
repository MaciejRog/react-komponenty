import {
  getInnerRanges,
  getNearestNotTextElement,
} from "../../RichTextEditor.utils";
import RichTextBtnBold from "../RichTextBtn/RichTextBtnBold";
import RichTextBtnColor from "../RichTextBtn/RichTextBtnColor";
import RichTextBtnFontSize from "../RichTextBtn/RichTextBtnFontSize";
import RichTextBtnImg from "../RichTextBtn/RichTextBtnImg";
import RichTextBtnItalic from "../RichTextBtn/RichTextBtnItalic";
import RichTextBtnList from "../RichTextBtn/RichTextBtnList";
import RichTextBtnMail from "../RichTextBtn/RichTextBtnMail";
import RichTextBtnUnderline from "../RichTextBtn/RichTextBtnUnderline";
import styles from "./RichTextHeader.module.css";

function RichTextHeader({
  selection,
  updateValue,
}: {
  selection: Selection | null;
  updateValue: Function;
}) {
  const range =
    selection?.rangeCount && selection?.rangeCount > 0
      ? selection?.getRangeAt(0)
      : undefined;

  const handleStyleChange =
    (elementStyleName: any, computedStyleName: any, calcValue: any) =>
    (): void => {
      if (selection) {
        if (range) {
          const commonAncestorContainer = range.commonAncestorContainer;
          const nearestWrappingElement = getNearestNotTextElement(
            commonAncestorContainer
          );

          const ranges = getInnerRanges(range, nearestWrappingElement);
          ranges.forEach((rangeEl) => {
            const clone = rangeEl.cloneContents();
            const nearestElement = getNearestNotTextElement(
              rangeEl.startContainer
            );
            if (nearestElement) {
              const style =
                getComputedStyle(nearestElement)[computedStyleName as number];
              const newValue = calcValue(style);
              if (clone.textContent === nearestElement.innerHTML) {
                nearestElement.style[elementStyleName] = newValue;
              } else {
                const boldElement = document.createElement("span");
                boldElement.style[elementStyleName] = newValue;
                boldElement.appendChild(clone);
                rangeEl?.extractContents();
                rangeEl?.insertNode(boldElement);
              }

              updateValue();
            }
          });
        }
      }
    };

  return (
    <div className={`${styles.RichTextHeader}`}>
      <RichTextBtnBold range={range} onClick={handleStyleChange} />
      <RichTextBtnUnderline range={range} onClick={handleStyleChange} />
      <RichTextBtnItalic range={range} onClick={handleStyleChange} />
      <RichTextBtnColor range={range} onClick={handleStyleChange} />
      <RichTextBtnFontSize selection={selection} handleUpdate={updateValue} />
      <RichTextBtnImg range={range} handleUpdate={updateValue} />
      <RichTextBtnMail range={range} handleUpdate={updateValue} />
      <RichTextBtnList
        listType="OL"
        selection={selection}
        handleUpdate={updateValue}
      />
      <RichTextBtnList
        listType="UL"
        selection={selection}
        handleUpdate={updateValue}
      />
    </div>
  );
}

export default RichTextHeader;
