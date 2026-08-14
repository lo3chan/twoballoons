export function ThoughtsWidget({ thoughts }: { thoughts: string[] }) {
  return (
    <div className="p-4 bg-gray-50 border rounded shadow-sm">
      <h3 className="font-bold mb-2">AI Engine Thoughts</h3>
      {thoughts.length === 0 ? (
        <p className="text-gray-500 italic">No thoughts yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {thoughts.map((thought, i) => (
            <li key={i} className="text-sm">
              {thought}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
