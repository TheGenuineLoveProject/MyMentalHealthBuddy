import { useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    { icon: "fas fa-tachometer-alt", label: "Dashboard", path: "/" },
    { icon: "fas fa-server", label: "Services", path: "/services" },
    { icon: "fas fa-plug", label: "API Endpoints", path: "/endpoints" },
    { icon: "fas fa-folder-tree", label: "Project Structure", path: "/structure" },
    { icon: "fas fa-box", label: "Packages", path: "/packages" },
    { icon: "fas fa-terminal", label: "Scripts", path: "/scripts" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Project Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm"></i>
          </div>
          <div>
            <h1 className="font-semibold text-lg" data-testid="project-name">
              My Node.js App
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm" data-testid="project-status">
                Running
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location === item.path 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-2">
          <button 
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            data-testid="button-start-services"
          >
            <i className="fas fa-play"></i>
            <span>Start All Services</span>
          </button>
          <button 
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            data-testid="button-stop-services"
          >
            <i className="fas fa-stop"></i>
            <span>Stop All Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}
