import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPDF } from "../services/api";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await uploadPDF(file);

      const noteId = response?.data?.id;

      if (noteId) {
        navigate(`/notes/${noteId}`);
      } else {
        navigate("/notes");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload PDF. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              PDF Belgesi Yükle
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="pdf-upload"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  PDF Dosyasını Seçin
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Seçilen: {file.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                  hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  transition-colors"
              >
                {loading ? "Uploading..." : "Upload PDF"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
