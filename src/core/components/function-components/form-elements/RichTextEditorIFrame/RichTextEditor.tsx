import { useEffect, useRef, useState } from "react";
import { RICH_TEXT_EDITOR_TYPE } from "./RichTextEditor.utils";
import styles from "./RichTextEditor.module.css";
import { renderToString } from "react-dom/server";
import RichTextHeader from "./elements/RichTextHeader/RichTextHeader";
import RichTextTypeSelector from "./elements/RichTextTypeSelector/RichTextTypeSelector";

const STYLES = {
  width: "100%",
  height: "100%",
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
  const htmlEditor = useRef<HTMLElement | null>(null);

  const handleSelectionChange = () => {
    if (iframeWindowRef.current) {
      const selection = iframeWindowRef.current.getSelection();
      setSelecteSelection(selection);
    }
  };

  const updateValue = () => {
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
    <div className={`${styles.RichTextEditor}`}>
      <div
        style={{
          visibility:
            editorType === RICH_TEXT_EDITOR_TYPE.HTML ? "hidden" : "visible",
        }}
      >
        <RichTextHeader
          selection={selecteSelection}
          updateValue={updateValue}
        />
      </div>
      <div className={`${styles.RichTextEditorContentWrapper}`}>
        <div className={`${styles.RichTextEditorContent}`}>
          <iframe
            className={`${styles.RichTextEditorContentTypePreview}`}
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              iframeWindowRef.current = iframe.contentWindow;
              const element = iframe.contentWindow?.document?.querySelector(
                'div[data-rich-text-editor-component="true"]'
              );
              if (element) {
                htmlEditor.current = element as HTMLElement;
                element.addEventListener("input", updateValue);
              }
              setHandleRefs((prev) => !prev);
            }}
            srcDoc={renderToString(
              <div
                // className={`RichTextEditorContentTypePreviewField`}
                style={STYLES}
                data-rich-text-editor-component="true"
                contentEditable="true"
                spellCheck="true"
                role="textbox"
                dangerouslySetInnerHTML={{ __html: innerValue }}
              ></div>
            )}
          ></iframe>
          {editorType === RICH_TEXT_EDITOR_TYPE.HTML ? (
            <div className={`${styles.RichTextEditorContentTypeHTML}`}>
              <textarea
                className={`${styles.RichTextEditorContentTypeHTMLField}`}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setInnerValue(e.target.value);
                }}
              ></textarea>
            </div>
          ) : null}
        </div>
        <RichTextTypeSelector
          editorType={editorType}
          setEditorType={setEditorType}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
