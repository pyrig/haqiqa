import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import UserPost from "@/components/UserPost";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-medium text-gray-900 mb-6 leading-tight">
              sharing made simple.
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Postsy is a thoughtful social platform designed for meaningful connections and authentic expression in a supportive online community.
            </p>
            <div className="flex gap-4 relative">
              <div className="relative">
                <img 
                  src="/lovable-uploads/e3ba89ef-d82e-42be-abc9-779381073154.png" 
                  alt="Mouse mascot" 
                  className="absolute -top-8 -right-2 w-8 h-8 z-10"
                />
                <Link to="/signup">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-base">
                    join postsy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-teal-300 rounded-full opacity-60"></div>
            <div className="absolute top-20 left-0 w-8 h-8 bg-teal-400 rounded-full opacity-40"></div>
            <UserPost />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700">authentic community</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700">meaningful connections</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700">safe space</span>
          </div>
        </div>
      </div>
      
      {/* Why Choose Postsy Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-medium text-gray-900 mb-4">
            why choose postsy?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for genuine connections and authentic sharing in a supportive community environment.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-12">
          <FeatureCard
            icon={<div className="w-8 h-8 bg-teal-500 rounded-full"></div>}
            title="creative expression"
            description="Share your art, thoughts, and creativity with a community that values authenticity."
          />
          <FeatureCard
            icon={<div className="w-8 h-8 bg-teal-500 rounded-full"></div>}
            title="genuine connections"
            description="Build meaningful relationships with people who share your interests and values."
          />
          <FeatureCard
            icon={<div className="w-8 h-8 bg-teal-500 rounded-full"></div>}
            title="mindful community"
            description="Experience social media that prioritizes mental health and positive interactions."
          />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-teal-500 mx-8 rounded-2xl mb-20">
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <h2 className="text-3xl font-medium text-white mb-4">
            ready to join the conversation?
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Start sharing your story and connecting with others who value authentic expression.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-teal-500 hover:bg-gray-50 px-8 py-3 rounded-lg text-base font-medium">
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
