import React from 'react';
import { ImStatsBars } from 'react-icons/im';

const Toolbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-slate-900 shadow">
      <div className="container max-w-6xl px-6 py-6 my-0 mx-auto">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 transition-all duration-100 hover:scale-105 cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="text-3xl">Finance Tracker</span>
          </div>

          <div>
            <a href="#stats">
              <ImStatsBars className="text-2xl transition-all duration-100 hover:scale-110 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
