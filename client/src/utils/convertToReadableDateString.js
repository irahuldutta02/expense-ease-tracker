export function convertToReadableDateString(dateString) {
  // Parse the input date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the day, month, and year
  const day = date.getDate();
  const month = monthNames[date.getMonth()]; // Months are 0-indexed
  const year = date.getFullYear();

  // Format the date string
  const formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
}
