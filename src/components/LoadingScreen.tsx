export function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
            {/* Professional Circle Spinner (Windows-like/Modern) */}
            <div className="w-12 h-12 border-[5px] border-gray-100 border-t-cyan-500 rounded-full animate-spin"></div>

            <p className="mt-6 text-sm text-gray-500 font-medium tracking-wider">Loading...</p>
        </div>
    );
}
