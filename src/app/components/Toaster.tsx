"use client";
import { useEffect } from "react";
import { MailWarning, CheckCircle, XCircle } from "lucide-react";

type ToasterProps = {
  message: string;
  variant?: "success" | "error" | "warning"; // only 3 allowed
  onClose: () => void; // callback to remove toaster
};

const variantStyles = {
  success: {
    icon: <CheckCircle className="text-green-600" size={20} />,
    bg: "bg-green-100 border-green-600",
  },
  error: {
    icon: <XCircle className="text-red-600" size={20} />,
    bg: "bg-red-100 border-red-600",
  },
  warning: {
    icon: <MailWarning className="text-yellow-600" size={20} />,
    bg: "bg-yellow-100 border-yellow-600",
  },
};

const Toaster: React.FC<ToasterProps> = ({ message, variant = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = variantStyles[variant];

  return (
    <div
      className={`fixed top-4 right-5 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border transition-all duration-500 transform translate-x-0 opacity-100 animate-slide-in ${styles.bg}`}
    >
      {styles.icon}
      <h1 className="text-black">{message}</h1>
    </div>
  );
};

export default Toaster;
