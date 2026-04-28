import { useEffect, useState } from 'react';

export default function StatCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 45;
    const id = setInterval(() => {
      frame += 1;
      const next = Math.round((target * frame) / totalFrames);
      setValue(next);
      if (frame >= totalFrames) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [target]);

  return <span>{value}{suffix}</span>;
}
