const InitialSpinner = ({ className }) => {
	className = className
		? className
		: ` w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600`;

	return (
		<div class="relative flex space-x-2 justify-center items-center ">
			<span class=" text-gray-600 dark:text-slate-100">Loading</span>
			<div class="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.45s]"></div>
			<div class="h-4 w-4  bg-orange-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
			<div class="h-4 w-4 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
			<div class="h-4 w-4 bg-yellow-600 rounded-full animate-bounce"></div>
		</div>
	);
	
};

export default InitialSpinner;