import h from "hyperscript";

export default function buildNPUCard(npu) {
  return (
    <div className="py-3 flex justify-between">
      <div classname="w-full flex items-center justify-left">
        Neighborhood Planning Unit: {npu}
      </div>
    </div>
  );
}
