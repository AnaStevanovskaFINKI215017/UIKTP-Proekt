import React, { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            {type === "success" ? <CheckCircle size={24} /> : <XCircle size={24} />}
            <p>{message}</p>
        </div>
    );
};

export default Notification;
