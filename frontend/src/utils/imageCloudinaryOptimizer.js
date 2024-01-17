export const uptimizeCloudinaryImage = (
	optimizationStr,
	originalImageurl
) => {
	const cloudinaryBaseUrl =
		"https://res.cloudinary.com/da3q9dbku/image/upload/";

	// Find the index where the base URL ends
	const baseUrlEndIndex =
		originalImageurl.indexOf(cloudinaryBaseUrl) + cloudinaryBaseUrl.length;
	const baseUrl = originalImageurl.substring(0, baseUrlEndIndex);
	const restOfString = originalImageurl.substring(baseUrlEndIndex);

	// Add your optimization parameters

	return `${baseUrl}${optimizationStr}/${restOfString}`;
};
