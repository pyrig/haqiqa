import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Compass, 
  Bookmark, 
  User, 
  Settings, 
  Image, 
  Code, 
  Tag,
  MessageCircle,
  RotateCcw,
  Share
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-teal-500 text-white px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold">Postsy</span>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        <div className="flex max-w-6xl w-full">
          {/* Left Sidebar */}
          <div className="w-64 bg-white h-screen p-6 border-r">
            <nav className="space-y-4">
              <div className="flex items-center gap-3 text-teal-500 font-medium">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <Compass className="w-5 h-5" />
                <span>Discover</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <Bookmark className="w-5 h-5" />
                <span>Bookmarks</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </nav>

            <div className="mt-12">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Anonymous Mode</h3>
                <p className="text-sm text-gray-600 mb-3">Post without linking to your profile</p>
              </div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                New Post
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl p-6">
            {/* Post Creation */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
              <h2 className="text-lg font-medium mb-4">What's on your mind?</h2>
              <Textarea 
                className="w-full border-gray-200 resize-none mb-4" 
                rows={3}
                placeholder="Share your thoughts..."
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Post
                </Button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {/* Post 1 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-teal-100 text-teal-600">AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">artlover</div>
                    <div className="text-sm text-gray-500">@artlover • 1h ago</div>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4">
                  Just visited the most amazing art exhibition downtown! The use of color and texture was absolutely breathtaking. Here's a quick sketch I made inspired by one of the pieces:
                </p>
                
                <div className="bg-orange-50 rounded-lg p-8 mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 bg-teal-400 rounded-full"></div>
                </div>
                
                <p className="text-gray-800 mb-4">
                  What do you think? I'm trying to incorporate more of these techniques into my own work.
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-teal-600 bg-teal-50">#art</Badge>
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">#inspiration</Badge>
                  <Badge variant="secondary" className="text-purple-600 bg-purple-50">#creative</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Save</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>

              {/* Post 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">codemaster</div>
                    <div className="text-sm text-gray-500">@codemaster • 3h ago</div>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4">
                  Finally solved that tricky algorithm problem I've been stuck on for days! Here's the solution:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                  <div>function findLongestPath(grid) {`{`}</div>
                  <div className="ml-4">const rows = grid.length;</div>
                  <div className="ml-4">const cols = grid[0].length;</div>
                  <div className="ml-4">const dp = Array(rows).fill().map(() =&gt; Array(cols).fill(0));</div>
                  <div className="ml-4 mt-2">dp[0][0] = grid[0][0];</div>
                  <div className="ml-4 mt-2">// Fill first row</div>
                  <div className="ml-4">for (let j = 1; j &lt; cols; j++) {`{`}</div>
                  <div className="ml-8">dp[0][j] = dp[0][j-1] + grid[0][j];</div>
                  <div className="ml-4">{`}`}</div>
                  <div className="ml-4 mt-2">// Fill first column</div>
                  <div className="ml-4">for (let i = 1; i &lt; rows; i++) {`{`}</div>
                  <div className="ml-8">dp[i][0] = dp[i-1][0] + grid[i][0];</div>
                  <div className="ml-4">{`}`}</div>
                  <div className="ml-4 mt-2">// Fill rest of dp table</div>
                  <div className="ml-4">for (let i = 1; i &lt; rows; i++) {`{`}</div>
                  <div className="ml-8">for (let j = 1; j &lt; cols; j++) {`{`}</div>
                  <div className="ml-12">dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]) + grid[i][j];</div>
                  <div className="ml-8">{`}`}</div>
                  <div className="ml-4">{`}`}</div>
                  <div className="ml-4 mt-2">return dp[rows-1][cols-1];</div>
                  <div>{`}`}</div>
                </div>
                
                <p className="text-gray-800 mb-4">
                  Dynamic programming for the win! 🎉
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-green-600 bg-green-50">#programming</Badge>
                  <Badge variant="secondary" className="text-orange-600 bg-orange-50">#algorithms</Badge>
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">#javascript</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Save</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>

              {/* Post 3 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-purple-100 text-purple-600">A</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Anonymous</div>
                    <div className="text-sm text-gray-500">5h ago</div>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4">
                  Sometimes I feel like I'm the only one who still prefers physical books over e-readers. There's something about the feel of paper, the smell of a new book, and the satisfaction of physically turning pages that digital just can't replicate.
                </p>
                
                <p className="text-gray-800 mb-4">
                  Anyone else feel the same way?
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-brown-600 bg-amber-50">#books</Badge>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">#reading</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Save</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6">
            {/* Suggested Users */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-4">Suggested Users</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">TW</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">techwriter</div>
                      <div className="text-xs text-gray-500">@techwriter</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">TB</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">travelbug</div>
                      <div className="text-xs text-gray-500">@travelbug</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-red-100 text-red-600 text-xs">ML</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">musiclover</div>
                      <div className="text-xs text-gray-500">@musiclover</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-4">Trending Tags</h3>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 mr-2 mb-2">#photography</Badge>
                <Badge variant="secondary" className="text-purple-600 bg-purple-50 mr-2 mb-2">#design</Badge>
                <Badge variant="secondary" className="text-green-600 bg-green-50 mr-2 mb-2">#technology</Badge>
                <Badge variant="secondary" className="text-orange-600 bg-orange-50 mr-2 mb-2">#travel</Badge>
                <Badge variant="secondary" className="text-red-600 bg-red-50 mr-2 mb-2">#food</Badge>
                <Badge variant="secondary" className="text-teal-600 bg-teal-50 mr-2 mb-2">#music</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              </div>
              <span className="font-medium">Postsy</span>
              <span className="text-gray-500 text-sm ml-2">Posting, but better.</span>
            </div>
            
            <div className="flex gap-8 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Platform</h4>
                <div className="space-y-1 text-gray-600">
                  <div>About</div>
                  <div>Features</div>
                  <div>Guidelines</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Legal</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Privacy</div>
                  <div>Terms</div>
                  <div>Cookies</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Connect</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Contact</div>
                  <div>Twitter</div>
                  <div>GitHub</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2023 Postsy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
