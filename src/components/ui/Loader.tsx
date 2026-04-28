import { useEffect, useState } from 'react';

interface LoaderProps { onDone: () => void }

export default function Loader({ onDone }: LoaderProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((prev) => {
        if (prev >= 100) {
          clearInterval(id);
          setTimeout(onDone, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="loader-screen">
      <p>Satyukt Trust Infrastructure</p>
      <h1>{value}%</h1>
    </div>
  );
}
