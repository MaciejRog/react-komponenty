import { useEffect, useRef, useState } from "react";
import { RICH_TEXT_EDITOR_TYPE } from "./RichTextEditor.utils";
import styles from "./RichTextEditor.module.css";
import RichTextHeader from "./elements/RichTextHeader/RichTextHeader";
import RichTextTypeSelector from "./elements/RichTextTypeSelector/RichTextTypeSelector";
import { createPortal } from "react-dom";

function RichTextEditor({
  value = ``,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [refresh, setRefresh] = useState(false);
  const [editorType, setEditorType] = useState(RICH_TEXT_EDITOR_TYPE.PREVIEW);
  const [iframeSelection, setIframeSelection] = useState<Selection | null>(
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
  }, [refresh]);

  const iframeWindowRef = useRef<Window | null>(null);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  const handleSelectionChange = () => {
    if (iframeWindowRef.current) {
      const selection = iframeWindowRef.current.getSelection();
      setIframeSelection(selection);
    }
  };

  const updateValue = () => {
    if (contentEditableRef.current && setValue) {
      if (contentEditableRef.current.firstChild?.nodeType === 3) {
        const tempText = contentEditableRef.current.firstChild.textContent;
        contentEditableRef.current.firstChild.remove();
        const div = document.createElement("div");
        div.textContent = tempText;
        contentEditableRef.current.prepend(div);
        iframeSelection?.setPosition(div, 1);
      }
      setValue(contentEditableRef.current.innerHTML);
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
        <RichTextHeader selection={iframeSelection} updateValue={updateValue} />
      </div>
      <div className={`${styles.RichTextEditorContentWrapper}`}>
        <div className={`${styles.RichTextEditorContent}`}>
          <iframe
            className={`${styles.RichTextEditorContentTypePreview}`}
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              iframeWindowRef.current = iframe.contentWindow;
              setRefresh((prev) => !prev);
            }}
            src="./RichTextEditor.html"
          ></iframe>
          {iframeWindowRef.current?.document?.body &&
            createPortal(
              <div
                ref={contentEditableRef}
                className={`RichTextEditorContentTypePreviewField`}
                data-rich-text-editor-component="true"
                contentEditable="true"
                spellCheck="true"
                role="textbox"
                dangerouslySetInnerHTML={{ __html: innerValue }}
                onInput={updateValue}
              ></div>,
              iframeWindowRef.current.document.body
            )}
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
