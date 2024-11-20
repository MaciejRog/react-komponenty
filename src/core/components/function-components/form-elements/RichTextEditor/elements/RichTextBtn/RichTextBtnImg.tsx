import { useState } from "react";
import styles from "./RichTextBtn.module.css";

function RichTextBtnImg({
  range,
  handleUpdate,
}: {
  range: Range | undefined;
  handleUpdate: Function;
}) {
  const [active, setActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = null;
    if (e.target.files && e.target.files?.length > 0) {
      file = e.target.files[e.target.files?.length - 1];

      const url = URL.createObjectURL(file);
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .then((data) => {
          const img = document.createElement("img");
          img.style.width = "250px";
          img.style.height = "auto";
          img.src = data as string;
          range?.insertNode(img);
          setActive(false);
          handleUpdate();
        })
        .catch((err) => {
          console.error("ERROR = ", err);
        });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        className={`${styles.RichTextBtn}`}
        onClick={() => {
          setActive(true);
        }}
      >
        Image
      </div>
      <div
        style={{
          zIndex: "100",
          overflow: "hidden",
          position: "absolute",
          top: "100%",
          left: "0px",
          padding: "4px",
          backgroundColor: "#fff",
          border: "1px solid black",
          transform: `scaleY(${active ? "1" : "0"})`,
          transformOrigin: "50% 0%",
          transition: "0.3s all linear",
        }}
      >
        <div
          onClick={() => {
            setActive(false);
          }}
        >
          X
        </div>
        <input
          type="file"
          accept="image/*, .png, .jpg, .jpeg"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default RichTextBtnImg;
