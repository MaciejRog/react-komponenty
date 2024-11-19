import styles from "./RichTextBtn.module.css";

function RichTextBtnItalic({ onClick }: { onClick: Function }) {
  return (
    <button
      className={`${styles.RichTextBtn}`}
      onClick={() => {
        onClick("fontStyle", "fontStyle", (elStyle: any) => {
          if (elStyle === "normal") {
            return "italic";
          } else {
            return "normal";
          }
        })();
      }}
    >
      I
    </button>
  );
}

export default RichTextBtnItalic;
