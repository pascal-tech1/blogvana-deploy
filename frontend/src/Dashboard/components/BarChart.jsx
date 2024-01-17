import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { setChartSelectedFilter } from "../../redux/user/userSlice";
import { useSelector } from "react-redux";
import {
	DashboardCustomDropdown,
	LoadingSkeleton,
	LoadingSpinner,
} from "../../components";
import ChartLoadingSkeleton from "./chartLoadingSkeleton";

function BarChart() {
	const {
		chartSelectedFilter,
		userPostImpression,
		userPostImpressionStatus,
	} = useSelector((store) => store.userSlice);

	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	);
	function isWholeNumber(number) {
		return Math.floor(number) === number;
	}
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		autoPadding: true,
		plugins: {
			legend: {
				display: true,
				position: "top",
				align: "end",
				labels: {
					boxWidth: 10, // Adjust the width of the legend item
					padding: 20, // Adjust the padding between legend items
					color: "#94bef9",
				},
			},
			title: {
				display: true,
				text: `${chartSelectedFilter.toUpperCase()} CHART`,
				color: "#94bef9",
			},
		},
		tooltips: {
			enabled: true,
			mode: "index",
			intersect: false,
			callbacks: {
				label: function (tooltipItem, data) {
					return data.labels[tooltipItem.dataIndex];
				},
			},
		},

		scales: {
			x: {
				ticks: {
					callback: function (value) {
						return value + 1;
					},
					color: "#94bef9",
				},
				title: {
					display: true,
					text: "Recent Post",
					color: "#94bef9",
				},
				grid: {
					display: false,
				},
			},
			y: {
				ticks: {
					callback: function (value) {
						console.log(value);
						return value >= 1000
							? value / 1000 + "k"
							: isWholeNumber(value)
							? value
							: "";
					},
					color: "#94bef9",
				},
				title: {
					display: true,
					text: "count",
					color: "#94bef9",
				},
				grid: {
					color: "#63636427",
				},
			},
		},
	};

	const labels = userPostImpression?.postsTitle;
	let datasets;
	// if (userPostImpression.length === 0) {
	// 	datasets = [
	// 		{
	// 			label: "Likes",
	// 			data: [],
	// 			backgroundColor: "rgb(255, 99, 133)",
	// 		},
	// 		{
	// 			label: "Dislikes",
	// 			data: [],
	// 			backgroundColor: "rgb(53, 162, 235)",
	// 		},
	// 	];
	// }

	if (chartSelectedFilter === "likes and dislikes") {
		datasets = [
			{
				label: "Likes",
				data: userPostImpression?.likesDataset,
				backgroundColor: "rgb(53, 162, 235)",
			},
			{
				label: "Dislikes",
				data: userPostImpression?.disLikesDataset,
				backgroundColor: "rgb(255, 99, 133)",
			},
		];
	}

	if (chartSelectedFilter === "number of views") {
		datasets = [
			{
				label: "number of views",
				data: userPostImpression?.numViewDataset,
				backgroundColor: "rgba(99, 255, 138, 0.929)",
			},
		];
	}

	const data = {
		labels,
		datasets,
	};

	const allFilter = ["likes and dislikes", "number of views"];
	console.log(data);

	return (
		<div className="w-full h-[300px]  flex flex-col  py-2 rounded-lg font-inter">
			<div className=" px-2 self-start ">
				<DashboardCustomDropdown
					allFilters={allFilter}
					setSelectedFilter={setChartSelectedFilter}
					selectedFilter={chartSelectedFilter}
					dropdownWidth={"w-[170px"}
					left={"l-3"}
				/>
			</div>
			<div className=" h-full w-full relative">
				{userPostImpressionStatus === "loading" ? (
					<div className="absolute -top-11 left-0 w-full h-full overflow-y-hidden">
						<ChartLoadingSkeleton />
					</div>
				) : (
					<Bar options={options} data={data} />
				)}
			</div>
		</div>
	);
}

export default BarChart;
