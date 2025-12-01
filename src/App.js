import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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
const Navbar = ({ setPage }) => (
  <nav className="bg-white shadow-md sticky top-0 z-[2000]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
          <span className="text-2xl font-bold text-blue-600">SurfSpot Rentals</span>
        </div>
        <div className="flex items-center space-x-8">
          <button onClick={() => setPage('home')} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
          <button onClick={() => setPage('map')} className="text-gray-700 hover:text-blue-600 font-medium">Find Boards</button>
          <button onClick={() => setPage('shops')} className="text-gray-700 hover:text-blue-600 font-medium">Shops</button>
          <button onClick={() => setPage('catalog')} className="text-gray-700 hover:text-blue-600 font-medium">All Boards</button>
        </div>
      </div>
    </div>
  </nav>
);

// 2. Hero Section (Home)
const Home = ({ setPage }) => (
  <div className="relative bg-gray-900 h-[600px] flex items-center justify-center text-center px-4">
    <div className="absolute inset-0 overflow-hidden">
      <img 
        src="https://placehold.co/1920x600?text=Surf+Rentals+Hero" 
        alt="Surfing" 
        className="w-full h-full object-cover opacity-50"
      />
    </div>
    <div className="relative z-10 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
        Catch the Perfect Wave.<br/>Rent Your Board Today.
      </h1>
      <p className="text-xl text-gray-200 mb-8">
        Hassle-free surfboard rentals located right at your favorite breaks.
      </p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => setPage('map')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300"
        >
          View Map
        </button>
        <button 
          onClick={() => setPage('shops')}
          className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition duration-300"
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Left: Interactive Map */}
      <div className="w-full md:w-2/3 h-full relative z-0">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
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
                    className="mt-2 text-blue-600 font-bold hover:underline text-xs"
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
      <div className="w-full md:w-1/3 bg-white overflow-y-auto z-10 shadow-xl">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {activeShop ? activeShop.name : "Select a Shop"}
          </h2>
          <p className="text-xs text-gray-500">
            {activeShop ? `Boards available in ${activeShop.location}` : "Click a pin on the map to see available boards."}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {!activeShop && (
             <div className="text-center py-10 text-gray-400">
               <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               <p>Zoom in and select a shop marker to view inventory.</p>
             </div>
          )}

          {activeShop && filteredBoards.length === 0 && (
             <div className="text-center py-10 text-gray-400">
               <p>No boards currently listed for this shop.</p>
             </div>
          )}

          {filteredBoards.map((board) => (
            <div key={board.id} className="flex gap-4 p-3 border rounded-lg hover:shadow-md transition cursor-pointer" onClick={() => onSelectBoard(board)}>
              <img src={board.image} alt={board.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h3 className="font-bold text-gray-800">{board.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{board.location}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                  <span className="bg-gray-100 px-1 rounded">{board.length}</span>
                  <span className="bg-gray-100 px-1 rounded">{board.volume}</span>
                </div>
                <p className="text-blue-600 font-bold mt-1">R{board.price} / day</p>
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
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Rental Partners</h2>
    <p className="text-gray-600 mb-8 text-lg">Browse our network of premium surf shops across the coast.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {SHOPS.map((shop) => (
        <div key={shop.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col md:flex-row h-full md:h-64 cursor-pointer" onClick={() => onSelectShop(shop)}>
           <div className="w-full md:w-1/2 h-64 md:h-full relative">
             <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover" />
           </div>
           <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h3>
             <p className="text-blue-600 font-medium mb-3">{shop.location}</p>
             <p className="text-gray-500 mb-6">{shop.desc}</p>
             <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold self-start hover:bg-gray-800 transition">
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
        ← Back to Shops
      </button>

      {/* Shop Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="h-64 relative">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
              <p className="text-xl opacity-90">{shop.location}</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <p className="text-gray-600 text-lg">{shop.desc}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Surfboards at {shop.name}</h2>
      
      {shopBoards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopBoards.map((board) => (
            <BoardCard key={board.id} board={board} onSelect={() => onSelectBoard(board)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          No boards currently available at this shop.
        </div>
      )}
    </div>
  );
};

// Helper: Reusable Board Card
const BoardCard = ({ board, onSelect }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
    <div className="h-64 overflow-hidden relative">
      <img src={board.image} alt={board.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800">
        {board.type}
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{board.name}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        {board.location}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <span className="block text-xs text-gray-400 uppercase">Length</span>
          <span className="font-mono font-bold text-gray-800">{board.length}</span>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <span className="block text-xs text-gray-400 uppercase">Volume</span>
          <span className="font-mono font-bold text-gray-800">{board.volume}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">R{board.price}<span className="text-sm text-gray-400 font-normal">/day</span></span>
        <button 
          onClick={onSelect}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">All Surfboards</h2>
        
        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
            ))}
          </select>

          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
           <p className="text-xl text-gray-500">No boards found matching your filters.</p>
           <button 
             onClick={() => {setSelectedCity('All'); setSelectedType('All');}}
             className="mt-4 text-blue-600 font-medium hover:underline"
           >
             Clear Filters
           </button>
        </div>
      )}
    </div>
  );
};

// 7. Product Page (Detail + Calendar)
const ProductPage = ({ board, onBack }) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        ← Back to Previous Page
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images & Specs */}
        <div>
          <img src={board.image} alt={board.name} className="w-full h-96 object-cover rounded-xl shadow-lg mb-6" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            <img src={board.image} className="w-full h-24 object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
            <img src={board.image} className="w-full h-24 object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
            <img src={board.image} className="w-full h-24 object-cover rounded-lg opacity-60 hover:opacity-100 cursor-pointer" alt="thumb" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{board.name}</h1>
          <p className="text-gray-500 mb-6">{board.desc}</p>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-4">Technical Specifications</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex justify-between border-b pb-2"><span>Type</span> <span className="font-medium">{board.type}</span></li>
              <li className="flex justify-between border-b pb-2"><span>Length</span> <span className="font-mono font-medium">{board.length}</span></li>
              <li className="flex justify-between border-b pb-2"><span>Volume</span> <span className="font-mono font-medium">{board.volume}</span></li>
              <li className="flex justify-between border-b pb-2"><span>Pickup Location</span> <span className="font-medium text-blue-600">{board.location}</span></li>
            </ul>
          </div>
        </div>

        {/* Right: Booking Module */}
        <div className="bg-white border shadow-xl rounded-xl p-8 h-fit sticky top-24">
          <div className="flex justify-between items-end mb-6">
             <div>
                <p className="text-gray-500">Daily Rate</p>
                <p className="text-3xl font-bold text-blue-600">R{board.price}</p>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-green-600">Available Now</p>
             </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Rental Dates</label>
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              <span className="text-gray-400">M</span><span className="text-gray-400">T</span><span className="text-gray-400">W</span>
              <span className="text-gray-400">T</span><span className="text-gray-400">F</span><span className="text-gray-400">S</span>
              <span className="text-gray-400">S</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => {
                const isBooked = bookedDays.includes(day);
                const isSelected = selectedDates.includes(day);
                return (
                  <button
                    key={day}
                    disabled={isBooked}
                    onClick={() => toggleDate(day)}
                    className={`
                      aspect-square rounded-md flex items-center justify-center font-medium transition
                      ${isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed decoration-slice' : ''}
                      ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-gray-700'}
                      ${!isBooked && !isSelected ? 'bg-white border border-gray-200' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-300 rounded"></div> Available</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded"></div> Booked</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Selected</span>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Days Selected</span>
              <span>{selectedDates.length} days</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>R{totalCost}</span>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Reserve Board
            </button>
            <p className="text-xs text-center text-gray-400">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">SurfSpot Rentals</h2>
      <div className="flex justify-center space-x-6 mb-8 text-gray-400">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Contact Us</span>
      </div>
      <p className="text-gray-500">© 2025 SurfSpot Rentals. All rights reserved.</p>
    </div>
  </footer>
);

// --- MAIN APP ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [previousPage, setPreviousPage] = useState('home');

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
      case 'product':
        return <ProductPage board={selectedBoard} onBack={() => setCurrentPage(previousPage === 'shop-detail' ? 'shop-detail' : 'catalog')} />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar setPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}
