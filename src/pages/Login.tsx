import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, Home, Bell, Bookmark, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 bg-teal-500 text-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/26ce2a2c-f9cb-4f74-b1ca-3a48f1088384.png" 
                alt="Postsy Logo" 
                className="h-16"
              />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome back!</h2>
          <p className="text-lg mb-12 text-center opacity-90 leading-relaxed">
            Sign in to continue your journey with us and reconnect with your community.
          </p>
          
          <div className="space-y-6">
            <div className="bg-teal-400 bg-opacity-30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Your Feed</h3>
              <p className="text-sm opacity-90 text-center">
                Catch up on posts from people you follow and discover new content
              </p>
            </div>
            
            <div className="bg-teal-400 bg-opacity-30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Notifications</h3>
              <p className="text-sm opacity-90 text-center">
                See who liked, commented, or shared your posts while you were away
              </p>
            </div>
            
            <div className="bg-teal-400 bg-opacity-30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Saved Posts</h3>
              <p className="text-sm opacity-90 text-center">
                Access your saved posts and continue reading where you left off
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Welcome back! Please enter your credentials</p>
            </div>
          </div>
          
          <form className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email or Username</Label>
              <div className="mt-1">
                <Input 
                  id="email" 
                  type="text" 
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="mt-1 relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-500 hover:text-teal-600">
                Forgot password?
              </a>
            </div>
            
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 text-base font-medium">
              Sign In
            </Button>
            
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-teal-500 hover:text-teal-600 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
