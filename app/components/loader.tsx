import { LuLoader2 } from "react-icons/lu";

const Loader = () => {
  return (
    <div className="flex grow items-center">
      <LuLoader2 className="animate-spin text-7xl text-green-600" />
    </div>
  );
}

export default Loader;