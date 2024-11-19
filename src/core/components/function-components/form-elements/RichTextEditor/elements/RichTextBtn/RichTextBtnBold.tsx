import styles from "./RichTextBtn.module.css";

function RichTextBtnBold({ onClick }: { onClick: Function }) {
  return (
    <button
      className={`${styles.RichTextBtn}`}
      onClick={() => {
        // ##################
        // ## fontWeight
        // VVVVVVVVVVVVVVVVVV
        // 700 - bold
        // 400 - normal
        onClick("fontWeight", "fontWeight", (elStyle: any) => {
          if (elStyle === "400") {
            return "700";
          } else {
            return "400";
          }
        })();
      }}
    >
      B
    </button>
  );
}

export default RichTextBtnBold;
