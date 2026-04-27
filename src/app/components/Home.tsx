// src/app/components/Home.tsx
import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type FormType = {
  id: string;
  title: string;
  description?: string;
};

export function Home() {
  const [forms, setForms] = useState<FormType[]>([]);
  const [responseCounts, setResponseCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formSnap = await getDocs(collection(db, "forms"));

        const formList: FormType[] = formSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FormType, "id">),
        }));

        setForms(formList);

        const counts: Record<string, number> = {};

        for (const form of formList) {
          const q = query(
            collection(db, "responses"),
            where("formId", "==", form.id)
          );

          const resSnap = await getDocs(q);
          counts[form.id] = resSnap.size;
        }

        setResponseCounts(counts);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* LOGO */}
          <h1 className="text-purple-600 text-2xl font-bold italic">
            formbuilder
          </h1>

          {/* NAVIGATION */}
          <div className="flex items-center gap-6">

            <Link
              to="/home"
              className="text-gray-700 hover:text-purple-600"
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-purple-600"
            >
              Dashboard
            </Link>

            <Link
              to="/create"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </Link>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6">

        <h2 className="text-3xl font-semibold mb-2">
          Start a new form
        </h2>

        <p className="text-gray-600 mb-6">
          Create forms to collect information
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CREATE NEW FORM CARD */}
            <Link
              to="/create"
              className="bg-white border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:border-purple-600"
            >
              <Plus className="w-10 h-10 text-purple-600 mb-2" />
              <span>Blank Form</span>
            </Link>

            {/* EXISTING FORMS */}
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white p-6 rounded-lg shadow"
              >
                <FileText className="w-8 h-8 text-purple-600 mb-2" />

                <h3 className="text-lg font-semibold">
                  {form.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {responseCounts[form.id] || 0} responses
                </p>

                <div className="flex gap-2 mt-3">

                  <Link
                    to={`/forms/${form.id}`}
                    className="flex-1 text-center border border-purple-600 text-purple-600 py-1 rounded"
                  >
                    Open
                  </Link>

                  <Link
                    to={`/forms/${form.id}/responses`}
                    className="flex-1 text-center bg-purple-600 text-white py-1 rounded"
                  >
                    Responses
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}