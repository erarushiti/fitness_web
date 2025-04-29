const Header: React.FC = () => {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <i className="fas fa-user-circle text-2xl"></i>
            <span>Admin User</span>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;