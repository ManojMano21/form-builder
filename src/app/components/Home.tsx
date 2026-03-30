import { Link } from "react-router";
import { Plus, FileText } from "lucide-react";

export function Home() {
  // Mock forms data - will be replaced with real data later
  const forms = [
    { id: "1", title: "Customer Feedback Form", responses: 12 },
    { id: "2", title: "Event Registration", responses: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900">FormBuilder</h1>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Start a new form
          </h2>
          <p className="text-gray-600">
            Create forms to collect information from users
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create new form card */}
          <Link
            to="/create"
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center min-h-[200px] group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">
              Blank Form
            </span>
          </Link>

          {/* Recent forms */}
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {form.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {form.responses} responses
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/create?id=${form.id}`}
                  className="flex-1 text-center px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  to={`/responses/${form.id}`}
                  className="flex-1 text-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}