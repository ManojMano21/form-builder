import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";

import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  options: string[];
}

interface FormData {
  title: string;
  description: string;
  fields: FormField[];
}

export function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    title: "Untitled Form",
    description: "",
    fields: [],
  });

  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // DEFAULT LABELS
  const getDefaultLabel = (type: FieldType) => {
    const labels: Record<FieldType, string> = {
      text: "Text Question",
      email: "Email Address",
      phone: "Phone Number",
      textarea: "Long Answer",
      radio: "Multiple Choice",
      checkbox: "Checkboxes",
      dropdown: "Dropdown",
    };
    return labels[type];
  };

  // ADD FIELD (SAFE)
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).substring(7),
      type,
      label: getDefaultLabel(type),
      required: false,

      // 🔥 ALWAYS SAFE ARRAY
      options:
        type === "radio" || type === "checkbox" || type === "dropdown"
          ? ["Option 1", "Option 2"]
          : [],
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  // UPDATE FIELD
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  // DELETE FIELD
  const deleteField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
  };

  // SAVE FORM (SAFE - NO UNDEFINED)
  const saveForm = async () => {
    if (saving) return;
    setSaving(true);

    try {
      if (formData.fields.length === 0) {
        alert("Please add at least one field");
        setSaving(false);
        return;
      }

      const cleanData = {
        title: formData.title ?? "Untitled Form",
        description: formData.description ?? "",

        fields: formData.fields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: Boolean(field.required),

          // 🔥 ALWAYS SAFE
          options: Array.isArray(field.options)
            ? field.options
            : [],
        })),

        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "forms"), cleanData);

      setSavedFormId(docRef.id);

      console.log("✅ FORM SAVED:", docRef.id);
    } catch (error: any) {
      console.error("❌ SAVE ERROR:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // SHARE LINK
  const shareLink = savedFormId
    ? `${window.location.origin}/forms/${savedFormId}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>

          <div className="flex gap-2 items-center">

            {/* SAVE */}
            <button
              onClick={saveForm}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            {/* PREVIEW */}
            <Link
              to={savedFormId ? `/forms/${savedFormId}` : ""}
              className={`border px-4 py-2 rounded-lg ${
                !savedFormId ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Preview
            </Link>

            {/* 🔥 SHARE LINK BOX */}
            {savedFormId && (
              <div className="flex items-center gap-2 ml-4">

                <input
                  value={shareLink}
                  readOnly
                  className="border px-2 py-1 rounded text-sm w-64"
                />

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(shareLink)
                  }
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  Copy
                </button>

              </div>
            )}

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* TITLE */}
        <div className="bg-white p-6 rounded-lg mb-6">
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full text-2xl mb-2 outline-none"
          />

          <input
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full text-gray-500 outline-none"
          />
        </div>

        {/* FIELDS */}
        {formData.fields.map((field) => (
          <div key={field.id} className="bg-white p-4 mb-4 rounded-lg">

            <input
              value={field.label}
              onChange={(e) =>
                updateField(field.id, { label: e.target.value })
              }
              className="w-full mb-2 outline-none"
            />

            {/* OPTIONS */}
            {(field.type === "radio" ||
              field.type === "checkbox" ||
              field.type === "dropdown") && (
              <div className="space-y-2">

                {field.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">

                    <input
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[i] = e.target.value;
                        updateField(field.id, {
                          options: newOptions,
                        });
                      }}
                      className="flex-1 border p-1 rounded"
                    />

                    <button
                      onClick={() => {
                        const newOptions = field.options.filter(
                          (_, idx) => idx !== i
                        );
                        updateField(field.id, {
                          options: newOptions,
                        });
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                ))}

              </div>
            )}

            <button
              onClick={() => deleteField(field.id)}
              className="text-red-500 mt-2"
            >
              Delete Field
            </button>

          </div>
        ))}

        {/* ADD FIELD */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => addField("text")}>Text</button>
          <button onClick={() => addField("email")}>Email</button>
          <button onClick={() => addField("phone")}>Phone</button>
          <button onClick={() => addField("textarea")}>Paragraph</button>
          <button onClick={() => addField("radio")}>MCQ</button>
          <button onClick={() => addField("checkbox")}>Checkbox</button>
          <button onClick={() => addField("dropdown")}>Dropdown</button>
        </div>

      </main>
    </div>
  );
}