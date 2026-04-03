export const formatDate = (value) => {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};

export const statusTone = {
  todo: "bg-slate-200 text-slate-700",
  "in progress": "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700"
};

export const roleTone = {
  admin: "bg-orange-100 text-orange-700",
  user: "bg-violet-100 text-violet-700"
};
