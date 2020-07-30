import h from "hyperscript";
import type { AddressMatch } from "../geocoder";

export default function buildCandidateList(
  address,
  candidates: AddressMatch[],
  callback: (AddressMatch) => void
) {
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
