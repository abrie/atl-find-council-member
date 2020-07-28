import h from "hyperscript";

export default function buildCandidateList(address, candidates, callback) {
  return (
    <div>
      {candidates.map((candidate) => (
        <div
          className="cursor-pointer truncate text-gray-600 hover:text-black"
          onclick={() => callback(candidate)}
        >
          {candidate.matchedAddress}
        </div>
      ))}
    </div>
  );
}
