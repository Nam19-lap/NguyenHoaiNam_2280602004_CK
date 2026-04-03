export default function AlertMessage({ alert, onClose }) {
  if (!alert) {
    return null;
  }

  const tone =
    alert.type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className={`card flex items-start justify-between gap-4 border px-4 py-3 ${tone}`}>
      <p className="text-sm font-medium">{alert.message}</p>
      <button className="text-xs font-semibold uppercase tracking-wide" onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
}
