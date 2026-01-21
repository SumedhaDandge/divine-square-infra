// utils/dateTime.js
export const combineDateAndTime = (date, time) => {
  const [_, hh, mm, meridian] = time.match(/(\d+):(\d+)\s*(AM|PM)/i);

  let hours = parseInt(hh);
  const minutes = parseInt(mm);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  const finalDate = new Date(date);
  finalDate.setHours(hours, minutes, 0, 0);

  return finalDate;
};
