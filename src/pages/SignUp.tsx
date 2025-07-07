
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 bg-teal-500 text-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/4fcc4fe8-d044-4e52-9023-8395ec6f2d31.png" 
              alt="Postsy Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold mb-4">Postsy</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Join the conversation</h2>
          <p className="text-lg mb-12 opacity-90">
            Share your thoughts, discover amazing content, and connect with like-minded people.
          </p>
          
          <div className="space-y-8">
            <div className="bg-teal-400 bg-opacity-30 rounded-lg p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-sm opacity-90">
                Build meaningful connections with people who share your interests
              </p>
            </div>
            
            <div className="bg-teal-400 bg-opacity-30 rounded-lg p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-sm opacity-90">
                Share your ideas, projects, and creativity with the world
              </p>
            </div>
            
            <div className="bg-teal-400 bg-opacity-30 rounded-lg p-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy</h3>
              <p className="text-sm opacity-90">
                Post anonymously when you want to share without revealing your identity
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Join thousands of creators sharing their stories</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                <Input 
                  id="username" 
                  type="text" 
                  className="pl-8 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Choose a unique username for your profile</p>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="mt-1 relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <div className="mt-1 relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-teal-500 hover:text-teal-600 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-500 hover:text-teal-600 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="updates" className="mt-1" />
                <label htmlFor="updates" className="text-sm text-gray-600">
                  Send me updates about new features and community highlights
                </label>
              </div>
            </div>
            
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 text-base font-medium">
              <span className="mr-2">👤</span>
              Create Account
            </Button>
            
            <div className="text-center">
              <p className="text-gray-500 mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <span className="mr-2 text-red-500">G</span>
                  Google
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <span className="mr-2">🐙</span>
                  GitHub
                </Button>
              </div>
            </div>
            
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-teal-500 hover:text-teal-600 font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
