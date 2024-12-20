import { getNearestNotTextElement } from "../../RichTextEditor.utils";
import styles from "./RichTextBtn.module.css";

const getSelectionRangeWithFullLinesSelected = (
  selection: Selection
): Range => {
  const rangeToReturn = new Range();
  const selectionRange = selection.getRangeAt(0);
  const { startContainer, endContainer } = selectionRange;

  selection.setPosition(startContainer);
  selection.modify("move", "backward", "lineboundary");
  selection.modify("extend", "forward", "lineboundary");
  const selectionRangeStart = selection.getRangeAt(0);

  selection.setPosition(endContainer);
  selection.modify("move", "backward", "lineboundary");
  selection.modify("extend", "forward", "lineboundary");
  const selectionRangeEnd = selection.getRangeAt(0);

  selection.addRange(selectionRange);
  selection.addRange(selectionRangeStart);
  selection.addRange(selectionRangeEnd);

  rangeToReturn.setStart(
    selectionRangeStart.startContainer,
    selectionRangeStart.startOffset
  );
  rangeToReturn.setEnd(
    selectionRangeEnd.endContainer,
    selectionRangeEnd.endOffset
  );

  selection.removeAllRanges();
  selection.addRange(rangeToReturn);

  return rangeToReturn;
};

const getLinesRanges = (selection: Selection, range: Range): Range[] => {
  const innerNodes: Node[] = [];
  let canAdd = false;

  const extractNodes = (node: Node) => {
    if (node.childNodes.length === 0) {
      if (canAdd === false && node === range.startContainer) {
        canAdd = true;
      }
      if (canAdd) {
        if (node.textContent?.trim()) {
          innerNodes.push(node);
        }
      }
      if (canAdd === true && node === range.endContainer) {
        canAdd = false;
      }
    } else {
      node.childNodes.forEach((childNode) => {
        extractNodes(childNode);
      });
    }
  };
  extractNodes(range.commonAncestorContainer);

  const linesRanges: Range[] = [];
  innerNodes.forEach((innerNode) => {
    const innerRange = new Range();
    innerRange.selectNode(innerNode);
    selection.removeAllRanges();
    selection.addRange(innerRange);
    selection.modify("move", "backward", "lineboundary");
    selection.modify("extend", "forward", "lineboundary");
    const newSelectionRange = selection.getRangeAt(0);
    let canAdd = true;
    linesRanges.forEach((el) => {
      if (
        el.compareBoundaryPoints(Range.END_TO_END, newSelectionRange) === 0 &&
        el.compareBoundaryPoints(Range.START_TO_START, newSelectionRange) === 0
      ) {
        canAdd = false;
      }
    });
    if (canAdd) {
      linesRanges.push(newSelectionRange);
    }
  });

  return linesRanges;
};

const checkIfIsInList = (
  node: Node
): { list: HTMLElement | null; listItem: HTMLElement | null } => {
  let list: HTMLElement | null = null;
  let listItem: HTMLElement | null = null;

  const check = (element: HTMLElement | null) => {
    if (element && !element?.dataset?.richTextEditorComponent) {
      if (element?.tagName === "OL" || element?.tagName === "UL") {
        list = element;
      } else {
        if (element?.tagName === "LI") {
          listItem = element;
        }
        check(element.parentElement);
      }
    }
  };
  check(node.parentElement);

  return {
    list,
    listItem,
  };
};

type typeListElement = {
  range: Range;
  list: HTMLElement | null;
  listItem: HTMLElement | null;
  isFirstItem: false;
  isLastItem: false;
};

const getListElements = (linesRanges: Range[]) => {
  const listElements: typeListElement[] = [];
  const listElementsByList: typeListElement[][] = [];
  linesRanges.forEach((lineRange) => {
    let listElement: typeListElement = {
      range: lineRange,
      list: null,
      listItem: null,
      isFirstItem: false,
      isLastItem: false,
    };
    const inListObj = checkIfIsInList(lineRange.startContainer);
    if (inListObj.list && inListObj.listItem) {
      const listItems = Array.from(inListObj.list.children);
      let isFirstItem = false;
      let isLastItem = false;
      listItems.forEach((item, index) => {
        if (item === inListObj.listItem) {
          if (index === 0) {
            isFirstItem = true;
          }
          if (index === listItems.length - 1) {
            isLastItem = true;
          }
        }
      });
      listElement = {
        range: lineRange,
        list: inListObj.list,
        listItem: inListObj.listItem,
        isFirstItem: isFirstItem,
        isLastItem: isLastItem,
      };
    }
    listElements.push(listElement);
  });
  listElements.forEach((element) => {
    if (listElementsByList.length === 0) {
      listElementsByList.push([]);
      listElementsByList[0].push(element);
    } else {
      let listIndex = -1;
      listElementsByList.forEach((listEl, index) => {
        if (listEl?.[0]?.list === element.list) {
          listIndex = index;
        }
      });
      if (listIndex > -1) {
        let listItemIndex = -1;
        listElementsByList[listIndex].forEach((el, index) => {
          if (el.listItem !== null && el.listItem === element.listItem) {
            listItemIndex = index;
          }
        });
        if (listItemIndex === -1) {
          listElementsByList[listIndex].push(element);
        }
      } else {
        listElementsByList.push([]);
        listElementsByList[listElementsByList.length - 1].push(element);
      }
    }
  });
  return listElementsByList;
};

function RichTextBtnList({
  listType,
  selection,
  handleUpdate,
}: {
  listType: "UL" | "OL";
  selection: Selection | null;
  handleUpdate: Function;
}) {
  const handleClick = () => {
    if (selection) {
      const range = getSelectionRangeWithFullLinesSelected(selection);

      const linesRanges = getLinesRanges(selection, range);
      const listElements = getListElements(linesRanges);

      listElements.reverse().forEach((listEl) => {
        if (listEl[0].list) {
          let toAddAfterList = ``;
          let appendOnTheEnd = true;
          listEl.forEach((element) => {
            if (element.isFirstItem) {
              appendOnTheEnd = false;
            }
            if (element.listItem) {
              toAddAfterList += "<div>" + element.listItem.innerHTML + "</div>";
              element.listItem.remove();
            }
          });
          if (listEl[0].list.children.length === 0) {
            listEl[0].list.outerHTML = toAddAfterList;
          } else {
            if (appendOnTheEnd) {
              listEl[0].list.outerHTML += toAddAfterList;
            } else {
              listEl[0].list.outerHTML =
                toAddAfterList + listEl[0].list.outerHTML;
            }
          }
        } else {
          let list = null;
          switch (listType) {
            case "OL":
              list = document.createElement("ol");
              break;
            case "UL":
              list = document.createElement("ul");
              break;
          }

          if (range.endContainer) {
            const element = getNearestNotTextElement(range.endContainer);
            if (element) {
              element.after(list);
            }
          }
          listEl.forEach((element) => {
            const cloneContent = element.range.cloneContents();
            const listItem = document.createElement("li");
            element.range.extractContents();
            listItem.appendChild(cloneContent);
            list.appendChild(listItem);
          });
        }
      });

      selection.removeAllRanges();
      handleUpdate();
    }
  };

  return (
    <button className={`${styles.RichTextBtn}`} onClick={handleClick}>
      {listType === "OL" ? "OL" : null}
      {listType === "UL" ? "UL" : null}
    </button>
  );
}

export default RichTextBtnList;
