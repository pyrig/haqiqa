import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Eye, ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkUsername, isChecking, isAvailable, resetCheck } = useUsernameCheck();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.username.trim().length >= 3) {
        checkUsername(formData.username.trim());
      } else {
        resetCheck();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!isAvailable) {
      toast({
        title: "Error",
        description: "Please choose an available username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
            username: formData.username.toLowerCase(),
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUsernameStatus = () => {
    if (formData.username.trim().length === 0) return null;
    if (formData.username.trim().length < 3) return 'too-short';
    if (isChecking) return 'checking';
    if (isAvailable === true) return 'available';
    if (isAvailable === false) return 'taken';
    return null;
  };

  const usernameStatus = getUsernameStatus();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 bg-teal-500 text-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center">
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
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to home
          </Link>
          
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/24441693-0248-4339-9e32-08a834c45d4e.png" 
              alt="Postsy Logo" 
              className="h-16 mx-auto mb-6"
            />
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
              <Input 
                id="name" 
                type="text" 
                className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                <Input 
                  id="username" 
                  type="text" 
                  className={`pl-8 pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
                    usernameStatus === 'available' ? 'border-green-500' :
                    usernameStatus === 'taken' ? 'border-red-500' : ''
                  }`}
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
                {usernameStatus && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {usernameStatus === 'checking' && <Loader2 size={16} className="animate-spin text-gray-400" />}
                    {usernameStatus === 'available' && <Check size={16} className="text-green-500" />}
                    {usernameStatus === 'taken' && <X size={16} className="text-red-500" />}
                  </div>
                )}
              </div>
              <p className={`text-xs mt-1 ${
                usernameStatus === 'too-short' ? 'text-yellow-600' :
                usernameStatus === 'available' ? 'text-green-600' :
                usernameStatus === 'taken' ? 'text-red-600' :
                'text-gray-500'
              }`}>
                {usernameStatus === 'too-short' ? 'Username must be at least 3 characters' :
                 usernameStatus === 'available' ? 'Username is available!' :
                 usernameStatus === 'taken' ? 'Username is already taken' :
                 'Choose a unique username for your profile'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="mt-1 relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
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
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
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
            
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 text-base font-medium"
              disabled={isLoading || !isAvailable}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-500 hover:text-teal-600 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
