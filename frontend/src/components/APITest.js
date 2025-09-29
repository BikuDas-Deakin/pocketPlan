import React, { useState } from 'react';
import api from '../api/api';

const APITest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async (name, apiCall) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setResults(prev => ({
        ...prev,
        [name]: { success: true, data: response }
      }));
      console.log(`✅ ${name}:`, response);
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: { success: false, error: error.error || error.message }
      }));
      console.error(`❌ ${name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Health Check',
      call: () => api.health.check(),
    },
    {
      name: 'Get Benefits',
      call: () => api.benefits.getAll(),
    },
    {
      name: 'Login (demo)',
      call: () => api.auth.login('demo@pocketplan.com', 'demo123'),
    },
  ];

  const testAfterAuth = [
    {
      name: 'Get Expenses',
      call: () => api.expenses.getAll(),
    },
    {
      name: 'Get Budgets',
      call: () => api.budgets.getAll(),
    },
    {
      name: 'Get Expense Stats',
      call: () => api.expenses.getStatsSummary(),
    },
    {
      name: 'Get AI Insights',
      call: () => api.insights.getAIInsights(),
    },
    {
      name: 'Get Community Posts',
      call: () => api.community.getPosts(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          PocketPlan API Test
        </h1>

        {/* Public APIs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Public APIs (No Auth Required)
          </h2>
          <div className="space-y-2">
            {tests.map((test) => (
              <button
                key={test.name}
                onClick={() => testAPI(test.name, test.call)}
                disabled={loading}
                className="w-full bg-blue-900 text-white px-4 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition-colors text-left"
              >
                Test: {test.name}
              </button>
            ))}
          </div>
        </div>

        {/* Protected APIs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Protected APIs (Auth Required - Login First)
          </h2>
          <div className="space-y-2">
            {testAfterAuth.map((test) => (
              <button
                key={test.name}
                onClick={() => testAPI(test.name, test.call)}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-left"
              >
                Test: {test.name}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create Expense Test
          </h2>
          <button
            onClick={() => testAPI('Create Expense', () => 
              api.expenses.create({
                amount: 25.50,
                category: 'food',
                description: 'Test expense from React',
                payment_method: 'card'
              })
            )}
            disabled={loading}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            Create Test Expense
          </button>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Testing...</p>
            </div>
          )}
          
          {Object.keys(results).length === 0 && !loading && (
            <p className="text-gray-500 text-center py-4">
              Click a button above to test an API endpoint
            </p>
          )}

          <div className="space-y-4">
            {Object.entries(results).map(([name, result]) => (
              <div
                key={name}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{name}</h3>
                  <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.success ? '✅ Success' : '❌ Failed'}
                  </span>
                </div>
                <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-auto max-h-64">
                  {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Make sure your backend is running on port 4000</li>
            <li>Test "Health Check" first to verify connection</li>
            <li>Test "Get Benefits" to check public endpoints</li>
            <li>Test "Login (demo)" to authenticate</li>
            <li>After login, test the protected endpoints</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default APITest;