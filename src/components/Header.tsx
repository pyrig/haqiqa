
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-white">
      <div className="text-2xl font-semibold text-gray-900">
        postsy
      </div>
      <div className="flex gap-4">
        <button className="text-gray-600 hover:text-gray-800 px-4 py-2">
          log in
        </button>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg">
          sign up
        </Button>
      </div>
    </header>
  );
};

export default Header;
