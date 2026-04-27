// src/app/components/Dashboard.tsx
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

type FormType = {
  id: string;
  title?: string;
  createdAt?: any;
};

export default function Dashboard() {
  const [forms, setForms] = useState<FormType[]>([]);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setUserEmail(user.email || "");
      }
    });

    return () => unsub();
  }, [navigate]);

  // 📄 FETCH FORMS
  useEffect(() => {
    const fetchForms = async () => {
      const snap = await getDocs(collection(db, "forms"));

      const data: FormType[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setForms(data);
    };

    fetchForms();
  }, []);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-1/4 bg-white shadow p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-2">Form Builder</h2>

          <p className="text-gray-600 text-sm mb-4">
            {userEmail}
          </p>

          <Link
            to="/create"
            className="bg-blue-500 text-white px-4 py-2 rounded block text-center"
          >
            + Create Form
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Your Forms</h1>

        {forms.length === 0 ? (
          <p className="text-gray-500">No forms created yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">

            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white p-4 rounded shadow"
              >
                <h3 className="font-bold">
                  {form.title || "Untitled Form"}
                </h3>

                <p className="text-sm text-gray-500">
                  ID: {form.id}
                </p>

                <div className="flex gap-2 mt-4">

                  <Link
                    to={`/forms/${form.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Open
                  </Link>

                  <Link
                    to={`/forms/${form.id}/responses`}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Responses
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}