import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen fixed bg-[#302E2B] pt-20 pb-10 px-4 h-[100vh]">
      <div className=" mx-auto bg-gray-800 rounded-lg shadow-lg p-8 h-full md:w-screen">
        <h1 className="text-4xl font-bold text-amber-500 mb-6 text-center">About CheckGate</h1>
        
        <div className="space-y-10 text-white ">
          <section className=''>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Our Mission</h2>
            <p className="text-lg">
              CheckGate aims to bring the classic game of checkers to the digital world with a modern, 
              user-friendly interface. Our goal is to provide an enjoyable gaming experience for players 
              of all skill levels, whether you&apos;re a beginner learning the rules or an experienced player 
              looking for a challenge.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Play against friends in offline mode</li>
              <li>Challenge our AI with adjustable difficulty levels</li>
              <li>Intuitive user interface with visual move indicators</li>
              <li>King promotion and multi-capture moves</li>
              <li>Game statistics tracking</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Technology</h2>
            <p className="text-lg">
              CheckGate is built using modern web technologies including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>React for the frontend user interface</li>
              <li>Tailwind CSS for styling</li>
              <li>JavaScript for game logic</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Future Plans</h2>
            <p className="text-lg">
              We&apos;re constantly working to improve CheckGate. Some features we plan to add in the future include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Online multiplayer with matchmaking</li>
              <li>User accounts with game history and statistics</li>
              <li>Tournaments and leaderboards</li>
              <li>Mobile app versions for iOS and Android</li>
              <li>Additional game variants and rule customization</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Contact Us</h2>
            <p className="text-lg">
              Have questions, suggestions, or feedback? We&apos;d love to hear from you! 
              Contact us at <a href="mailto:info@checkgate.com" className="text-amber-400 hover:underline">info@checkgate.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 