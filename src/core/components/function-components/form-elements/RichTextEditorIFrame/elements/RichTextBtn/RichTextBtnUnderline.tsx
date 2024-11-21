import { useEffect, useState } from "react";
import styles from "./RichTextBtn.module.css";
import { getNearestNotTextElement } from "../../RichTextEditor.utils";

const INIT_VALUE = "none";

function RichTextBtnUnderline({
  range,
  onClick,
}: {
  range: Range | undefined;
  onClick: Function;
}) {
  const [value, setValue] = useState(INIT_VALUE);

  useEffect(() => {
    if (range) {
      const firstSelectedElement = getNearestNotTextElement(
        range.startContainer
      );
      if (firstSelectedElement) {
        setValue(getComputedStyle(firstSelectedElement)["textDecorationLine"]);
      } else {
        setValue(INIT_VALUE);
      }
    } else {
      setValue(INIT_VALUE);
    }
  }, [range]);

  return (
    <button
      className={`${styles.RichTextBtn} ${
        value === "underline" ? "active" : ""
      }`}
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
