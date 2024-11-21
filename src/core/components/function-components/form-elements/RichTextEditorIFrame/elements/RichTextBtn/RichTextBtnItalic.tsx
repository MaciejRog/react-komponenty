import { useEffect, useState } from "react";
import styles from "./RichTextBtn.module.css";
import { getNearestNotTextElement } from "../../RichTextEditor.utils";

const INIT_VALUE = "normal";

function RichTextBtnItalic({
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
        setValue(getComputedStyle(firstSelectedElement)["fontStyle"]);
      } else {
        setValue(INIT_VALUE);
      }
    } else {
      setValue(INIT_VALUE);
    }
  }, [range]);

  return (
    <button
      className={`${styles.RichTextBtn} ${value === "italic" ? "active" : ""}`}
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
