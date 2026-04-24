import { useState, useEffect } from "react";

interface Props {
  createdAt: number;
}

const OrderTimer = ({ createdAt }: Props) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - createdAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  let colorClass = "text-green-600";
  if (minutes >= 5) colorClass = "text-red-600 font-bold";
  else if (minutes >= 3) colorClass = "text-yellow-600 font-semibold";

  return (
    <span className={`text-sm tabular-nums ${colorClass}`}>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default OrderTimer;
