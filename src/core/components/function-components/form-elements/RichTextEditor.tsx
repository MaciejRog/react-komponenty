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

function RichTextEditor({
  value = `
   <p style="font-size: 20px; color: red">
      AAAAAA<span style="color: green">BBBBBBBBB</span
      ><span style="color: blue"
        >CCCCC<span style="color: aqua">CCCCC</span>CCCCC</span
      >
    </p>
    <ul>
      <li>ABC</li>
    </ul>
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAADYCAMAAADS+I/aAAAAaVBMVEX///8IfqQAe6IAc50AeKAAdp8Acp0Ad58AdJ30+fvu9fj5/P3g7PHI3eZXnLgpiKuyz9yixdXT5OtKlrR3rMOOucxvqMB/scfE2uTn8fTa6O42ja5lo72qyti71eBUmreWvtA9kbAMg6f7VWVeAAAUm0lEQVR4nO1di5KyuBIeAlEQFBHxioi8/0Ou4CXdSTokCP6zVfNVnbO7DgSaJJ2+98/PH/7whz/84Q//C0TLS7EtV6tyW2SH4xgjHg/Za8TLMhpjxDGw3Dc+5wHrEHAe+nmx/GjAIvdDOKLf7D8acBwsCsYDT0bA/dVl0FxE65WvHZAVi7Hf3QmLna++1gOMz1aV63jVyp8zYsDA3/1DYmufeq8HtaHTVLQLxDyeX0xHixFJOje92GsqEsvR6AUiME8tRxsXa/OUiqlYWbxesrIdbT09ZTJq3+bVuteblT3LeFHOrAht8f1FvLemtCN2bxzLntCWVuNY46NwofSOICAX3jro36OY1q/O63omk8J9zpqG3f9BcFF+1m7Z5Kb/aIyLEeVPMfvifk3w6zG/KV7i4GJz2TahjlztUVHouBHjYbO7bJ4b/HgoGumq2ff4cAOffGexG+nvx0vuByoNylGhO65YEOYXWYzeYAbNmimpg9jDFcVTmdAOiywNFWLZrIbXaCQQ5qeZll1vUg4uC77Emk5woxr44Walctbw9paMozxUP8WKFusRz5+dxqWJwA0Q4F9MVx53yryx4PD420FZ4axHsroAWtltPHpoHMATZ0ZK7ziWMq9+rgP1XJ6VfYruBYzlH8ahxoizmI25xZY5KacJv8XxjUs/+jeLJbkXXIydP6ekD0vw5naPqzzpYGyPS/xL4Nnpe2fwbaZX1lfiLX1b08q+R9mzlvWO4juz1VAKbLEQDwvsBbRTKi9YAJ7as9NCLBB/akU9E88KYof7CoU9vTBzEWlj8PjM9d0dIZiSw6S22Mg79jmKp5VASIhpnZoxgc3iu5rJSkVkuIsUpcvS+EEbyJpVDMPlvedY+cHN723ady6rKNkHNw980IAzfC3RygdoY9UnH9sFYr9x95s36qy6bdQOYpDA/WZ7CEV1wLG21DDhmbsgIA52f0q1df2WzNxZvY7SIUKPOO7mU1ojhKbqu2pRS8IaNXPd86f3QJNqrfngrUpROmANC76UO97pgvc2cdUXN4hShkRi35E3AdXK7UYXROKDbp1uxJQGeY4kJ0dat+LAm87xKhiwG1dKOKb0vhMQrdyJlQq+NCELXr5fmbv4ExeYru6YWmHqXbQUIUTw6XRWIe24nP2RB7fm/CnjlNAuyjyHpSgkkQlPG7F0QodpSCGl/C3NlXBeWWo/3nHgNnKC0KAc1Bq0LedAbkXzGtgfHJEgdTrvjeB9vvU9aPI4EifRfuX2wruQTqeTIXZCL7e9pUBG+Sv+4xW5CaynSBx5O/t3d0TpfHiv4YEaKHLHDdJq7RAXO3w6NU6Qaukf2kARX2chOUOWNbNk680vJHWBDs9GY1uJG3iF5fH6G0lN4ZwyLR0LKA9bHjm/kNQV3IkhIcQhoTGwevfvkmrDlmpIBK2qIZWd1xYDsy+QKg4bC3UVkWByTkJnopVV4huHzd5BhEAyflD/xHF0TE6bzWa5XB4O9/+7/+spOUZx/FOjS/tZ0zfMEEAw7LVUo2PES1nA/Ts45yHv0P6j+yVgkHtZGO2/IhjaivuLTVU6BiOBaS2rjXn0t5dgQnFfmOcppTg51LtzQAYvWaENWQrOu/pAPEPY0Sa07x8MSnG8uWzP3Xr8gEpAb7fiz9vLRtkqwEAwXZQApRQnl23azuQoRGKC7zOcbi/IEiuM0UOcA5Y4il1Sv8mvV3cWMz6ViF4/uNZvsgTDDqfzxcWSxfCUXdtsgumoBPQGnF+zbnaBxdDRY+kCIadcf6qdF36HTEFu6O0qGI0xHaUwOusjJvsBuVyIm5PGae0GktflywQBn3fCQ/j4H7//5/3H9m8DR51OLvzBIpwFgnkrEQVpvtrtizq7rKuqlQk7HKpqfcnqYr9b5Wlwvyycu45e/x5S51m1TCzNqItkWWWGkJ+vkhplTd+rSH4nZ2Hmgr1YfbTyJpvCa3Pqy4MJeBjkJbQpDIgXW8H7yzwINUlj6KHhbuxw2WVuip1rz/i8qO4H+hX+OuDUi+FTrnehpSryu0htevYsH9NzU53ViG1Aple+JDcYruPsDu9wAAr9S5o/XUrPQC7zU+fkO4rQlHoMC3xWXoQCEgFKAzcP7BtbsGJDsROTS8l0+QDPzz0KscsztXS5f66xvA132mBJBpKAd/upvvlEGh7zz58u4+RK7tF0LR8jFeCfrl5/AWgm9+XJitap+iZPYvOPHMvGQF7lanDt0OXbAi5h9SH0+/SkoxlRMROnV6IZ98ZXdAAYRjGUJaYMtYAN27LRSjMqIF4OEIQ5KZ9Fm8PAHznLBIQp6piUvxogU1SakZh/FZY0Wdi+ga/7oSka2uAk7QX4PbOrRqhhTlEajyHVKQ34NoHRjNiZAaNCneK/NQCx3PLiAX+4r+ZtqBLru+k7SaMMwYO6Wxu5MHujzQrzjD6OxoBuWSR0gXjOzi0d1YEilweNgx2mUmSG4K1FCOUGmSYBTxojHk58UMyZhDj2fqFMyX9lyhlFQsmtDoDXSFgNoXPoCI/UEYxb1HggQlYc3LWiE/i1OqQO8jZlsy1ka9rQ4yuYhVG8CyDLhIEICvFw6CCLtnKiod2GXUmylyyFiA8r7N4oLvQzGl8AAwqHpbB2SzJjkkvzM7fQIHH03/0glXkM2C7v+QNRWPb7xAwgZQpn+l7PKFqspcOxPxDqiin11eQQsI1exw04aMaL0QWc6X3giMgJlSHEJZ7YoGded2j16s9j8Lzn0ga39KeBR6dDVR1OvVJNom6KRP3KENLBMTfuVxRQ5fGz1gQmVtGT4YNIgD4xv9o1nZOV+36z61nqQOx/ngDioNPzvsUZv7+BQVZoCfjEawPe0Ll9kWxjkpMW+wB+d8b53mROjBT566zhiBhbTAH5MY/om/ikn1ZK6wTnwrw2vPpeFVkDYzpnLXZTN4swpZO6B9scSf8VDg2jTUNQ5MYf33DQLPUaYcAMShC4ro1dp1UNgENfAFwLFHxjsiJUaAUDkdCgVdR0UmdN3gQ1tj1avwYTHcoT0AcHHVFMjcleInyP9xW80J1/CjSKkhiDniJ4XkfgBeeGt8O0aqVUaAPrUa1LsILBpNJ3bTX5nAIhybaBFBbswfo168NQdtPZ3eG36PNAiBXsge9O+wD7ajOFNXUn8HKCmJ8+9ftitudBtalXVtb6bshFvyH36QtkeOxG+5F6Y+F2JpXyZLXl3kPp6ulcqasb9WIF1L1X3ZP61Ra4yWWnztbwNxVLzbSStxUWrkRSsDlpptUivQbOnMwJ7GW7DhoTGyVdR0aW9EJIycQrzaMsXhBKlfgvgNFY5ZXsFXmAnFQ79zPpFlan1SqIUgQiyoewWL920ZiJzGnonWpDaAvqfmW32tXQEpMhrWBVMevBWbZwuPFQFdYDWNaDoBQ+EYxpW1hCKnxAa+SF1fo1maRy/FVtYyjFZKAw16Umos6MGH/rkGSKN81poQX5saSEZtsQNBCfB19OzBH9zhLQ0WpYC9YxMXRCFtos1sFKYvrQOhCrzDqFESsQpKS2sNyqpko7la3KhZ+sX6lD8vpQriZ5lU4EIEilJRdwlUP2p/B5QBbslGrxBFQmaU5xso664jSpF9rVaYA+cWMIqbDyUk1eNQqpQApxCNfXkwpKW1iPhF6TvMro5UYwHOjoc1m/oD5HZUDg9AE+f06u4KhXgXthRgqkF2icto7XB3naNfgZ5MvbjiSJ4eR11gGwtBCPL7MN5wM5FXB/bzR+GDOkQyQkTxudwqmllBSiK6wazSyPQ3GAomyGiBAYaUj6Cn0G2MbV0qwtZZYXYgCxHm0NMZzlES1bFsjCmLZ8iTxWD/IAdpMhRBxpGva21jhloNdtpGiYWq1gelnIOpTlZJSUWgpEaistTjUukdOqFn/TgdRXlEm1K5UDFpNsswVGSBsWp74+Pa12s0rdrUzqnQdavCA4IOShYYXLfr93pZmp8JNpdZhUq1o5wKeonCkLcNSzXuuSxrZlmFbNxHx0b/+6i8Bd6uEEou57nfzACAi9H9THPvYyYTL+B3p8of+m5wWB4ULDZuH78B5Tmsg1ZDfwKiQTrXqkwxm5IiH7FvaMvuJDe7BldF8RhuHSbuQOQgLi69pGwcqMtM7Ip0FFsRb/QUtWj6eBWdNataGf3xwmCGSr+1KyigI20UpTiiKDpcfSwHVjtJYodImpIDlYvznyQM/plz5Q8eLMUIA8EypN6xPOrVbwBRVpIC5E1TkMYXogHq0dCdAQ0ta8hVKp/DHCjdYaYyDnt4cjKGNL82Dk4CRjl2KUmkUFuECneadjZtiNT2LtyQGpjHumjQJDD9r1AnRf0kKKQlyYR356bPPiN/2OEIrg81QC98yMmv36DFJlWOCfzQ0K4ErsfhErmFCrI7x0TD5FtF09xrSCNUiAfrwqjLvrOd2TrGwelS+aMusRtoGc8uTtYAVrl9xGSj80nkmSK19bUhyM9RREoOO232QeH5Pk2G+iBxrI68SG9gDNHVI/ob6gYKmhg6ZQ/En172je6nPovp8QE9W1eZI6xvQX85doVfN0QKBf/foNRnmOVGwEMDshqOqe/XpvKfrZpm2BXCFfbuogCueKLwvdrePUPIUxbsKhKvimJKcrzSnsqvkrkg1q1RFr9wuQKsep9wS0DyjbgUUNdrvacsQggSEc5GxV2NZOOLig0RxOwvDMPwFo0IFhEsAN8eZ/SalYf+xDzRMlzZv55ZNYocMj6QxurRE4U0psflBMvHgTqrys55DzGK8UKe7VTQswQaTzgr4txlBZK4DwWNxSSxw3j9i3k6bpE7+6JW9l6hDMv1XQlYcnD5ZC+zTTBurOUv04EX3n35nRTdOoy3abCmgbm3FPiEpybVMXM0YPDEYEUZ6NbT2NAjGsl6e2mSHYQ9LWh6UoPytvBe1uXLIMAQOeTisc2gQxOZtsfYpDH9bq+ORwhdxcEUiMAQf8NjwH29RaUvUnwIBZs0nECODQ0jBzOjYzYJ9lWGqbLj6gdKVGecmDHwu1K6Xz3XJPvc0I3YUXalu711fkvMTdF6ElbugSpmtLHNclp+qcsHF6RmsO6fcT+KzZV+Ih8E8DlzDyx75/XVT7dEYW/BACzscwtmxmbU269eNRMHBsGBdGseiPHZKs23p6tIfAvvW0FRZ7buLGbO6za1uvBkRQDxIkoPDAtm3v1Svz56YyWz0pWEMQZ3LDV5ncgIfQ2G/bHBDhDAe8sbCnnh7zm2ySqndLVTI2wqblI8YeJ1r2PYAbeph+irVbwTC+K7qSYb0fPu7KhRU7t085pEuXNWyDe19gwX1VtwZCL81X5W5fFHWdPVHXRbHflas89R7ldAPXqogT1sxFIr0jGHsW+EN4/Dp4zCm7pwlltUnJQk9TggV++hYNJ211KDSo1U+SXfsY5Nhkcp5nCTCF22ShDIQQ2h7OmXhZnP2vkNtWCz4Xy46/CVcOmZzzOY6a0tLRobhNW062JfNWHN5kZe6xn+4ApZCxXr7Jds0EtZC70s/NLsMmyOobpZCNXZ/aCtc3f6zt+6xvnW3UNQryD8Yq6qeiv2z5XWrNtjnzeypZGhH4Psu32YFanSLQbMKy5bVt4kacFHLSHznX8h/CIjFzm68Uo3dpMYCiDViZn5v7ouxq6Pp+2ElQPp/fF3tzRoVKe+uRQFfKb+k9BXuXP30ecRxF0eLYYXH/1/jxwWBsJrMIgf11vadQ9xZT0NceXWihZf++3lOVXesTVJ+DjksDAPvC/t0d4di6B2VeU9VDUGioXVexb5C6ciMVF2/Sh5ugoBq5uRqB5gukOncUg6zJ45qDElXIsWFJ3ai/kVTUUkzTaAs12VL8MxS+u1dt07VwOoPcPi1CXglrb7tQ4n5J76kHUNAXSxGtMUrWsHd9fKX31IAswRrTCv+EKa2th/xy7yl7pRiZAaGNBIXlc/sJEuH0X+k95WK5R0eOoPXsJvkKfKXV7MD+QKiIwJPWGOfKu/Qw+UoD4aFKMdqUHW+KpZ9cRgNWiOmM+6DZd+1yX+RBsCaKGqylOvldgNY8XbPvWBuJZgEsKrAUz6m+hycJceQZ4uc/xsAld2cltIWNMUe7X+osyAwBSLBx/KAkrc6Ugl5fA1qrWINIarYBQSsLXG257snigyCso+4dgrS0Os8pKiY+nW0U+e/dY+s0tA6gFIZeT2fc/0EpCu7+koUSXtW4hzFE2tDrCSAY/RBJ5SIZwg21X0iALLUpe6fJ6XCOUMtxkhlaNMT6nVAsbAFytSyLqL1xTDXOjSB13G8gXZ6uhDIORKiuVSK/AJVx7thhDcQjj1YgnYBYwYayVyq0HWOew1wdZgfEyE68flHuiQNbWBvbnzkE5QCfx5QdSZWHkfVfJRzlVgfyAevnljsW1KR13D9DoCmH3wMlpJjnubRxmV2yE4xMdeWKQwByLW3MJGulXHl7wmzlrWsVog1LeEwp6r8AY7l53yo6pDLjZQ8j6FqJzeRpX1WrLcyTG7uVoxbQ82umtVLb6b0PUvWYZf7ZKL9DSicNRBNA3ol5Th0VcdaofHcGPs1WKaDAOB3zGuWoQtrYMcAEUEdYphdklztNrDRjaI0eNF0HON9pbWO4h8tYSbL9wCVTeXPBMxsdtp4uTFrpGCP3ZXlOrbc94AHjC25yO2k/aIxImg3u5/UhWUTRIlle9md9c+yAadiObmIf6QD7y/Ix4qG+ygMGE0u/EEp5+S6iqm3dQjWuZzOCgSlto57XszaQuB1RjfmyFV3GQV+tHRn8TB4OJ2M6mgZW8RIjYu1Cq7moR1sGxIXSqcV8BZU5PwMg6De51YbcO5nSL89pi5OctK8HD2oLFSTWNCzUfjbvK1KS8nq6o0Im1LPOg8kslrGmwdmXcPCI1sXPKfBzp9VW5eaA07n3DxbvGxkjlG4WhE3hrGcdi4bMfuDsayISgSpXMhDbQzYtBh5+pyKdKUcp47P864xXg8W69GZtRlCL+6HPbzDPcwCian975Bg9Rpx5O6Xb9r9DtKmy+o6sWo7kXTguXyNqYtr/8Ic//OEPf/id+A+7y/mEaT0QmwAAAABJRU5ErkJggg==" />
    <p>PRAGRAF 1</p>
    <p>PRAGRAF 2</p>
    <p>PRAGRAF 3</p>
  `,
}) {
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

  const handleBold = () => {
    const { range, ranges } = ref.current;
    if (range) {
      ranges.forEach((rangeEl) => {
        const clone = rangeEl.cloneContents();
        const nearestElement = getNearestNotTextElement(rangeEl.startContainer);
        if (nearestElement) {
          let newValue = "normal";
          const style = getComputedStyle(nearestElement)["fontWeight"];
          if (style === "400") {
            // 700 - bold
            // 400 - normal
            newValue = "bold";
          }

          if (clone.textContent === nearestElement.innerHTML) {
            nearestElement.style["fontWeight"] = newValue;
          } else {
            const boldElement = document.createElement("span");
            boldElement.style["fontWeight"] = newValue;
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
        <button onClick={handleBold}>BOLD</button>
      </div>
      <div
        contentEditable="true"
        spellCheck="true"
        role="textbox"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div>
    </div>
  );
}

export default RichTextEditor;
