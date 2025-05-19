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
            const { data: fileUploaded } = await axios.post('http://localhost:5000/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Upload results:", fileUploaded);
            const query = fileUploaded.summary;
            const { data: fetchData } = await axios.get(
                `http://localhost:5000/fetch-semantic-scholar`,
                { params: { query } }
            );
            console.log("Fetched results:", fetchData);

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
            router.push("/search");

        } catch (error) {
            console.error('Error:', error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[200px] flex flex-col items-center justify-center bg-white/15 shadow-xl backdrop-blur-md rounded-2xl border border-white/20 p-8 mx-auto my-8 max-w-md">
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-4 text-white bg-white/30 border-none rounded-lg p-2 file:bg-white/40 file:rounded-lg file:p-2 file:border-none"
            />
            <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className={`px-6 py-2 rounded-lg border-none bg-white/25 text-white shadow-md cursor-pointer transition hover:bg-white/40 
                    ${loading ? "bg-amber-900 cursor-not-allowed" : "bg-amber-800 hover:bg-amber-900"}`}
            >
                {loading ? "Uploading..." : "Upload and Search"}
            </button>


            {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
        

    );
}
