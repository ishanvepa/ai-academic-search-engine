export default function Background() {

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Orange blurred circle 1 */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 opacity-30 rounded-full blur-[100px]" />
            
            {/* Orange blurred circle 2 */}
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 opacity-40 rounded-full blur-[120px]" />

            {/* Orange blurred circle 3 (optional) */}
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-yellow-400 opacity-30 rounded-full blur-[80px]" />
        </div>
    );
  
}
