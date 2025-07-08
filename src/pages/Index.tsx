import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left relative">
            <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 bg-teal-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-10 left-5 sm:left-10 w-8 sm:w-12 h-8 sm:h-12 bg-teal-300 rounded-full opacity-60"></div>
            <div className="absolute top-10 sm:top-20 left-0 w-6 sm:w-8 h-6 sm:h-8 bg-teal-400 rounded-full opacity-40"></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-4 sm:mb-6 leading-tight">
              sharing made simple.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Postsy is a thoughtful social platform designed for meaningful connections and authentic expression in a supportive online community.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <Link to="/signup">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base">
                  join postsy
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/07979572-d885-43c6-99a0-c432278bce45.png" 
                alt="Create New Post Interface" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 mb-8 sm:mb-12">
          <div className="flex items-center gap-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700 text-sm sm:text-base">authentic community</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700 text-sm sm:text-base">meaningful connections</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700 text-sm sm:text-base">safe space</span>
          </div>
        </div>
      </div>
      
      {/* Why Choose Postsy Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            why choose postsy?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Built for genuine connections and authentic sharing in a supportive community environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
          <FeatureCard
            icon={<div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-500 rounded-full"></div>}
            title="creative expression"
            description="Share your art, thoughts, and creativity with a community that values authenticity."
          />
          <FeatureCard
            icon={<div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-500 rounded-full"></div>}
            title="genuine connections"
            description="Build meaningful relationships with people who share your interests and values."
          />
          <FeatureCard
            icon={<div className="w-6 sm:w-8 h-6 sm:h-8 bg-teal-500 rounded-full"></div>}
            title="mindful community"
            description="Experience social media that prioritizes mental health and positive interactions."
          />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-teal-500 mx-4 sm:mx-8 rounded-2xl mb-10 sm:mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4">
            ready to join the conversation?
          </h2>
          <p className="text-base sm:text-lg text-teal-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Start sharing your story and connecting with others who value authentic expression.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-teal-500 hover:bg-gray-50 px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-medium">
              get started today
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
