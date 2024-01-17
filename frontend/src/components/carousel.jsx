import React, { useState, useEffect } from "react";

const testimonials = [
	{
		id: 1,
		name: "John Doe",
		image:
			"https://res.cloudinary.com/da3q9dbku/image/upload/q_auto,f_auto,w_400/v1705245799/mern-blog-app/pascalazubike004%40gmail.com/postImage/jnbc08j0zvoyunzbljed.webp",
		text: "Blogvana streamlines my blogging with its sleek design and powerful features. A tech enthusiast's dream!",
	},
	{
		id: 2,
		name: "Jane Smith",
		image:
			"https://res.cloudinary.com/da3q9dbku/image/upload/q_auto,f_auto,w_800/v1705148818/mern-blog-app/pascalazubike004%40gmail.com/postImage/bh5mtjyvhfp0be47fn9m.jpg",
		text: "Blogvana sparks my creativity! The perfect blend of user-friendly design and powerful tools for content creators.",
	},
	{
		id: 3,
		name: "chief Odogwu",
		image:
			"https://res.cloudinary.com/da3q9dbku/image/upload/q_auto,f_auto,w_400/v1705164970/mern-blog-app/pascalazubike004%40gmail.com/postImage/zpwpe5z8xsk5f4qarpt2.jpg",
		text: "Blogvana turns my travel tales into visual wonders. Responsive, intuitive, and the passport to a captivating blogging journey!",
	},

	// Add more testimonial objects here
];

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(
				(prevIndex) => (prevIndex + 1) % testimonials.length
			);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	const hadnleMouseEnter = () => {
		setCurrentIndex((prev) => (prev = 0));
	};
	return (
		<div className="flex  font-inter ">
			{testimonials.map((testimony, index) => {
				return (
					<div
						onMouseEnter={hadnleMouseEnter}
						key={testimony.id}
						className={` w-80 dark:bg-lightdark rounded-md p-2 font-inter dark:text-slate-200  border dark:border-gray-800 h-40 py-4 px-4 bg-blue-100 space-x-3 gap-1 flex items-center flex-col ${
							currentIndex === index ? " order-2" : "hidden"
						}`}
					>
						<div className="flex space-x-3 items-center  ">
							<img
								src={testimony.image}
								alt=""
								className="w-10 rounded-full  object-cover h-10 "
							/>
							<h3 className="  ">{testimony.name}</h3>
						</div>
						<h3 className=" text-center">{testimony.text}</h3>
					</div>
				);
			})}
		</div>
	);
};

export default Carousel;
