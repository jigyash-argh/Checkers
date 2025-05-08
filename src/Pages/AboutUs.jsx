import React from 'react';

const AboutUs = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-[#302E2B] overflow-y-auto pt-20 pb-16">
      <div className="container mx-auto top-20 left-90 absolute max-w-5xl px-4 w-full">
        <div className="rounded-xl shadow-2xl overflow-hidden bg-[#252422] border-2 border-amber-500/30">
          <div className="relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-8 h-full w-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                ))}
              </div>
            </div>

            <div className="relative p-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-amber-500 mb-2">About CheckGate</h1>
              <div className="h-1 w-48 bg-amber-500 mx-auto"></div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8 text-white">
            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Our Mission</h2>
              <p className="text-lg md:text-xl">
                CheckGate aims to bring the classic game of checkers to the digital world with a modern,
                user-friendly interface. Our goal is to provide an enjoyable gaming experience for players
                of all skill levels, whether you&apos;re a beginner learning the rules or an experienced player
                looking for a challenge.
              </p>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Features</h2>
              <ul className="list-none space-y-3 text-lg md:text-xl">
                {[
                  'Play against friends in offline mode',
                  'Challenge our AI with adjustable difficulty levels',
                  'Intuitive user interface with visual move indicators',
                  'King promotion and multi-capture moves',
                  'Online multiplayer with public and private games',
                  'User accounts with authentication and game history',
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-amber-600 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Technology</h2>
              <p className="text-lg md:text-xl mb-4">
                CheckGate is built using modern web technologies including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Frontend',
                    items: ['React 19', 'Tailwind CSS 4', 'Vite 6', 'Axios', 'React Router 7'],
                  },
                  {
                    name: 'Backend',
                    items: ['Node.js', 'Express', 'MongoDB Atlas', 'JWT Authentication', 'Socket.io'],
                  },
                  {
                    name: 'DevOps',
                    items: ['GitHub', 'NPM', 'Concurrently', 'Nodemon', 'ESLint'],
                  },
                ].map((tech, index) => (
                  <div key={index} className="bg-black/30 p-4 rounded-lg">
                    <div className="font-bold text-amber-500 text-xl mb-3 text-center">{tech.name}</div>
                    <ul className="text-gray-300 text-lg space-y-1">
                      {tech.items.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Future Plans</h2>
              <p className="text-lg md:text-xl mb-4">
                We&apos;re constantly working to improve CheckGate. Some features we plan to add in the future include:
              </p>
              <ul className="list-none space-y-3 text-lg md:text-xl">
                {[
                  'Enhanced AI with multiple difficulty levels',
                  'Tournament system with brackets and leaderboards',
                  'In-game chat and social features',
                  'Mobile app versions for iOS and Android',
                  'Additional game variants and rule customization',
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-700 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Developer</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-black/30 p-5 rounded-lg flex-shrink-0 border border-amber-500/30">
                  <div className="w-24 h-24 rounded-full bg-amber-600 flex items-center justify-center text-4xl font-bold text-white mb-3 mx-auto">J</div>
                  <h3 className="text-xl md:text-2xl font-semibold text-amber-400 text-center">Jigyash</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-lg md:text-xl">
                    CheckGate was created by Jigyash as a project to demonstrate web development skills using modern technologies.
                  </p>
                  <p className="text-lg md:text-xl">
                    If you have questions or feedback about this application, please contact me at{' '}
                    <a href="mailto:231030151@juitsolan.in" className="text-amber-400 hover:text-amber-300 underline decoration-dotted underline-offset-4 hover:decoration-solid transition-all">
                      231030151@juitsolan.in
                    </a>.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3">Contact Us</h2>
              <p className="text-lg md:text-xl">
                Have questions, suggestions, or feedback? We&apos;d love to hear from you!
                Contact us at{' '}
                <a href="mailto:info@checkgate.com" className="text-amber-400 hover:text-amber-300 underline decoration-dotted underline-offset-4 hover:decoration-solid transition-all">
                  info@checkgate.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
