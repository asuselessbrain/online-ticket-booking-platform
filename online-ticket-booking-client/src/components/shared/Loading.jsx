const Loading = ({ message = "Loading...", fullPage = false, className = "" }) => {
	const base = "w-full flex flex-col items-center justify-center text-center";
	const sizing = fullPage ? "min-h-[320px] py-12" : "py-8";
	const containerClass = `${base} ${sizing} ${className}`.trim();

	return (
		<div className={containerClass} role="status" aria-live="polite">
			<div className="relative h-14 w-14">
				<span className="absolute inset-0 rounded-full border-4 border-[#c9efdc]" aria-hidden />
				<span className="absolute inset-0 rounded-full border-4 border-[#01602a] border-t-transparent animate-spin" aria-hidden />
				<span className="absolute inset-2 rounded-full bg-white shadow-inner" aria-hidden />
			</div>
			<p className="mt-4 text-base font-semibold text-gray-800">{message}</p>
			<p className="text-sm text-gray-500">Hang tight — we’re preparing your view.</p>
		</div>
	);
};

export default Loading;