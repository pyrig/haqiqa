
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-white">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/d225d4da-e13c-4a15-8645-7814497a20ff.png" 
          alt="Postsy Logo" 
          className="h-8"
        />
      </div>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="text-gray-600 hover:text-gray-800 px-4 py-2">
            log in
          </button>
        </Link>
        <Link to="/signup">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg">
            sign up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
