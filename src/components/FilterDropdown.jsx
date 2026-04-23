import { useEffect, useRef, useState } from "react";
import IconArrowDown from "./icons/ArrowdownIcon";

const STATUSES = ["draft", "pending", "paid"];

export default function FilterDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleStatus = (status) => {
    onChange(
      selected.includes(status)
        ? selected.filter((item) => item !== status)
        : [...selected, status],
    );
  };

  return (
    <div className="filter-wrap" ref={ref}>
      <button
        className="filter-btn"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="filter-label">
          <span className="filter-label-mobile">Filter</span>
          <span className="filter-label-desktop">Filter by status</span>
        </span>
        <span className={`filter-arrow ${open ? "open" : ""}`}>
          <IconArrowDown />
        </span>
      </button>

      {open && (
        <div className="filter-menu" role="listbox">
          {STATUSES.map((status) => {
            const isSelected = selected.includes(status);

            return (
              <div
                key={status}
                className="filter-option"
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => toggleStatus(status)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleStatus(status);
                  }
                }}
              >
                <div className={`checkbox ${isSelected ? "checked" : ""}`}>
                  {isSelected && (
                    <svg width={10} height={8} viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
