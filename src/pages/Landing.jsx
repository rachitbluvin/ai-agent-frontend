import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Builder</h1>
          <div className="flex gap-3">
            <Link to="/login" className="text-gray-700 hover:text-black px-3 py-2">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Build modern websites with AI
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Describe what you want and generate a component-based experience instantly.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Building</Link>
              <Link to="/login" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black">Sign In</Link>
            </div>
          </div>
        </section>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h3 className="text-2xl font-bold text-center">Highlights</h3>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 'Components', 'Sections', 'Projects', 'Extensible' ].map((t) => (
                <div key={t} className="rounded-lg bg-gray-50 p-6 border">
                  <div className="text-lg font-semibold">{t}</div>
                  <div className="mt-2 text-gray-600">AI assembles modern UI blocks.</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Scrollable Showcase</h3>
                <p className="text-gray-600">Explore multiple sections and previews.</p>
              </div>
              <div className="rounded-lg bg-white border h-48" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg bg-white border h-48" />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Modern Design</h3>
                <p className="text-gray-600">Styled with Tailwind for clean visuals.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Ready to Extend</h3>
                <p className="text-gray-600">Plug real LLMs and grow capabilities.</p>
              </div>
              <div className="rounded-lg bg-white border h-48" />
            </div>
          </div>
        </section>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h3 className="text-2xl font-bold">Start now</h3>
            <p className="mt-2 text-gray-600">Login or create an account to generate your first project.</p>
            <div className="mt-6">
              <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">Get Started</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
