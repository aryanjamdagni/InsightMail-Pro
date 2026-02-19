// export default function Select({ value, onChange, options, className = "" }) {
//   return (
//     <select
//       className={`imp-input px-3 py-2 text-sm outline-none ${className}`}
//       value={value}
//       onChange={(e) => onChange?.(e.target.value)}
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   );
// }

export default function Select({ value, onChange, options, className = "" }) {
  return (
    <select
      className={`imp-input px-4 py-3 text-sm outline-none ${className}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
