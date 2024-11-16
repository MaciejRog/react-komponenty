import { useEffect, useRef } from "react";

const getNearestNotTextElement = (
  node: Node | undefined
): HTMLElement | null => {
  let elementToReturn: HTMLElement | null = null;
  const getNotTextElement = (nodeEl: Node | undefined | HTMLElement | null) => {
    if (nodeEl) {
      if (nodeEl.nodeName === "#text") {
        getNotTextElement(nodeEl.parentElement);
      } else {
        elementToReturn = nodeEl as HTMLElement;
      }
    }
  };
  getNotTextElement(node);
  return elementToReturn;
};

const INIT_SELECTION_REF: {
  selection: Selection | null;
  range: Range | undefined;
  ranges: Range[];
  nearestWrappingElement: HTMLElement | null;
} = {
  selection: null,
  range: undefined,
  ranges: [],
  nearestWrappingElement: null,
};

function RichTextEditor({ value = `` }) {
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const ref = useRef(INIT_SELECTION_REF);

  const handleSelectionChange = () => {
    const selection = document.getSelection();
    const range = selection?.getRangeAt(0).cloneRange();
    const commonAncestorContainer = range?.commonAncestorContainer;
    const nearestWrappingElement = getNearestNotTextElement(
      commonAncestorContainer
    );
    const ranges: Range[] = [];

    if (range && nearestWrappingElement) {
      let canAdd = false;
      const checkNode = (node: ChildNode) => {
        if (node.childNodes.length === 0) {
          if (node === range.startContainer) {
            canAdd = true;
          }
          if (canAdd) {
            const newRange = new Range();
            let canAddRange = true;
            newRange.selectNode(node);
            if (node === range.startContainer) {
              const textContentLength = node.textContent?.length;
              if (textContentLength) {
                if (textContentLength === range.startOffset) {
                  canAddRange = false;
                } else {
                  newRange.setStart(node, range.startOffset);
                  if (node !== range.endContainer) {
                    newRange.setEnd(node, textContentLength);
                  }
                }
              }
            }
            if (node === range.endContainer) {
              if (range.endOffset === 0) {
                canAddRange = false;
              } else {
                if (node !== range.startContainer) {
                  newRange.setStart(node, 0);
                }
                newRange.setEnd(node, range.endOffset);
              }
            }
            if (canAddRange) {
              ranges.push(newRange);
            }
          }
          if (node === range.endContainer) {
            canAdd = false;
          }
        } else {
          node.childNodes.forEach((childNode) => {
            checkNode(childNode);
          });
        }
      };

      nearestWrappingElement.childNodes.forEach((node) => {
        checkNode(node);
      });
    }

    ref.current = {
      selection: selection,
      range: range,
      ranges: ranges,
      nearestWrappingElement: nearestWrappingElement,
    };
  };

  const handleStyle =
    (elementStyleName: any, computedStyleName: any, calcValue: any) =>
    (): void => {
      const { range, ranges } = ref.current;
      if (range) {
        ranges.forEach((rangeEl) => {
          const clone = rangeEl.cloneContents();
          const nearestElement = getNearestNotTextElement(
            rangeEl.startContainer
          );
          if (nearestElement) {
            const style =
              getComputedStyle(nearestElement)[computedStyleName as number];
            const newValue = calcValue(style);
            // ##################
            // ## fontWeight
            // VVVVVVVVVVVVVVVVVV
            // 700 - bold
            // 400 - normal

            if (clone.textContent === nearestElement.innerHTML) {
              nearestElement.style[elementStyleName] = newValue;
            } else {
              const boldElement = document.createElement("span");
              boldElement.style[elementStyleName] = newValue;
              boldElement.appendChild(clone);
              rangeEl?.extractContents();
              rangeEl?.insertNode(boldElement);
            }
          }
        });
      }
    };

  return (
    <div>
      <div>
        <button
          onClick={() => {
            handleStyle("fontWeight", "fontWeight", (elStyle: any) => {
              console.warn("elStyle = ", elStyle);
              if (elStyle === "400") {
                return "700";
              } else {
                return "400";
              }
            })();
            // handleStyle("color", "color", (elStyle: any) => {
            //   console.warn("elStyle = ", elStyle);
            //   if (elStyle === "rgb(0, 0, 0)") {
            //     return "gold";
            //   } else {
            //     return "rgb(0, 0, 0)";
            //   }
            // })();
            // handleStyle(
            //   "textDecoration",
            //   "textDecorationLine",
            //   (elStyle: any) => {
            //     console.warn("elStyle = ", elStyle);
            //     if (elStyle === "none") {
            //       return "underline";
            //     } else {
            //       return "none";
            //     }
            //   }
            // )();
          }}
        >
          BOLD
        </button>
      </div>
      <div
        style={{
          minHeight: "26px",
          padding: "4px",
          border: "1px solid black",
          borderRadius: "4px",
        }}
        contentEditable="true"
        spellCheck="true"
        role="textbox"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div>
    </div>
  );
}

export default RichTextEditor;
