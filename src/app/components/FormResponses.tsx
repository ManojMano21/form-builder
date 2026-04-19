import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { db } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface ResponseType {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt?: any;
}

export function FormResponses() {
  const { formId } = useParams();

  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH RESPONSES
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (!formId) return;

        const q = query(
          collection(db, "responses"),
          where("formId", "==", formId)
        );

        const snapshot = await getDocs(q);

        const data: ResponseType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ResponseType, "id">),
        }));

        setResponses(data);
      } catch (err) {
        console.error("❌ Error fetching responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) {
    return <div className="p-10 text-center">Loading responses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Form Responses</h1>

        <Link
          to={`/forms/${formId}`}
          className="text-purple-600 hover:underline"
        >
          Back to Form
        </Link>
      </div>

      {/* EMPTY STATE */}
      {responses.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No responses yet 😢
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((res, index) => (
            <div
              key={res.id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="font-semibold mb-2">
                Response #{index + 1}
              </h2>

              {/* DISPLAY ANSWERS */}
              <div className="space-y-2">
                {Object.entries(res.data).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="font-medium">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
