import React, { useState } from 'react';

const developers = [
  {
    name: 'Kartik Pundir',
    role: 'Frontend Developer',
    image: '/images/kartik.jpg',
    bio: 'Hi! I\'m Kartik, a frontend developer passionate about crafting modern UIs using React and Tailwind CSS.',
  },
  {
    name: 'Anisha Semwal',
    role: 'Backend Engineer',
    image: '/images/anisha.jpg',
    bio: 'Hello! I\'m Anisha, a backend engineer specializing in building robust APIs and scalable systems with Python and FastAPI.',
  },
];

const AboutPanel: React.FC = () => {
  const [selectedDev, setSelectedDev] = useState<null | typeof developers[0]>(null);

  return (
    <div className="flex flex-col items-center text-white bg-gradient-to-b from-[#0c0920] to-[#131136] min-h-screen p-10 relative">
      
      {/* Top Image */}
      <div className="mb-12">
        <img 
          src="/images/chatbot-logo.png" 
          alt="Bot Logo"
          className="w-32 h-32 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-cyan-400"
        />
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center">Meet the Developers</h2>

      {/* Developer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl w-full">
        {developers.map((dev, index) => (
          <div
            key={index}
            onClick={() => setSelectedDev(dev)}
            className="bg-[#1f1b3a] rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-cyan-500/30 transition-shadow cursor-pointer hover:scale-105"
          >
            <img 
              src={dev.image} 
              alt={dev.name} 
              className="w-24 h-24 rounded-full border-4 border-purple-500 mb-4"
            />
            <h3 className="text-xl font-semibold text-cyan-300">{dev.name}</h3>
            <p className="text-gray-400">{dev.role}</p>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedDev && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1f1b3a] p-8 rounded-2xl text-white max-w-md w-full text-center relative shadow-lg border border-cyan-500">
            <button
              onClick={() => setSelectedDev(null)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1"
            >
              ✕
            </button>
            <img 
              src={selectedDev.image} 
              alt={selectedDev.name} 
              className="w-24 h-24 rounded-full border-4 border-purple-500 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">{selectedDev.name}</h3>
            <p className="text-sm text-gray-300 mb-1">{selectedDev.role}</p>
            <p className="text-gray-400">{selectedDev.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPanel;
