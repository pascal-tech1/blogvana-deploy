export function formatDate(dateString, daysAgo = 0) {
  // Create a copy of the input date to avoid modifying it
  const pastDate = new Date(date.getTime());

  // Adjust the date by the specified number of days
  pastDate.setDate(pastDate.getDate() - daysAgo);

  const today = new Date();

  const diffInMs = today.getTime() - pastDate.getTime();
  const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));

  // Check if pastDate is today
  if (diffInDays === 0) {
    return "Today";
  } 
  // Check if pastDate is yesterday
  else if (diffInDays === 1) {
    return "Yesterday";
  } 
  // Check if within the past week
  else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } 
  // Otherwise, return formatted date string
  else {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return pastDate.toLocaleDateString('en-US', options);
  }
}
