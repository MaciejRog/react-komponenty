import { useEffect, useRef, useState } from "react";
import {
  getInnerRanges,
  getNearestNotTextElement,
} from "./RichTextEditor.utils";
import styles from "./RichTextEditor.module.css";
import RichTextBtnBold from "./elements/RichTextBtn/RichTextBtnBold";
import RichTextBtnUnderline from "./elements/RichTextBtn/RichTextBtnUnderline";
import RichTextBtnItalic from "./elements/RichTextBtn/RichTextBtnItalic";

const INIT_SELECTION_REF: {
  selection: Selection | null;
  range: Range | undefined;
  nearestWrappingElement: HTMLElement | null;
} = {
  selection: null,
  range: undefined,
  nearestWrappingElement: null,
};

/*
obsługa LIST (ul, ol)
*/

function RichTextEditor({
  value = ``,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [innerValue] = useState(value);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const htmlEditor = useRef<HTMLDivElement>(null);
  const selectionRef = useRef(INIT_SELECTION_REF);

  const handleSelectionChange = () => {
    const selection = document.getSelection();
    const range = selection?.getRangeAt(0).cloneRange();
    const commonAncestorContainer = range?.commonAncestorContainer;
    const nearestWrappingElement = getNearestNotTextElement(
      commonAncestorContainer
    );

    selectionRef.current = {
      selection: selection,
      range: range,
      nearestWrappingElement: nearestWrappingElement,
    };
  };

  const handleStyleChange =
    (elementStyleName: any, computedStyleName: any, calcValue: any) =>
    (): void => {
      const { range, nearestWrappingElement } = selectionRef.current;
      if (range) {
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

            handleValueChange();
          }
        });
      }
    };

  const handleValueChange = () => {
    if (htmlEditor.current && setValue) {
      setValue(htmlEditor.current.innerHTML);
    }
  };

  return (
    <div className={`${styles.RichTextEditor}`}>
      <div className={`${styles.RichTextEditorBtnsWrapper}`}>
        <RichTextBtnBold onClick={handleStyleChange} />
        <RichTextBtnUnderline onClick={handleStyleChange} />
        <RichTextBtnItalic onClick={handleStyleChange} />
        <button
          onClick={() => {
            handleStyleChange("color", "color", (elStyle: any) => {
              console.warn("elStyle = ", elStyle);
              if (elStyle === "rgb(0, 0, 0)") {
                return "gold";
              } else {
                return "rgb(0, 0, 0)";
              }
            })();
          }}
        >
          COLOR
        </button>
        <button
          onClick={() => {
            const img = document.createElement("img");
            img.style.width = "100%";
            img.style.height = "auto";
            img.src =
              "https://justjoin.it/blog/wp-content/uploads/2018/08/react2.png";
            selectionRef.current.range?.insertNode(img);
          }}
        >
          IMAGE
        </button>
      </div>
      <div
        ref={htmlEditor}
        data-rich-text-editor-component="true"
        style={{
          minHeight: "26px",
          padding: "4px",
          border: "1px solid black",
          borderRadius: "4px",
        }}
        contentEditable="true"
        spellCheck="true"
        role="textbox"
        dangerouslySetInnerHTML={{ __html: innerValue }}
        onInput={handleValueChange}
      ></div>
    </div>
  );
}

export default RichTextEditor;
