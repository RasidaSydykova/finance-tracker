import React from 'react';
import { ImStatsBars } from 'react-icons/im';

const Toolbar = () => {
  return (
    <header>
      <div className="container max-w-6xl px-6 py-6 my-0 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img
                className="object-cover w-full h-full"
                src="data:image/jpeg;base64,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"
                alt="Profile image"
              />
            </div>
            <small>Hi, User </small>
          </div>

          <nav className="flex items-center gap-2">
            <div>
              <ImStatsBars className="text-2xl" />
            </div>
            <div>
              <button className="log-out-button">Log out</button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
