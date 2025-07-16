import colors from "./colors.json" with { type: "json" };

export const getColor = (language: string, fallback: string) => {
  return colors[language as keyof typeof colors]?.color || fallback;
};
