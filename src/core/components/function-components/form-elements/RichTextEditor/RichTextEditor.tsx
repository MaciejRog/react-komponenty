import { useEffect, useRef, useState } from "react";
import {
  getInnerRanges,
  getNearestNotTextElement,
  RICH_TEXT_EDITOR_TYPE,
} from "./RichTextEditor.utils";
import styles from "./RichTextEditor.module.css";
import RichTextBtnBold from "./elements/RichTextBtn/RichTextBtnBold";
import RichTextBtnUnderline from "./elements/RichTextBtn/RichTextBtnUnderline";
import RichTextBtnItalic from "./elements/RichTextBtn/RichTextBtnItalic";
import RichTextBtnColor from "./elements/RichTextBtn/RichTextBtnColor";
import RichTextBtnImg from "./elements/RichTextBtn/RichTextBtnImg";
import RichTextBtnMail from "./elements/RichTextBtn/RichTextBtnMail";

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
obsługa mailTo
*/

function RichTextEditor({
  value = ``,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [editorType, setEditorType] = useState(RICH_TEXT_EDITOR_TYPE.PREVIEW);
  const [selectedRange, setSelectedRange] = useState<Range | undefined>(
    undefined
  );
  const [innerValue, setInnerValue] = useState(value);

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
    setSelectedRange(range);
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
        <RichTextBtnBold range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnUnderline
          range={selectedRange}
          onClick={handleStyleChange}
        />
        <RichTextBtnItalic range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnColor range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnImg range={selectedRange} />
        <RichTextBtnMail range={selectedRange} />
      </div>
      <div>
        <button
          onClick={() => {
            setEditorType(RICH_TEXT_EDITOR_TYPE.PREVIEW);
          }}
        >
          PREV
        </button>
        <button
          onClick={() => {
            setEditorType(RICH_TEXT_EDITOR_TYPE.HTML);
          }}
        >
          HTML
        </button>
      </div>
      <div style={{ position: "relative" }}>
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
        {editorType === RICH_TEXT_EDITOR_TYPE.HTML ? (
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0pc",
              width: "100%",
              height: "100%",
            }}
          >
            <textarea
              style={{ width: "100%", height: "100%", resize: "none" }}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setInnerValue(e.target.value);
              }}
            ></textarea>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RichTextEditor;
