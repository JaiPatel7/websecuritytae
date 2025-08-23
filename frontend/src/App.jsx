import React from 'react';
import './App.css'; // Assuming you have an App.css where Tailwind is imported

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Hello Tailwind!
        </h1>
        <p className="text-lg text-gray-700">
          This text is styled with Tailwind CSS utility classes.
        </p>
        <button className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-green-600 transition duration-300">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;