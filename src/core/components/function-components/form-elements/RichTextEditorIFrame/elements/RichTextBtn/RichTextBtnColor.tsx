import { useEffect, useRef, useState } from "react";
import styles from "./RichTextBtn.module.css";
import { getNearestNotTextElement } from "../../RichTextEditor.utils";

const INIT_VALUE = "#000";

function rgbToHex(color = ""): string {
  let hexColor = "#";
  try {
    color
      .slice(4, color.length)
      .split(",")
      .forEach((el) => {
        hexColor += parseInt(el, 10).toString(16).padStart(2, "0");
      });
  } catch (exc) {
    console.error("Cannot convert rgb to hex | exc = ", exc);
  }

  return hexColor;
}

function RichTextBtnColor({
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
        setValue(rgbToHex(getComputedStyle(firstSelectedElement)["color"]));
      } else {
        setValue(INIT_VALUE);
      }
    } else {
      setValue(INIT_VALUE);
    }
  }, [range]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    onClick("color", "color", () => {
      return value;
    })();
  };

  return (
    <div
      className={`${styles.RichTextBtn} ${styles.RichTextBtnColor}`}
      onClick={handleClick}
    >
      <div>color</div>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default RichTextBtnColor;
