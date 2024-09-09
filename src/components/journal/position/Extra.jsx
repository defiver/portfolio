import dayjs from "dayjs";

export default function Extra({ position }) {
  if (position.status !== "active" && position.income) {
    return (
      <span>
        {position?.income < 0 ? `-$${Math.abs(position.income)}` : `$${position.income}`}
      </span>
    );
  } else if (position?.daterange && position.daterange[1] && position.status === "active") {
    return (
      <span className={dayjs(position.daterange[1].$d).diff(dayjs()) < 259_200_000 ? "warning" : ""}>
        {dayjs(position.daterange[1].$d).format("DD.MM.YYYY")}
      </span>
    );
  }
}