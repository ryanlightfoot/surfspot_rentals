import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- DATA: Shops & Boards ---

const SHOPS = [
  {
    id: 1,
    name: "J-Bay Surf Co.",
    location: "Jeffreys Bay",
    coords: [-34.0333, 24.9167],
    desc: "Premium gear right on the point. Best selection for Supertubes.",
    image: "https://placehold.co/600x400?text=J-Bay+Surf+Co."
  },
  {
    id: 2,
    name: "Muizenberg Stoke",
    location: "Muizenberg",
    coords: [-34.1098, 18.4716],
    desc: "The friendly local surf shop. Longboards, foamies, and coffee.",
    image: "https://placehold.co/600x400?text=Muizenberg+Stoke"
  },
  {
    id: 3,
    name: "Durban Surf HQ",
    location: "Durban",
    coords: [-29.8587, 31.0218],
    desc: "City surfing at its finest. High performance rentals.",
    image: "https://placehold.co/600x400?text=Durban+Surf+HQ"
  },
  {
    id: 4,
    name: "West Coast Soul",
    location: "Melkbosstrand",
    coords: [-33.7252, 18.4475],
    desc: "Escaping the crowds? We have the board for you.",
    image: "https://placehold.co/600x400?text=West+Coast+Soul"
  },
  {
    id: 5,
    name: "Raglan Surf Emporium",
    location: "Raglan, NZ",
    coords: [-37.8213, 174.8080],
    desc: "Legendary left-hand breaks require legendary boards.",
    image: "https://placehold.co/600x400?text=Raglan+Surf+Emporium"
  },
  {
    id: 6,
    name: "Piha Surf School",
    location: "Piha, NZ",
    coords: [-36.9565, 174.4646],
    desc: "Black sand beaches and wild waves. We have you covered.",
    image: "https://placehold.co/600x400?text=Piha+Surf+School"
  },
  {
    id: 7,
    name: "The Mount Surf Shop",
    location: "Mount Maunganui, NZ",
    coords: [-37.6321, 176.1822],
    desc: "Catch a wave at the main beach or cruise the harbor.",
    image: "https://placehold.co/600x400?text=The+Mount+Surf+Shop"
  }
];

const BOARDS = [
  {
    id: 1,
    shopId: 1,
    name: "The Piranha",
    type: "Shortboard",
    length: "5'7\"",
    volume: "27L",
    location: "J-Bay - Main Beach",
    coords: [-34.0333, 24.9167],
    price: 150,
    image: "https://placehold.co/600x400?text=The+Piranha",
    desc: "A snappy shortboard perfect for the fast walls of J-Bay."
  },
  {
    id: 2,
    shopId: 2,
    name: "The Cruiser",
    type: "Longboard",
    length: "9'0\"",
    volume: "80L",
    location: "Muizenberg - Corner",
    coords: [-34.1098, 18.4716],
    price: 250,
    image: "https://placehold.co/600x400?text=The+Cruiser",
    desc: "Classic noserider for those small, clean days."
  },
  {
    id: 3,
    shopId: 3,
    name: "The Fish",
    type: "Twin Fin",
    length: "5'10\"",
    volume: "32L",
    location: "Durban - North Beach",
    coords: [-29.8587, 31.0218],
    price: 180,
    image: "https://placehold.co/600x400?text=The+Fish",
    desc: "Fast, loose, and incredibly fun in small to medium surf."
  },
  {
    id: 4,
    shopId: 4,
    name: "The Fun",
    type: "Funboard",
    length: "7'2\"",
    volume: "45L",
    location: "Melkbosstrand",
    coords: [-33.7252, 18.4475],
    price: 200,
    image: "https://placehold.co/600x400?text=The+Fun",
    desc: "The perfect transition board or for those lazy days."
  },
  {
    id: 5,
    shopId: 1,
    name: "The Grom",
    type: "Shortboard",
    length: "5'4\"",
    volume: "24L",
    location: "J-Bay - Kitchen Windows",
    coords: [-34.0433, 24.9267],
    price: 140,
    image: "https://placehold.co/600x400?text=The+Grom",
    desc: "High performance scaled down for the groms."
  },
  {
    id: 6,
    shopId: 5,
    name: "Raglan Ripper",
    type: "Shortboard",
    length: "6'0\"",
    volume: "29L",
    location: "Raglan - Manu Bay",
    coords: [-37.8213, 174.8080],
    price: 160,
    image: "https://placehold.co/600x400?text=Raglan+Ripper",
    desc: "Designed for the endless lefts of Manu Bay."
  },
  {
    id: 7,
    shopId: 5,
    name: "Manu Bay Master",
    type: "Fish",
    length: "5'8\"",
    volume: "34L",
    location: "Raglan - Ngarunui Beach",
    coords: [-37.8093, 174.8329],
    price: 170,
    image: "https://placehold.co/600x400?text=Manu+Bay+Master",
    desc: "Fast and flowy for the perfect line."
  },
  {
    id: 8,
    shopId: 6,
    name: "Lion Rock Logger",
    type: "Longboard",
    length: "9'4\"",
    volume: "85L",
    location: "Piha - South",
    coords: [-36.9565, 174.4646],
    price: 220,
    image: "https://placehold.co/600x400?text=Lion+Rock+Logger",
    desc: "Stable noserider for the small days at Piha."
  },
  {
    id: 9,
    shopId: 6,
    name: "West Coast Gun",
    type: "Gun",
    length: "7'6\"",
    volume: "50L",
    location: "Piha - North",
    coords: [-36.9465, 174.4646],
    price: 280,
    image: "https://placehold.co/600x400?text=West+Coast+Gun",
    desc: "For when the swell really picks up."
  },
  {
    id: 10,
    shopId: 7,
    name: "Mount Main",
    type: "Funboard",
    length: "7'0\"",
    volume: "48L",
    location: "Mount Maunganui - Main Beach",
    coords: [-37.6321, 176.1822],
    price: 190,
    image: "https://placehold.co/600x400?text=Mount+Main",
    desc: "The ultimate all-rounder for The Mount."
  }
];

// --- COMPONENTS ---

// 1. Navigation Bar
const Navbar = ({ setPage, darkMode, setDarkMode, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-[2000] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <span className="nav-brand font-bold text-primary">QuiverPass</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="desktop-menu items-center space-x-8">
            {/* Home link removed */}
            <button onClick={() => setPage('map')} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Find Boards</button>
            <button onClick={() => setPage('shops')} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Shops</button>
            <button onClick={() => setPage('catalog')} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">All Boards</button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Hi, {user.name}</span>
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setPage('auth')}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center mobile-menu-button gap-2">
             {/* Mobile Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu border-t border-gray-200 dark:border-gray-700 py-2 bg-white dark:bg-gray-900">
            <button onClick={() => { setPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-gray-800 hover:text-primary font-medium">Home</button>
            <button onClick={() => { setPage('map'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-gray-800 hover:text-primary font-medium">Find Boards</button>
            <button onClick={() => { setPage('shops'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-gray-800 hover:text-primary font-medium">Shops</button>
            <button onClick={() => { setPage('catalog'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-gray-800 hover:text-primary font-medium">All Boards</button>
            {user ? (
               <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 font-medium">Log Out</button>
            ) : (
               <button onClick={() => { setPage('auth'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-primary font-medium">Sign In</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// 2. Hero Section (Home)
const Home = ({ setPage }) => (
  <div className="hero-section relative bg-primary-dark flex items-center justify-center text-center px-4">
    <div className="absolute inset-0 overflow-hidden">
      <img 
        src="https://placehold.co/1920x600?text=QuiverPass+Hero" 
        alt="Surfing" 
        className="w-full h-full object-cover opacity-50"
      />
    </div>
    <div className="relative z-10 max-w-3xl px-4">
      <h1 className="hero-title font-extrabold text-white tracking-tight">
        Catch the Perfect Wave.<br/>Rent Your Board Today.
      </h1>
      <p className="hero-subtitle text-gray-200">
        Hassle-free surfboard rentals located right at your favorite breaks.
      </p>
      <div className="hero-buttons">
        <button 
          onClick={() => setPage('map')}
          className="hero-button bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition duration-300"
        >
          View Map
        </button>
        <button 
          onClick={() => setPage('shops')}
          className="hero-button bg-white hover:bg-gray-100 text-primary font-bold rounded-full transition duration-300"
        >
          Browse Shops
        </button>
      </div>
    </div>
  </div>
);

// 3. Map View
const MapView = ({ onSelectBoard }) => {
  const [activeShopId, setActiveShopId] = useState(null);
  
  // Center to show both South Africa and New Zealand (Indian Ocean view)
  const center = [-35, 100];
  const zoom = 3;

  const activeShop = activeShopId ? SHOPS.find(s => s.id === activeShopId) : null;
  const filteredBoards = activeShopId 
    ? BOARDS.filter(b => b.shopId === activeShopId) 
    : []; // Or show all boards initially? User said "see all the boards that shop offers" so initially maybe filtered or instructions.

  return (
    <div className="map-view-wrapper flex flex-col md:flex-row">
      {/* Left: Interactive Map */}
      <div className="w-full md:w-2/3 map-container relative z-0">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%", minHeight: "400px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {SHOPS.map((shop) => (
            <Marker 
              key={shop.id} 
              position={shop.coords}
              eventHandlers={{
                click: () => setActiveShopId(shop.id),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-gray-800">{shop.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{shop.location}</p>
                  <p className="text-xs">{shop.desc}</p>
                  <button 
                    onClick={() => setActiveShopId(shop.id)}
                    className="mt-2 text-primary font-bold hover:underline text-xs"
                  >
                    View Boards Here
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right: Sidebar List */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 overflow-y-auto z-10 shadow-xl map-sidebar transition-colors duration-300">
        <div className="map-sidebar-header border-b border-gray-200 dark:border-gray-700 bg-canvas dark:bg-gray-900 transition-colors duration-300">
          <h2 className="map-sidebar-title font-bold text-gray-800 dark:text-white mb-1">
            {activeShop ? activeShop.name : "Select a Shop"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activeShop ? `Boards available in ${activeShop.location}` : "Click a pin on the map to see available boards."}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {!activeShop && (
             <div className="text-center py-10 text-gray-400 dark:text-gray-500">
               <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               <p>Zoom in and select a shop marker to view inventory.</p>
             </div>
          )}

          {activeShop && filteredBoards.length === 0 && (
             <div className="text-center py-10 text-gray-400 dark:text-gray-500">
               <p>No boards currently listed for this shop.</p>
             </div>
          )}

          {filteredBoards.map((board) => (
            <div key={board.id} className="board-list-item flex border dark:border-gray-700 rounded-lg hover:shadow-md transition cursor-pointer" onClick={() => onSelectBoard(board)}>
              <img src={board.image} alt={board.name} className="board-list-image object-cover rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="board-list-title font-bold text-gray-800 dark:text-white truncate">{board.name}</h3>
                <p className="board-list-location text-gray-500 dark:text-gray-400 truncate">{board.location}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-300">
                  <span className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{board.length}</span>
                  <span className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{board.volume}</span>
                </div>
                <p className="board-list-price text-primary font-bold mt-1">R{board.price} / day</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// 4. Vendors List (Shops Page)
const VendorsList = ({ onSelectShop }) => (
  <div className="vendors-section max-w-7xl mx-auto px-4">
    <h2 className="vendors-title font-bold text-gray-900 dark:text-white">Our Rental Partners</h2>
    <p className="vendors-subtitle text-gray-600 dark:text-gray-400">Browse our network of premium surf shops across the coast.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {SHOPS.map((shop) => (
        <div key={shop.id} className="shop-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer" onClick={() => onSelectShop(shop)}>
           <div className="shop-card-image relative">
             <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover" />
           </div>
           <div className="shop-card-content flex flex-col justify-center">
             <h3 className="shop-card-title font-bold text-gray-900 dark:text-white mb-2">{shop.name}</h3>
             <p className="text-primary font-medium mb-3">{shop.location}</p>
             <p className="shop-card-desc text-gray-500 dark:text-gray-400 mb-6">{shop.desc}</p>
             <button className="shop-card-button bg-secondary text-white rounded-lg font-bold self-start hover:bg-secondary-dark transition">
               View Boards →
             </button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

// 5. Shop Detail Page
const ShopDetail = ({ shop, onSelectBoard, onBack }) => {
  const shopBoards = BOARDS.filter(b => b.shopId === shop.id);

  return (
    <div className="shop-detail-section max-w-7xl mx-auto px-4">
      <button onClick={onBack} className="shop-detail-back flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium">
        ← Back to Shops
      </button>

      {/* Shop Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="shop-header-image relative">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="shop-header-title font-bold">{shop.name}</h1>
              <p className="shop-header-location opacity-90">{shop.location}</p>
            </div>
          </div>
        </div>
        <div className="shop-header-content">
          <p className="shop-header-desc text-gray-600 dark:text-gray-300">{shop.desc}</p>
        </div>
      </div>

      <h2 className="shop-boards-title font-bold text-gray-900 dark:text-white">Available Surfboards at {shop.name}</h2>
      
      {shopBoards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopBoards.map((board) => (
            <BoardCard key={board.id} board={board} onSelect={() => onSelectBoard(board)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-canvas dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          No boards currently available at this shop.
        </div>
      )}
    </div>
  );
};

// Helper: Reusable Board Card
const BoardCard = ({ board, onSelect }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
    <div className="board-card-image overflow-hidden relative">
      <img src={board.image} alt={board.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
      <div className="board-card-type absolute bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full font-bold text-gray-800 dark:text-white">
        {board.type}
      </div>
    </div>
    <div className="board-card-content flex-1 flex flex-col">
      <h3 className="board-card-title font-bold text-gray-900 dark:text-white mb-2">{board.name}</h3>
      <p className="board-card-location text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <span className="truncate">{board.location}</span>
      </p>
      
      <div className="board-card-specs grid grid-cols-2">
        <div className="text-center p-2 bg-canvas dark:bg-gray-700 rounded-lg">
          <span className="block text-xs text-gray-400 dark:text-gray-400 uppercase">Length</span>
          <span className="board-card-spec-value font-mono font-bold text-gray-800 dark:text-gray-200">{board.length}</span>
        </div>
        <div className="text-center p-2 bg-canvas dark:bg-gray-700 rounded-lg">
          <span className="block text-xs text-gray-400 dark:text-gray-400 uppercase">Volume</span>
          <span className="board-card-spec-value font-mono font-bold text-gray-800 dark:text-gray-200">{board.volume}</span>
        </div>
      </div>

      <div className="board-card-actions mt-auto">
        <span className="board-card-price font-bold text-primary">R{board.price}<span className="board-card-price-unit text-gray-400 font-normal">/day</span></span>
        <button 
          onClick={onSelect}
          className="board-card-button bg-secondary text-white rounded-lg hover:bg-secondary-dark transition"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

// 6. Catalog View (Grid) - Updated to use BoardCard
const Catalog = ({ onSelectBoard }) => {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Extract unique cities from SHOPS
  const cities = ['All', ...new Set(SHOPS.map(shop => shop.location))];
  
  // Extract unique types from BOARDS
  const types = ['All', ...new Set(BOARDS.map(board => board.type))];

  // Filter Logic
  const filteredBoards = BOARDS.filter(board => {
    // 1. City Filter
    // Find the shop for this board
    const shop = SHOPS.find(s => s.id === board.shopId);
    const matchesCity = selectedCity === 'All' || (shop && shop.location === selectedCity);

    // 2. Type Filter
    const matchesType = selectedType === 'All' || board.type === selectedType;

    return matchesCity && matchesType;
  });

  return (
    <div className="catalog-section max-w-7xl mx-auto px-4">
      <div className="catalog-header flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="catalog-title font-bold text-gray-900 dark:text-white">All Surfboards</h2>
        
        {/* Filters */}
        <div className="catalog-filters">
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="catalog-filter border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
            ))}
          </select>

          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="catalog-filter border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {types.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All Board Types' : type}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredBoards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} onSelect={() => onSelectBoard(board)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-canvas dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <p className="text-xl text-gray-500 dark:text-gray-400">No boards found matching your filters.</p>
           <button 
             onClick={() => {setSelectedCity('All'); setSelectedType('All');}}
             className="mt-4 text-primary font-medium hover:underline"
           >
             Clear Filters
           </button>
        </div>
      )}
    </div>
  );
};

// 7. Authentication Page (Login & Register)
const AuthPage = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('quiverpass_users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = user;
        onLogin(userWithoutPassword);
        onBack();
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Register logic
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('quiverpass_users') || '[]');
      if (users.find(u => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password // In production, this should be hashed
      };

      users.push(newUser);
      localStorage.setItem('quiverpass_users', JSON.stringify(users));
      
      // Auto login after registration (remove password before storing)
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('quiverpass_current_user', JSON.stringify(userWithoutPassword));
      onLogin(userWithoutPassword);
      onBack();
    }
  };

  return (
    <div className="auth-section max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Sign in to rent a board' 
              : 'Create an account to get started'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition shadow-lg"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }}
            className="text-primary hover:text-primary-dark font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Product Page (Detail + Calendar)
const ProductPage = ({ board, onBack, user, onRequireAuth }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  
  // Simple Mock Calendar Generation
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const bookedDays = [3, 4, 15, 16, 17]; // Mock booked data

  const toggleDate = (day) => {
    if (bookedDays.includes(day)) return;
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(d => d !== day));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const totalCost = selectedDates.length * board.price;

  const handleReserve = () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    
    if (selectedDates.length === 0) {
      alert('Please select at least one date');
      return;
    }

    // Here you would normally send the reservation to a backend
    alert(`Reservation successful! You've reserved ${board.name} for ${selectedDates.length} day(s). Total: R${totalCost}`);
    // Clear selected dates after successful reservation
    setSelectedDates([]);
  };

  return (
    <div className="product-section max-w-7xl mx-auto px-4">
      <button onClick={onBack} className="product-back flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white">
        ← Back to Previous Page
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images & Specs */}
        <div>
          <img src={board.image} alt={board.name} className="product-main-image w-full object-cover rounded-xl shadow-lg" />
          <div className="product-thumbnails grid grid-cols-3">
            <img src={board.image} className="product-thumbnail w-full object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
            <img src={board.image} className="product-thumbnail w-full object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
            <img src={board.image} className="product-thumbnail w-full object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
          </div>
          
          <h1 className="product-title font-bold text-gray-900 dark:text-white">{board.name}</h1>
          <p className="product-desc text-gray-500 dark:text-gray-400">{board.desc}</p>
          
          <div className="product-specs bg-canvas dark:bg-gray-800 rounded-xl">
            <h3 className="product-specs-title font-bold text-gray-900 dark:text-white">Technical Specifications</h3>
            <ul className="product-specs-list space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>Type</span> <span className="font-medium">{board.type}</span></li>
              <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>Length</span> <span className="font-mono font-medium">{board.length}</span></li>
              <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>Volume</span> <span className="font-mono font-medium">{board.volume}</span></li>
              <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>Pickup Location</span> <span className="font-medium text-primary text-right break-words">{board.location}</span></li>
            </ul>
          </div>
        </div>

        {/* Right: Booking Module */}
        <div className="booking-module bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl h-fit sticky top-24">
          <div className="flex justify-between items-end mb-6">
             <div>
                <p className="text-gray-500 dark:text-gray-400">Daily Rate</p>
                <p className="booking-price font-bold text-primary">R{board.price}</p>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-green-600">Available Now</p>
             </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Rental Dates</label>
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              <span className="text-gray-400">M</span><span className="text-gray-400">T</span><span className="text-gray-400">W</span>
              <span className="text-gray-400">T</span><span className="text-gray-400">F</span><span className="text-gray-400">S</span>
              <span className="text-gray-400">S</span>
            </div>
            {!user && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Please sign in to select dates
                </p>
              </div>
            )}
            <div className="booking-calendar-days grid grid-cols-7">
              {days.map(day => {
                const isBooked = bookedDays.includes(day);
                const isSelected = selectedDates.includes(day);
                const isDisabled = isBooked || !user;
                return (
                  <button
                    key={day}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!user) {
                        onRequireAuth();
                        return;
                      }
                      toggleDate(day);
                    }}
                    className={`
                      booking-day aspect-square rounded-md flex items-center justify-center font-medium transition
                      ${isBooked ? 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''}
                      ${!user && !isBooked ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : ''}
                      ${isSelected ? 'bg-primary text-white' : ''}
                      ${!isBooked && user && !isSelected ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-primary-light dark:hover:bg-gray-600 text-gray-700 dark:text-white' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div> Available</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 dark:bg-gray-900 rounded"></div> Booked</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded"></div> Selected</span>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6 space-y-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Days Selected</span>
              <span>{selectedDates.length} days</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>R{totalCost}</span>
            </div>
            {!user && (
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Sign in required:</strong> You must be logged in to reserve a board.
                </p>
              </div>
            )}
            <button 
              onClick={handleReserve}
              disabled={!user}
              className={`w-full font-bold py-3 rounded-lg transition shadow-lg ${
                user 
                  ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer' 
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {user ? 'Reserve Board' : 'Sign In to Reserve'}
            </button>
            <p className="text-xs text-center text-gray-400">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. Footer
const Footer = () => (
  <footer className="bg-primary-dark text-white py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">QuiverPass</h2>
      <div className="flex justify-center space-x-6 mb-8 text-gray-400">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Contact Us</span>
      </div>
      <p className="text-gray-500">© 2025 QuiverPass. All rights reserved.</p>
    </div>
  </footer>
);

// --- MAIN APP ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [previousPage, setPreviousPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('quiverpass_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem('quiverpass_current_user');
      }
    }
  }, []);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('quiverpass_current_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('quiverpass_current_user');
    if (currentPage === 'product') {
      setCurrentPage(previousPage);
    }
  };

  const handleRequireAuth = () => {
    setPreviousPage(currentPage);
    setCurrentPage('auth');
  };

  // Router Logic
  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
    setPreviousPage(currentPage);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    setCurrentPage('shop-detail');
    window.scrollTo(0, 0);
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home setPage={setCurrentPage} />;
      case 'map':
        return <MapView onSelectBoard={handleSelectBoard} />;
      case 'shops':
        return <VendorsList onSelectShop={handleSelectShop} />;
      case 'shop-detail':
        return <ShopDetail shop={selectedShop} onSelectBoard={handleSelectBoard} onBack={() => setCurrentPage('shops')} />;
      case 'catalog':
        return <Catalog onSelectBoard={handleSelectBoard} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage(previousPage)} />;
      case 'product':
        return (
          <ProductPage 
            board={selectedBoard} 
            onBack={() => setCurrentPage(previousPage === 'shop-detail' ? 'shop-detail' : previousPage === 'map' ? 'map' : 'catalog')} 
            user={user}
            onRequireAuth={handleRequireAuth}
          />
        );
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar 
        setPage={setCurrentPage} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user}
        onLogout={handleLogout}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}
