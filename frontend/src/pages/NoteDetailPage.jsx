import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteDetail } from "../services/api";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNoteDetail(id);
      setNote(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load note details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const parseJSONField = (field) => {
    if (!field) return null;

    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return null;
      }
    }

    return field;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">
          Not detayları yükleniyor...
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error || "Note not found"}
            </div>
            <button
              onClick={() => navigate("/notes")}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Notlara geri dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quizQuestions = parseJSONField(note.quizQuestions);
  const flashcards = parseJSONField(note.flashcards);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Not Özeti
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.summary || "No summary available."}
            </p>
          </div>

          {Array.isArray(quizQuestions) && quizQuestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Quiz Soruları
              </h2>

              <div className="space-y-6">
                {quizQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {index + 1}. {q.question || q.text}
                    </h3>

                    {Array.isArray(q.options) && (
                      <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}

                    {q.answer && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <span className="font-semibold text-green-800">
                          Cevap:
                        </span>{" "}
                        <span className="text-green-700">{q.answer}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

    
          {Array.isArray(flashcards) && flashcards.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Flashcards
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => toggleCard(index)}
                    className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 
                               transition-all shadow-sm border-2 border-blue-200
                               min-h-[150px] flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 mb-2">
                        {flippedCards[index] ? "Cevap" : "Soru"}
                      </div>
                      <div className="text-gray-800 font-semibold">
                        {flippedCards[index]
                          ? card.answer || card.back || "Cevap sağlanmadı"
                          : card.question || card.front || "Soru sağlanmadı"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Cevabı görmek için karta tıklayın.
              </p>
            </div>
          )}

          <div>
            <button
              onClick={() => navigate("/notes")}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold
                         hover:bg-gray-700 transition-colors"
            >
              ← Notlara geri dön
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
