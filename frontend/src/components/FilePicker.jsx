import { useRef } from "react";

export default function FilePicker({ label, accept, disabled, value, onChange }) {
  const ref = useRef(null);

  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3">
      <div className="text-xs text-[color:var(--muted)] whitespace-nowrap">
        {label}
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center gap-3">
        <input
          ref={ref}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.files?.[0] || null)}
          className="hidden"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current?.click()}
          className={`imp-btn h-9 px-3 text-xs ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Choose file
        </button>

        <div className="text-xs text-[color:var(--muted)] truncate">
          {value?.name || "No file chosen"}
        </div>
      </div>
    </div>
  );
}
