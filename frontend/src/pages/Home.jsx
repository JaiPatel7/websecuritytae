
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6">
      <h1 className="text-5xl font-bold mb-6">WEB SECURITY TAE</h1>

      <div className="flex gap-4 mb-8">
        <div className="bg-black/30 px-6 py-3 rounded-2xl text-lg">
          Group Number: <b>2</b>
        </div>
        <div className="bg-black/30 px-6 py-3 rounded-2xl text-lg">
          Topic: <b>Secure Session Handling</b>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Group Members</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white text-black p-6 rounded-2xl w-56 shadow-lg">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold mb-3 mx-auto">
            1
          </div>
          <h3 className="font-bold">Rashi Yadav</h3>
          <p>CS22064</p>
        </div>
        <div className="bg-white text-black p-6 rounded-2xl w-56 shadow-lg">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold mb-3 mx-auto">
            2
          </div>
          <h3 className="font-bold">Jai Patel</h3>
          <p>CS22099</p>
        </div>
      </div>
      <div className="absolute bottom-6 flex flex-col items-center z-20">
                <span className="text-xs tracking-widest">SCROLL</span>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center mt-2">
                    <div className="w-1 h-2 bg-white animate-bounce mt-1 rounded-full"></div>
                </div>
            </div>
    </div>
  );
 
}



