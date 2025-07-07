
import { Heart, MessageCircle, Share } from "lucide-react";

const UserPost = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
          <span className="text-teal-700 font-medium text-sm">AC</span>
        </div>
        <div>
          <div className="font-medium text-gray-900">alex_creates</div>
          <div className="text-gray-500 text-sm">@alex_creates</div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">
        Just finished my first pottery class! There's something so therapeutic about working with clay. The imperfections make it beautiful. 🏺
      </p>
      
      <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </div>
          <div className="text-gray-500 text-sm">pottery creation photo</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span className="text-sm">24</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">8</span>
        </div>
        <div className="flex items-center gap-1">
          <Share className="w-4 h-4" />
          <span className="text-sm">3</span>
        </div>
        <span className="text-sm text-gray-400 ml-auto">2 hours ago</span>
      </div>
    </div>
  );
};

export default UserPost;
