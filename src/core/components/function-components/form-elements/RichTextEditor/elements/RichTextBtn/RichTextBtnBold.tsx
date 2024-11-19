import { useEffect, useState } from "react";
import styles from "./RichTextBtn.module.css";
import { getNearestNotTextElement } from "../../RichTextEditor.utils";

const INIT_VALUE = "400";

function RichTextBtnBold({
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
        setValue(getComputedStyle(firstSelectedElement)["fontWeight"]);
      } else {
        setValue(INIT_VALUE);
      }
    } else {
      setValue(INIT_VALUE);
    }
  }, [range]);

  return (
    <button
      className={`${styles.RichTextBtn} ${value === "700" ? "active" : ""}`}
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
