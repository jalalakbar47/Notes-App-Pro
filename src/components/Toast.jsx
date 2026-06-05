import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };

export default function Toast() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || icons.success;
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={18} />
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
