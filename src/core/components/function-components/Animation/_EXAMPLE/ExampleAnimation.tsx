import { useState } from "react";
import CSSAnimation from "../CSSAnimation/CSSAnimation";
import SizeAnimation from "../JSAnimation/SizeAnimation/SizeAnimation";

const animEnter = {
  animationName: "fadeIn",
  otherClasses: "",
  duration: 2000,
  isInfinite: false,
};

const animLoaded = {
  animationName: "", // "bounce",
  otherClasses: "transition-ease-in",
  duration: 1000,
  isInfinite: true,
};

const animExit = {
  animationName: "fadeOut",
  otherClasses: "CDE test",
  duration: 3000,
  isInfinite: false,
};

function ExampleAnimation() {
  const [show, setShow] = useState(true);
  return (
    <div
      style={{
        margin: "16px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <button
        style={{
          width: "100px",
        }}
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {show ? "UKRYJ" : "POKAŻ"}
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* <CSSAnimation show={show}>
          <p>BEZ ZADNEGO</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation show={show} onEnter={animEnter}>
          <p>onEnter</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation show={show} afterLoaded={animLoaded}>
          <p>afterLoaded</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation show={show} onExit={animExit}>
          <p>onExit</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation show={show} onEnter={animEnter} afterLoaded={animLoaded}>
          <p>onEnter | afterLoaded</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation show={show} afterLoaded={animLoaded} onExit={animExit}>
          <p> afterLoaded | onExit</p>
          <TestComponent />
        </CSSAnimation>
        <CSSAnimation
          show={show}
          onEnter={animEnter}
          afterLoaded={animLoaded}
          onExit={animExit}
        >
          <p>onEnter | afterLoaded | onExit</p>
          <TestComponent />
        </CSSAnimation> */}

        {/* <CSSAnimation show={show} onEnter={animEnter} onExit={animExit}>
          <p>onEnter | onExit</p>
          <TestComponent />
        </CSSAnimation> */}

        <CSSAnimation show={show} onEnter={animEnter} onExit={animExit}>
          <SizeAnimation
            show={show}
            enterDuration={2000}
            exitDuration={3000}
            animateWidth={false}
          >
            <p>onEnter | onExit</p>

            <TestComponent />
          </SizeAnimation>
        </CSSAnimation>
        <CSSAnimation show={show} onEnter={animEnter} onExit={animExit}>
          <SizeAnimation
            show={show}
            overflowVisible={false}
            enterDuration={2000}
            exitDuration={3000}
            animateWidth={false}
          >
            <p>onEnter | onExit</p>

            <TestComponent />
          </SizeAnimation>
        </CSSAnimation>

        <SizeAnimation show={show} enterDuration={2000} exitDuration={2000}>
          <TestComponent />
        </SizeAnimation>
        <SizeAnimation
          show={show}
          overflowVisible={false}
          enterDuration={2000}
          exitDuration={2000}
        >
          <TestComponent />
        </SizeAnimation>
      </div>
    </div>
  );
}

export default ExampleAnimation;

const TestComponent = () => {
  return <div style={{ padding: "12px", backgroundColor: "red" }}>DZIAŁA</div>;
};
