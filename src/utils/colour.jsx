// функция для разукрашивания background в зависимости от строки
export const stringToColour = (str) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return {
    background: "linear-gradient(to right, #d0d2d4, " + colour + ")",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
};
