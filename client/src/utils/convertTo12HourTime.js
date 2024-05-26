export function convertTo12HourTime(dateString) {
  // Parse the input date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Extract the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always have two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Format the time string
  const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

  return formattedTime;
}
