import styles from "./RichTextBtn.module.css";

function RichTextBtnUnderline({ onClick }: { onClick: Function }) {
  return (
    <button
      className={`${styles.RichTextBtn}`}
      onClick={() => {
        onClick("textDecoration", "textDecorationLine", (elStyle: any) => {
          if (elStyle === "none") {
            return "underline";
          } else {
            return "none";
          }
        })();
      }}
    >
      U
    </button>
  );
}

export default RichTextBtnUnderline;
