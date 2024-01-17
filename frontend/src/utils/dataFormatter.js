import moment from "moment";

export function formatDate(dateString) {
	const inputDate = moment(dateString, "YYYY-MM-DD"); // Assuming dateString is in the format 'YYYY-MM-DD'
	const currentDate = moment();

	if (currentDate.diff(inputDate, "days") < 1) {
		return "Today";
	} else if (currentDate.diff(inputDate, "days") === 1) {
		return "Yesterday";
	} else if (currentDate.diff(inputDate, "days") < 7) {
		return currentDate.diff(inputDate, "days") + " days ago";
	} else {
		return inputDate.format("DD MMM YYYY").toLowerCase();
	}
}
