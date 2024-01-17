import { useState, useEffect } from "react";

const useClickOutside = (divRef, iconRef) => {
	const [isOutsideClicked, setIsClicked] = useState(false);

	useEffect(() => {
		const handleClick = (event) => {
			
			if (
				(divRef.current && divRef.current.contains(event.target)) ||
				(iconRef?.current && iconRef?.current.contains(event.target))
			) {
				// Click occurred inside the div
				setIsClicked(true);
			} else {
				// Click occurred outside the div
				setIsClicked(false);
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			// Cleanup: Remove event listener when component unmounts
			document.removeEventListener("click", handleClick);
		};
	}, [divRef,iconRef]);

	return isOutsideClicked;
};

export default useClickOutside;
