import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Users } from "lucide-react";

// ✅ Dynamic types
type ResponseData = {
  [key: string]: string | string[];
};

type ResponseType = {
  id: string;
  timestamp: any;
  data: ResponseData;
};

export function FormResponses() {
  const { formId } = useParams();

  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch responses from Firebase
  useEffect(() => {
    if (!formId) return;

    const q = query(
      collection(db, "responses"),
      where("formId", "==", formId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ResponseType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ResponseType[];

      setResponses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [formId]);

  // ✅ CSV Export
  const exportToCSV = () => {
    if (responses.length === 0) return;

    const headers = Object.keys(responses[0].data);

    const rows = responses.map((res) =>
      headers.map((key) => {
        const value = res.data[key];
        return Array.isArray(value) ? value.join(", ") : value || "";
      })
    );

    const csv = [
      ["Timestamp", ...headers],
      ...rows.map((row, idx) => [
        responses[idx].timestamp?.toDate?.().toLocaleString() || "",
        ...row,
      ]),
    ]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `responses-${formId}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <button
            onClick={exportToCSV}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            <Download className="w-4 h-4 inline mr-1" />
            Export CSV
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl mb-4">Responses</h1>

        <div className="flex items-center gap-2 mb-4 text-gray-600">
          <Users className="w-5 h-5" />
          {responses.length} responses
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : responses.length === 0 ? (
          <p>No responses yet</p>
        ) : (
          <div className="bg-white border rounded overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Timestamp</th>
                  {Object.keys(responses[0].data).map((key) => (
                    <th key={key} className="p-2 text-left">
                      Q{key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {responses.map((res) => (
                  <tr key={res.id} className="border-t">
                    <td className="p-2">
                      {res.timestamp?.toDate?.().toLocaleString()}
                    </td>

                    {Object.keys(res.data).map((key) => {
                      const value = res.data[key];

                      return (
                        <td key={key} className="p-2">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
