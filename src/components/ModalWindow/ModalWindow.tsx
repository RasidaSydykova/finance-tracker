import React from 'react';

interface Props {
  show: boolean;
  onClose: (status: boolean) => void;
  children: React.ReactNode;
}

const ModalWindow: React.FC<Props> = ({ show, onClose, children }) => {
  return (
    <div
      style={{
        transform: show ? 'translateX(0%)' : 'translateX(-200%)',
        top: '-70px',
      }}
      className="absolute left-0 right-0 z-20 w-full h-full transition-all duration-1000"
    >
      <div className="container mx-auto max-w-3xl h-[80vh] rounded-3xl bg-slate-800 px-4 py-6">
        <button
          className="w-10 h-10 mb-4 ms-4 font-bold rounded-full bg-slate-600"
          onClick={() => {
            onClose(false);
          }}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;
