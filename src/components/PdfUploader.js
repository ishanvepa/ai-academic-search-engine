import { useState } from 'react'
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PdfUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append('pdfFile', selectedFile);

        try {
            sessionStorage.setItem("similaritySearchResults", false); 
            router.push("/search");
            const { data: fileUploaded } = await axios.post('http://localhost:5000/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Upload results:", fileUploaded);
            const query = fileUploaded.summary;
            const { data: semanticScholarfetchData } = await axios.get(
                `http://localhost:5000/fetch-semantic-scholar`,
                { params: { query } }
            );
            const { data: arxivFetchData } = await axios.get(
                `http://localhost:5000/fetch-arxiv`,
                { params: { query } }
            );

            // Combine the results into one array (or object, depending on your data structure)
            const fetchData = [
                ...(Array.isArray(semanticScholarfetchData) ? semanticScholarfetchData : [semanticScholarfetchData]),
                ...(Array.isArray(arxivFetchData) ? arxivFetchData : [arxivFetchData])
            ];

            console.log("Combined fetched results:", fetchData);
            const { data: ingestionData } = await axios.post(
                `http://localhost:5000/ingest`,
                fetchData
            );
            console.log("Ingestion results:", ingestionData);

            const { data: simData } = await axios.post(
                `http://localhost:5000/similarity-search-pdf`,
                {"full_text":fileUploaded.full_text},
            );
            console.log("Similarity search results:", simData);

            sessionStorage.setItem("similaritySearchResults", JSON.stringify(simData[0]));
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally{
            setLoading(false);
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center mt-5">
            <button
                onClick={() => setOpen(true)}
                className="px-6 py-3 rounded-xl border-none text-white font-semibold shadow-lg bg-amber-800/80 hover:bg-amber-800 hover:scale-105 transition cursor-pointer flex items-center gap-2"
            >
                {/* Upload file icon */}
                <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                </svg>
                Upload File
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-gradient-to-br from-white/20 to-amber-100/10 shadow-2xl backdrop-blur-lg rounded-3xl border border-white/30 p-10 mx-auto max-w-lg relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-amber-700/80 hover:text-amber-800 text-2xl font-bold cursor-pointer transition hover:scale-110"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-800 rounded-xl cursor-pointer bg-white/30 hover:bg-amber-200/30 transition mb-6"
                        >
                            <svg
                                className="w-10 h-10 mb-2 text-amber-800/70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16v-8m0 0L8 8m4 0l4 0M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                                />
                            </svg>
                            <span className="text-white-800 font-medium pl-5 pr-5 text-center">
                                {selectedFile ? selectedFile.name : "Click to select a PDF file"}
                            </span>
                            <input
                                id="pdf-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <button
                            onClick={async () => {
                                await handleUpload();
                                setOpen(false);
                            }}
                            disabled={loading || !selectedFile}
                            className={`w-full px-6 py-3 rounded-xl border-none text-white font-semibold shadow-lg transition 
                                ${loading || !selectedFile
                                    ? "bg-amber-700/30 cursor-not-allowed"
                                    : "bg-amber-800/80 hover:bg-amber-800 hover:scale-105"}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Searching...
                                </span>
                            ) : (
                                "Upload and Search"
                            )}
                        </button>
                        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
