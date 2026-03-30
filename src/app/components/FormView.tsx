import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

import { db } from "../../lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

// TYPES
type FieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
}

interface FormDataType {
  title: string;
  description: string;
  fields: FormField[];
}

export function FormView() {
  const { formId } = useParams();

  const [form, setForm] = useState<FormDataType | null>(null);
  const [loading, setLoading] = useState(true); // ✅ FIX
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // ✅ FETCH FORM FROM FIREBASE
  useEffect(() => {
    const fetchForm = async () => {
      console.log("FORM ID:", formId); // 🔍 debug

      if (!formId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "forms", formId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("FORM DATA:", docSnap.data()); // 🔍 debug
          setForm(docSnap.data() as FormDataType);
        } else {
          console.log("Form not found");
          setForm(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // ✅ IMPORTANT
      }
    };

    fetchForm();
  }, [formId]);

  // ✅ SUBMIT RESPONSE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "responses"), {
        formId,
        data: formValues,
        timestamp: new Date(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCheckboxChange = (
    fieldId: string,
    option: string,
    checked: boolean
  ) => {
    const currentValues = formValues[fieldId] || [];

    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v: string) => v !== option);

    handleFieldChange(fieldId, newValues);
  };

  // ✅ LOADING STATE
  if (loading) {
    return <div className="p-10 text-center">Loading form...</div>;
  }

  // ❌ FORM NOT FOUND
  if (!form) {
    return (
      <div className="p-10 text-center text-red-500">
        Form not found ❌
      </div>
    );
  }

  // ✅ SUCCESS PAGE
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center shadow">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-4">
            Your response has been recorded.
          </p>
          <Link to="/" className="text-purple-600 hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b p-4">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      {/* FORM */}
      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white p-6 mb-4 rounded shadow">
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          <p className="text-gray-500">{form.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields.map((field) => (
            <div key={field.id} className="bg-white p-4 rounded shadow">
              <label className="block mb-2 font-medium">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {/* TEXT */}
              {field.type === "text" && (
                <input
                  required={field.required}
                  onChange={(e) =>
                    handleFieldChange(field.id, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              )}

              {/* EMAIL */}
              {field.type === "email" && (
                <input
                  type="email"
                  required={field.required}
                  onChange={(e) =>
                    handleFieldChange(field.id, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              )}

              {/* TEXTAREA */}
              {field.type === "textarea" && (
                <textarea
                  required={field.required}
                  onChange={(e) =>
                    handleFieldChange(field.id, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              )}

              {/* RADIO */}
              {field.type === "radio" && (
                <div className="space-y-1">
                  {field.options?.map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        required={field.required}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.value)
                        }
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* CHECKBOX */}
              {field.type === "checkbox" && (
                <div className="space-y-1">
                  {field.options?.map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxChange(
                            field.id,
                            opt,
                            e.target.checked
                          )
                        }
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* DROPDOWN */}
              {field.type === "dropdown" && (
                <select
                  required={field.required}
                  onChange={(e) =>
                    handleFieldChange(field.id, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
