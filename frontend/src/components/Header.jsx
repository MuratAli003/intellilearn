import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
            IntelliLearn
          </Link>
          <nav className="flex gap-4">
            <Link 
              to="/" 
              className="hover:text-gray-300 transition-colors px-3 py-2 rounded"
            >
              Yükle
            </Link>
            <Link 
              to="/notes" 
              className="hover:text-gray-300 transition-colors px-3 py-2 rounded"
            >
              Notlar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

