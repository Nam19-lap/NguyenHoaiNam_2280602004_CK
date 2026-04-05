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

export const getTagTextColor = (backgroundColor) => {
  if (!backgroundColor || !backgroundColor.startsWith("#")) {
    return "#ffffff";
  }

  const hex = backgroundColor.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((char) => `${char}${char}`).join("") : hex;

  if (normalized.length !== 6) {
    return "#ffffff";
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 160 ? "#0f172a" : "#ffffff";
};
