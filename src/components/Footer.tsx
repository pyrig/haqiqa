const Footer = () => {
  return (
    <footer className="bg-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/24441693-0248-4339-9e32-08a834c45d4e.png" 
                alt="Postsy Logo" 
                className="h-8"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Authentic sharing for meaningful connections.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-800">about</a></li>
              <li><a href="#" className="hover:text-gray-800">blog</a></li>
              <li><a href="#" className="hover:text-gray-800">careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-800">help center</a></li>
              <li><a href="#" className="hover:text-gray-800">community</a></li>
              <li><a href="#" className="hover:text-gray-800">contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          © 2025 Postsy, LLC.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
