
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: 'border-green-100 bg-white',
    error: 'border-red-100 bg-white',
    info: 'border-blue-100 bg-white',
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center space-x-4 p-4 pr-6 rounded-2xl border-2 shadow-2xl animate-in slide-in-from-right-10 duration-500 ${colors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-black text-slate-800 tracking-tight">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
        <X className="w-4 h-4 text-slate-300" />
      </button>
    </div>
  );
};

export default Toast;
