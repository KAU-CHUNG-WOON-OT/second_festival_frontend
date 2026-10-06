import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "afternoon";

export const useTimeOfDay = (): TimeOfDay => {
  const getTime = (): TimeOfDay => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "morning" : "afternoon";
  };

  const [time, setTime] = useState<TimeOfDay>(getTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return time;
};