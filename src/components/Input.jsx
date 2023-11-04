import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export default function Input({ location, handleLocation }) {
  const inputEl = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    handleLocation("");
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search location..."
        value={location}
        onChange={(e) => handleLocation(e.target.value)}
        ref={inputEl}
      />
    </div>
  );
}
