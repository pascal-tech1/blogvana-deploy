import React, { useState, useEffect } from "react";
import { uptimizeCloudinaryImage } from "../utils/imageCloudinaryOptimizer";

const LazyLoadImg = ({
	backgroundClassName,
	imgClassName,
	originalImgUrl,
	blurImageStr,
	optimizationStr,
	paddingBottom,
}) => {
	const [aspectRatio, setAspectRatio] = useState(1);
	const [isLoaded, setIsLoaded] = useState(false);
	const optimizedImageUrl =
		optimizationStr &&
		originalImgUrl &&
		uptimizeCloudinaryImage(optimizationStr, originalImgUrl);

	useEffect(() => {
		const image = new Image();
		image.src = originalImgUrl;

		image.onload = () => {
			const ratio = image.width / image.height;
			setAspectRatio(ratio);
		};
	}, [originalImgUrl]);

	return (
		<div
			className={`${backgroundClassName} ${
				isLoaded ? "" : "animate-pulse"
			}`}
			style={{
				backgroundImage:
					blurImageStr && `url(data:image/png;base64,${blurImageStr})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				paddingBottom: paddingBottom
					? paddingBottom
					: `${100 / aspectRatio}%`, // Set paddingBottom based on aspect ratio
			}}
		>
			<img
				className={imgClassName}
				src={optimizedImageUrl}
				alt={`${optimizedImageUrl}`}
				onLoad={() => setIsLoaded(true)}
				style={{ visibility: isLoaded ? "visible" : "hidden" }}
				// loading="lazy"
			/>
		</div>
	);
};

export default LazyLoadImg;
