import { RICH_TEXT_EDITOR_TYPE } from "../../RichTextEditor.utils";
import styles from "./RichTextTypeSelector.module.css";

function RichTextTypeSelector({
  editorType,
  setEditorType,
}: {
  editorType: string;
  setEditorType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={`${styles.RichTextTypeSelector}`}>
      <button
        className={`${styles.RichTextTypeSelectorBtn} ${
          editorType === RICH_TEXT_EDITOR_TYPE.PREVIEW ? "active" : ""
        }`}
        onClick={() => {
          setEditorType(RICH_TEXT_EDITOR_TYPE.PREVIEW);
        }}
      >
        PREV
      </button>
      <button
        className={`${styles.RichTextTypeSelectorBtn} ${
          editorType === RICH_TEXT_EDITOR_TYPE.HTML ? "active" : ""
        }`}
        onClick={() => {
          setEditorType(RICH_TEXT_EDITOR_TYPE.HTML);
        }}
      >
        HTML
      </button>
    </div>
  );
}

export default RichTextTypeSelector;
