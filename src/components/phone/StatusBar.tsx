import React, { useState, useEffect } from "react";
import { BatteryIcon, WifiIcon, SignalLowIcon } from "lucide-react";

const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-row top-0 left-0 w-full justify-between items-center px-16 py-10 text-3xl font-extrabold text-white">
      <span className="pl-2 pt-2">{time}</span>
      <div className="flex items-center gap-4 ">
        <SignalLowIcon size={42} />
        <WifiIcon size={42} />
        <BatteryIcon fill="white" size={48} />
      </div>
    </div>
  );
};

export default StatusBar;
