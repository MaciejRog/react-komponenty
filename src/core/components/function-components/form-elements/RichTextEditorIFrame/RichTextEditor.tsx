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
import RichTextBtnList from "./elements/RichTextBtn/RichTextBtnList";
import RichTextBtnFontSize from "./elements/RichTextBtn/RichTextBtnFontSize";
import { renderToString } from "react-dom/server";

const INIT_SELECTION_REF: {
  selection: Selection | null;
  range: Range | undefined;
  nearestWrappingElement: HTMLElement | null;
} = {
  selection: null,
  range: undefined,
  nearestWrappingElement: null,
};

function RichTextEditor({
  value = ``,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [handleRefs, setHandleRefs] = useState(false);
  const [editorType, setEditorType] = useState(RICH_TEXT_EDITOR_TYPE.PREVIEW);
  const [selecteSelection, setSelecteSelection] = useState<Selection | null>(
    null
  );
  const [selectedRange, setSelectedRange] = useState<Range | undefined>(
    undefined
  );
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    const iframeDocument = iframeWindowRef.current?.document;
    if (iframeDocument) {
      iframeDocument.addEventListener("selectionchange", handleSelectionChange);
    }

    return () => {
      if (iframeDocument) {
        iframeDocument.removeEventListener(
          "selectionchange",
          handleSelectionChange
        );
      }
    };
  }, [handleRefs]);

  const iframeWindowRef = useRef<Window | null>(null);
  const richEditorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef(INIT_SELECTION_REF);
  const htmlEditor = useRef<HTMLElement | null>(null);

  const handleSelectionChange = () => {
    console.warn("HANDLE_SELECTION_CHANGE");
    if (iframeWindowRef.current) {
      const selection = iframeWindowRef.current.getSelection();
      if (
        selection?.rangeCount &&
        selection?.rangeCount > 0 &&
        selection?.getRangeAt?.(0)
      ) {
        const range = selection.getRangeAt(0).cloneRange();
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
        setSelecteSelection(selection);
      }
    }
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
      if (htmlEditor.current.firstChild?.nodeType === 3) {
        const tempText = htmlEditor.current.firstChild.textContent;
        htmlEditor.current.firstChild.remove();
        const div = document.createElement("div");
        div.textContent = tempText;
        htmlEditor.current.prepend(div);
        window.getSelection()?.setPosition(div, 1);
      }
      setValue(htmlEditor.current.innerHTML);
    }
  };

  return (
    <div ref={richEditorRef} className={`${styles.RichTextEditor}`}>
      <div className={`${styles.RichTextEditorBtnsWrapper}`}>
        <RichTextBtnBold range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnUnderline
          range={selectedRange}
          onClick={handleStyleChange}
        />
        <RichTextBtnItalic range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnColor range={selectedRange} onClick={handleStyleChange} />
        <RichTextBtnFontSize
          selection={selecteSelection}
          handleUpdate={handleValueChange}
        />
        <RichTextBtnImg
          range={selectedRange}
          handleUpdate={handleValueChange}
        />
        <RichTextBtnMail
          range={selectedRange}
          handleUpdate={handleValueChange}
        />
        <RichTextBtnList
          listType="OL"
          selection={selecteSelection}
          handleUpdate={handleValueChange}
        />
        <RichTextBtnList
          listType="UL"
          selection={selecteSelection}
          handleUpdate={handleValueChange}
        />
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
        <iframe
          style={{
            width: "100%",
            minHeight: "600px",
          }}
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            iframeWindowRef.current = iframe.contentWindow;
            const element = iframe.contentWindow?.document?.querySelector(
              'div[data-rich-text-editor-component="true"]'
            );
            if (element) {
              htmlEditor.current = element as HTMLElement;
            }
            setHandleRefs((prev) => !prev);
          }}
          srcDoc={renderToString(
            <div
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
            ></div>
          )}
        ></iframe>
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
