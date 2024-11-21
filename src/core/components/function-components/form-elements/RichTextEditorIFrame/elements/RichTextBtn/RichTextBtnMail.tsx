import { useEffect, useRef, useState } from "react";
import {
  getInnerRanges,
  getNearestNotTextElement,
  isInRichTextEditor,
} from "../../RichTextEditor.utils";
import styles from "./RichTextBtn.module.css";

const searchForAnchor = (
  element: HTMLElement | null
): HTMLAnchorElement | null => {
  let elementToReturn: HTMLAnchorElement | null = null;

  const search = (el: HTMLElement | null) => {
    if (el) {
      if (el.tagName === "A") {
        elementToReturn = el as HTMLAnchorElement;
      } else {
        if (
          el.parentElement &&
          el.parentElement.dataset &&
          !el.parentElement.dataset.richTextEditorComponent
        ) {
          search(el.parentElement);
        }
      }
    }
  };
  search(element);

  return elementToReturn;
};

function RichTextBtnMail({
  range,
  handleUpdate,
}: {
  range: Range | undefined;
  handleUpdate: Function;
}) {
  const [active, setActive] = useState(false);
  const [anchorMail, setAnchorMail] = useState("");
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const ancestorNode = range?.commonAncestorContainer;
    if (ancestorNode) {
      const ancestorElement = getNearestNotTextElement(ancestorNode);
      if (isInRichTextEditor(ancestorElement)) {
        anchorRef.current = searchForAnchor(ancestorElement);
        if (anchorRef.current) {
          setActive(true);
          const aHref = (anchorRef.current as HTMLAnchorElement).href.replace(
            "mailto:",
            ""
          );
          setAnchorMail(aHref ?? "");
        } else {
          setActive(false);
          setAnchorMail("");
        }
      }
    }
  }, [range]);

  const hanldeMail = () => {
    if (range?.commonAncestorContainer) {
      const ancestorElement = getNearestNotTextElement(
        range?.commonAncestorContainer
      );
      const isInAnchor = searchForAnchor(ancestorElement);
      if (isInAnchor) {
        const newRange = new Range();
        newRange.selectNode(isInAnchor);
        newRange.extractContents();
        const arrayToAdd: ChildNode[] = [];
        isInAnchor.childNodes.forEach((childNode) => {
          arrayToAdd.unshift(childNode);
        });
        arrayToAdd.forEach((el) => {
          newRange.insertNode(el);
        });
      } else {
        const ranges = getInnerRanges(range, ancestorElement);
        const anchor = document.createElement("a");
        ranges.forEach((r) => {
          const rText = r.extractContents().textContent;
          if (rText) {
            anchor.textContent += rText.replace(/\n/g, "");
          }
        });
        anchorRef.current = anchor;
        range.insertNode(anchor);
      }
      handleUpdate();
    }
    setActive(true);
  };

  const handleChangeMailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnchorMail(e.target.value);
    if (anchorRef.current) {
      anchorRef.current.href = `mailto:${e.target.value}`;
      handleUpdate();
    }
  };

  return (
    <div
      className={`${styles.RichTextBtnMail}`}
      style={{ position: "relative" }}
    >
      <div className={`${styles.RichTextBtn}`} onClick={hanldeMail}>
        @
      </div>
      <div
        className={`${styles.RichTextBtnDialog}`}
        style={{
          transform: `scaleY(${active ? "1" : "0"})`,
        }}
      >
        <input
          type="text"
          value={anchorMail}
          onChange={handleChangeMailValue}
        />
        <div className={`${styles.RichTextBtnDialogBtnCloseWrapper}`}>
          <div
            className={`${styles.RichTextBtnDialogBtnClose}`}
            onClick={() => {
              setActive(false);
            }}
          >
            x
          </div>
        </div>
      </div>
    </div>
  );
}

export default RichTextBtnMail;
