import {
  getInnerRanges,
  getNearestNotTextElement,
} from "../../RichTextEditor.utils";
import styles from "./RichTextBtn.module.css";

function RichTextBtnMail({ range }: { range: Range | undefined }) {
  const handleChange = () => {
    console.warn("range = ", range);
    if (range?.commonAncestorContainer) {
      const ancestorElement = getNearestNotTextElement(
        range.commonAncestorContainer
      );
      const ranges = getInnerRanges(range, ancestorElement);
      console.warn("RANGES = ", ranges);

      const anchor = document.createElement("a");
      anchor.href = "mailto:someone@example.com";

      ranges.forEach((r) => {
        console.log("RANGES r = ");
        const rText = r.extractContents().textContent;
        if (rText) {
          anchor.textContent += rText.trim() ? rText.trim() : " ";
        }
        // const rText = r.extractContents();
        // if (rText) {
        //   anchor.appendChild(rText);
        // }
      });

      console.warn("ANGCHOR = ", anchor.textContent);

      range.insertNode(anchor);
    }
  };

  return (
    <div className={`${styles.RichTextBtn}`} onClick={handleChange}>
      @
    </div>
  );
}

export default RichTextBtnMail;
