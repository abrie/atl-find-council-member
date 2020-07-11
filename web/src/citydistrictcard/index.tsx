import h from "hyperscript";

function tel(str) {
  const numbers = str.replace(/\D/g, "");
  return `tel:+1${numbers}`;
}

function mailto(str) {
  return `mailto:${str}`;
}

export default function buildCityDistrictCard(representative) {
  return (
    <div className="py-3 flex flex-col">
      <div className="pl-3 bg-green-200 text-xl">
        City Council {representative.district}
      </div>

      <div className="p-5 border-2 border-green-200 bg-green-100 w-full flex justify-around items-center">
        <div className="flex flex-col items-center mr-5">
          <div className="">
            <img
              className="w-24"
              src={`https://citycouncil.atlantaga.gov${representative.image}`}
            />
          </div>
          <div className="text-md text-center">
            <a className="text-blue-500 underline" href={representative.href}>
              {representative.name}
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-2 text-sm">
            {representative.contact.office.map((line) => (
              <div>{line}</div>
            ))}
          </div>
          <div className="text-sm">
            {representative.contact.phone.map((line) => (
              <div>
                Phone:{" "}
                <a className="text-blue-500 underline" href={tel(line)}>
                  {line}
                </a>
              </div>
            ))}
          </div>
          <div className="text-sm">
            {representative.contact.fax.map((line) => (
              <div>
                Fax:{" "}
                <a className="text-blue-500 underline" href={tel(line)}>
                  {line}
                </a>
              </div>
            ))}
          </div>
          <div className="text-sm">
            {representative.contact.email.map((line) => (
              <div>
                Email:{" "}
                <a className="text-blue-500 underline" href={mailto(line)}>
                  {line}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
