import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

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

interface FormData {
  title: string;
  description: string;
  fields: FormField[];
}

export function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    title: "Untitled Form",
    description: "Form description",
    fields: [],
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [formId] = useState(() =>
    Math.random().toString(36).substring(7)
  );

  // ✅ Save form to Firebase
  const saveForm = async () => {
    try {
      await setDoc(doc(db, "forms", formId), {
        ...formData,
        formId,
        createdAt: new Date(),
      });

      alert("Form saved successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).substring(7),
      type,
      label: getDefaultLabel(type),
      required: false,
      options:
        type === "radio" ||
        type === "checkbox" ||
        type === "dropdown"
          ? ["Option 1", "Option 2"]
          : undefined,
    };

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    });
  };

  const deleteField = (id: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((f) => f.id !== id),
    });
  };

  const updateOption = (
    fieldId: string,
    index: number,
    value: string
  ) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) => {
        if (field.id === fieldId && field.options) {
          const options = [...field.options];
          options[index] = value;
          return { ...field, options };
        }
        return field;
      }),
    });
  };

  const addOption = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) => {
        if (field.id === fieldId && field.options) {
          return {
            ...field,
            options: [
              ...field.options,
              `Option ${field.options.length + 1}`,
            ],
          };
        }
        return field;
      }),
    });
  };

  const deleteOption = (fieldId: string, index: number) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) => {
        if (field.id === fieldId && field.options) {
          return {
            ...field,
            options: field.options.filter((_, i) => i !== index),
          };
        }
        return field;
      }),
    });
  };

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

  const shareableUrl = `${window.location.origin}/forms/${formId}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>

          <div className="flex gap-2">
            <button
              onClick={saveForm}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>

            <Link
              to={`/forms/${formId}`}
              className="border px-4 py-2 rounded-lg"
            >
              Preview
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Share
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-8">
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

            {(field.type === "radio" ||
              field.type === "checkbox" ||
              field.type === "dropdown") && (
              <div className="space-y-2">
                {field.options?.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={(e) =>
                        updateOption(field.id, i, e.target.value)
                      }
                      className="flex-1"
                    />
                    <button
                      onClick={() => deleteOption(field.id, i)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addOption(field.id)}>
                  Add Option
                </button>
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

        {/* ADD FIELD BUTTONS */}
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

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-2">Share this link:</p>
            <p className="text-purple-600 break-all mb-4">
              {shareableUrl}
            </p>

            <button
              onClick={() => navigator.clipboard.writeText(shareableUrl)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Copy
            </button>

            <button
              onClick={() => setShowShareModal(false)}
              className="ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}