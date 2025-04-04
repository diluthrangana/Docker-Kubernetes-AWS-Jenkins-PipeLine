import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State management
  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [activeTab, setActiveTab] = useState('destinations');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [plannedTrips, setPlannedTrips] = useState([]);
  const [tripForm, setTripForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    notes: ''
  });
  const [previousTab, setPreviousTab] = useState('destinations');

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedDestinations = localStorage.getItem('destinations');
    const savedFavorites = localStorage.getItem('favorites');
    const savedTrips = localStorage.getItem('plannedTrips');

    if (savedDestinations) setDestinations(JSON.parse(savedDestinations));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedTrips) setPlannedTrips(JSON.parse(savedTrips));

    // If no destinations exist, populate with sample data
    if (!savedDestinations) {
      const initialDestinations = [
        {
          id: 1,
          name: 'Sigiriya Rock Fortress',
          image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lovesrilanka.org%2Fsigiriya-rock-fortress%2F&psig=AOvVaw3Xt2GOkZ1q4IjiRKd1Gg2k&ust=1743827561184000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPiEwqTGvYwDFQAAAAAdAAAAABAE",
          description: 'Ancient rock fortress with frescoes and gardens, known as the "Eighth Wonder of the World". Climb the 1,200 steps to see spectacular views and ancient frescoes.',
          price: 850,
          rating: 4.8
        },
        {
          id: 2,
          name: 'Kandy - Temple of the Tooth',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT32SCzWjoRExhCTaAgsFlflHmGxRfLXemzw&s',
          description: 'Home to the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), one of Buddhism\'s most sacred shrines, surrounded by beautiful hills and tea plantations.',
          price: 650,
          rating: 4.7
        },
        {
          id: 3,
          name: 'Galle Dutch Fort',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzIMXRDDwkIFDZ-yYC8W64YoKIq0SPLXMV8w&s',
          description: 'UNESCO World Heritage site with colonial architecture, cobblestone streets, and ocean views. Explore 400-year-old Dutch colonial buildings and walk along the sea wall.',
          price: 500,
          rating: 4.6
        },
        {
          id: 4,
          name: 'Ella Nine Arch Bridge',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCfzK96eumwstDEEEKWvPEo6-x2p2zdki3tw&s',
          description: 'Scenic hill country with the famous Nine Arch Bridge, hiking trails to Little Adam\'s Peak, and lush tea plantations. Perfect for train journeys through misty mountains.',
          price: 600,
          rating: 4.9
        },
        {
          id: 5,
          name: 'Yala National Park Safari',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnpCjg5mFtMVNNnt2gEkEL3N7JZ4wGCuKB8w&s',
          description: 'Wildlife safari experience featuring the highest leopard density in the world. Spot elephants, sloth bears, crocodiles and over 200 bird species in their natural habitat.',
          price: 700,
          rating: 4.5
        },
        {
          id: 6,
          name: 'Mirissa Beach Getaway',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHA6e3ACj19ZfsLy5g151NhUvyCuqrqxaRug&s',
          description: 'Beautiful beach town known for whale watching, surfing, and stunning sunsets. Experience blue whale and dolphin watching tours from November to April.',
          price: 550,
          rating: 4.7
        },
        {
          id: 7,
          name: 'Polonnaruwa Ancient City',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmDtg_SIRMg4ExNa_PaIHAwt2ruT0X6A5OKw&s',
          description: 'Explore the ancient capital with its well-preserved ruins, massive Buddha statues, and impressive irrigation systems dating back to the 10th century.',
          price: 580,
          rating: 4.6
        },
        {
          id: 8,
          name: 'Anuradhapura Sacred City',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH-s3FrAhR00d0o_9aNQ6kboMVWn5F7_b_6g&s',
          description: 'Sri Lanka\'s first ancient capital with sacred Buddhist sites including the Sri Maha Bodhi tree, grown from a cutting of the tree under which Buddha attained enlightenment.',
          price: 620,
          rating: 4.7
        },
        {
          id: 9,
          name: 'Nuwara Eliya Tea Country',
          image: 'https://cdn.britannica.com/10/118510-004-EFB89B8A/Tea-plantation-Nuwara-Eliya-Sri-Lanka.jpg',
          description: 'Known as "Little England" for its colonial architecture and cool climate. Visit tea plantations, waterfalls, and enjoy the misty mountain scenery.',
          price: 670,
          rating: 4.8
        }
      ];
      setDestinations(initialDestinations);
      localStorage.setItem('destinations', JSON.stringify(initialDestinations));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('plannedTrips', JSON.stringify(plannedTrips));
  }, [plannedTrips]);

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle favorite status for a destination
  const toggleFavorite = (destination) => {
    const isFavorite = favorites.some(fav => fav.id === destination.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== destination.id));
    } else {
      setFavorites([...favorites, destination]);
    }
  };

  // Handle form input changes
  const handleTripFormChange = (e) => {
    const { name, value } = e.target;
    setTripForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new planned trip
  const addPlannedTrip = (e) => {
    e.preventDefault();
    const newTrip = {
      id: Date.now(),
      ...tripForm
    };
    setPlannedTrips([...plannedTrips, newTrip]);
    // Reset form
    setTripForm({
      destination: '',
      startDate: '',
      endDate: '',
      travelers: 1,
      notes: ''
    });
  };

  // Delete planned trip
  const deleteTrip = (tripId) => {
    setPlannedTrips(plannedTrips.filter(trip => trip.id !== tripId));
  };

  // View destination details
  const viewDestinationDetails = (destination) => {
    setPreviousTab(activeTab);
    setSelectedDestination(destination);
    setActiveTab('details');
  };

  // Return to previous view
  const backToPrevious = () => {
    setSelectedDestination(null);
    setActiveTab(previousTab);
  };

  // Set active tab with tracking previous
  const setTabWithHistory = (tab) => {
    if (tab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(tab);
    }
  };

  return (
    <div className="app">
      {/* Navigation Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <i className="icon-map"></i>
            <h1>Ceylon Adventures</h1>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeTab === 'destinations' ? 'active' : ''}`} 
              onClick={() => setTabWithHistory('destinations')}
            >
              Destinations
            </button>
            <button 
              className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`} 
              onClick={() => setTabWithHistory('favorites')}
            >
              Favorites
            </button>
            <button 
              className={`nav-item ${activeTab === 'trips' ? 'active' : ''}`} 
              onClick={() => setTabWithHistory('trips')}
            >
              Plan Trip
            </button>
          </nav>
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="container">
              <button 
                className={`mobile-nav-item ${activeTab === 'destinations' ? 'active' : ''}`} 
                onClick={() => {
                  setTabWithHistory('destinations');
                  setIsMenuOpen(false);
                }}
              >
                Destinations
              </button>
              <button 
                className={`mobile-nav-item ${activeTab === 'favorites' ? 'active' : ''}`} 
                onClick={() => {
                  setTabWithHistory('favorites');
                  setIsMenuOpen(false);
                }}
              >
                Favorites
              </button>
              <button 
                className={`mobile-nav-item ${activeTab === 'trips' ? 'active' : ''}`} 
                onClick={() => {
                  setTabWithHistory('trips');
                  setIsMenuOpen(false);
                }}
              >
                Plan Trip
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="main container">
        {/* Hero Section - Only show on destinations tab */}
        {activeTab === 'destinations' && !selectedDestination && (
          <div className="hero">
            <img src="https://dth.travel/wp-content/uploads/2023/08/sri-lanka-hero.jpg" alt="Sri Lanka Travel" className="hero-image" />
            <div className="hero-content">
              <h2>Discover the Pearl of the Indian Ocean</h2>
              <p>Experience ancient culture, breathtaking landscapes, and warm hospitality</p>
              <div className="search-bar">
                <i className="icon-search"></i>
                <input
                  type="text"
                  placeholder="Search destinations in Sri Lanka..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="content-area">
          {/* Destinations List */}
          {activeTab === 'destinations' && !selectedDestination && (
            <>
              <h2 className="section-title">Popular Destinations in Sri Lanka</h2>
              <div className="destination-grid">
                {filteredDestinations.map(destination => (
                  <div key={destination.id} className="destination-card">
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="destination-image"
                    />
                    <div className="destination-info">
                      <div className="destination-header">
                        <h3>{destination.name}</h3>
                        <button 
                          onClick={() => toggleFavorite(destination)}
                          className="favorite-btn"
                        >
                          {favorites.some(fav => fav.id === destination.id) ? '❤️' : '♡'}
                        </button>
                      </div>
                      <p className="destination-desc">{destination.description.substring(0, 100)}...</p>
                      <div className="destination-meta">
                        <span className="price">${destination.price}</span>
                        <span className="rating">Rating: {destination.rating}/5</span>
                      </div>
                      <button 
                        onClick={() => viewDestinationDetails(destination)}
                        className="btn btn-primary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredDestinations.length === 0 && (
                <div className="empty-state">
                  No destinations found. Try a different search.
                </div>
              )}
            </>
          )}

          {/* Destination Details */}
          {activeTab === 'details' && selectedDestination && (
            <div className="destination-details">
              <button 
                onClick={backToPrevious}
                className="back-btn"
              >
                ← Back
              </button>
              <div className="details-grid">
                <div className="details-image-container">
                  <img 
                    src={selectedDestination.image} 
                    alt={selectedDestination.name} 
                    className="details-image"
                  />
                </div>
                <div className="details-info">
                  <div className="details-header">
                    <h2>{selectedDestination.name}</h2>
                    <button 
                      onClick={() => toggleFavorite(selectedDestination)}
                      className="favorite-btn large"
                    >
                      {favorites.some(fav => fav.id === selectedDestination.id) ? '❤️' : '♡'}
                    </button>
                  </div>
                  <div className="rating-display">
                    <span className="stars">★★★★★</span>
                    <span>{selectedDestination.rating}/5</span>
                  </div>
                  <p className="details-desc">{selectedDestination.description}</p>
                  <div className="package-details">
                    <h3>Sri Lankan Adventure Package</h3>
                    <p><span>Price:</span> ${selectedDestination.price} per person</p>
                    <p><span>Duration:</span> 5-7 days</p>
                    <p><span>Included:</span> Accommodations, guided tours, traditional Sri Lankan breakfast</p>
                    <p><span>Best time to visit:</span> December to April</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPreviousTab(activeTab);
                      setActiveTab('trips');
                      setTripForm(prev => ({
                        ...prev,
                        destination: selectedDestination.name
                      }));
                    }}
                    className="btn btn-primary full-width"
                  >
                    Plan Your Trip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites */}
          {activeTab === 'favorites' && (
            <>
              <h2 className="section-title">Your Favorite Sri Lankan Destinations</h2>
              {favorites.length > 0 ? (
                <div className="destination-grid">
                  {favorites.map(destination => (
                    <div key={destination.id} className="destination-card">
                      <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="destination-image"
                      />
                      <div className="destination-info">
                        <div className="destination-header">
                          <h3>{destination.name}</h3>
                          <button 
                            onClick={() => toggleFavorite(destination)}
                            className="favorite-btn"
                          >
                            ❤️
                          </button>
                        </div>
                        <p className="destination-desc">{destination.description.substring(0, 100)}...</p>
                        <div className="destination-meta">
                          <span className="price">${destination.price}</span>
                          <span className="rating">Rating: {destination.rating}/5</span>
                        </div>
                        <button 
                          onClick={() => viewDestinationDetails(destination)}
                          className="btn btn-primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="heart-icon">♡</div>
                  <p>You haven't added any favorite Sri Lankan destinations yet.</p>
                  <button 
                    onClick={() => setTabWithHistory('destinations')}
                    className="link-btn"
                  >
                    Browse destinations
                  </button>
                </div>
              )}
            </>
          )}

          {/* Trip Planning */}
          {activeTab === 'trips' && (
            <div className="trips-container">
              {previousTab !== 'trips' && (
                <button 
                  onClick={backToPrevious}
                  className="back-btn"
                >
                  ← Back
                </button>
              )}
              
              {/* Trip Planning Form */}
              <div className="trip-planning">
                <h2 className="section-title">Plan Your Sri Lanka Adventure</h2>
                <form onSubmit={addPlannedTrip} className="trip-form">
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      type="text"
                      name="destination"
                      value={tripForm.destination}
                      onChange={handleTripFormChange}
                      required
                      placeholder="Where in Sri Lanka do you want to go?"
                      list="sri-lanka-destinations"
                    />
                    <datalist id="sri-lanka-destinations">
                      {destinations.map(dest => (
                        <option key={dest.id} value={dest.name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={tripForm.startDate}
                        onChange={handleTripFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={tripForm.endDate}
                        onChange={handleTripFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Number of Travelers</label>
                    <input
                      type="number"
                      name="travelers"
                      value={tripForm.travelers}
                      onChange={handleTripFormChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Trip Notes</label>
                    <textarea
                      name="notes"
                      value={tripForm.notes}
                      onChange={handleTripFormChange}
                      placeholder="Any special requirements or notes for your Sri Lankan adventure..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary full-width"
                  >
                    Save Trip
                  </button>
                </form>
              </div>

              {/* Planned Trips List */}
              <div className="planned-trips">
                <h2 className="section-title">Your Planned Sri Lankan Adventures</h2>
                {plannedTrips.length > 0 ? (
                  <div className="trips-list">
                    {plannedTrips.map(trip => (
                      <div key={trip.id} className="trip-card">
                        <div className="trip-header">
                          <h3>{trip.destination}</h3>
                          <button 
                            onClick={() => deleteTrip(trip.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="trip-dates">
                          <i className="icon-calendar"></i>
                          <span>{trip.startDate} to {trip.endDate}</span>
                        </div>
                        <div className="trip-travelers">
                          <i className="icon-user"></i>
                          <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
                        </div>
                        {trip.notes && (
                          <p className="trip-notes">{trip.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="calendar-icon">📅</div>
                    <p>You don't have any planned trips to Sri Lanka yet.</p>
                    <p className="small-text">Use the form to plan your Sri Lankan adventure!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <h3>Ceylon Adventures</h3>
              <p>Your gateway to unforgettable adventures across the beautiful island of Sri Lanka.</p>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><button onClick={() => setTabWithHistory('destinations')} className="footer-link">Destinations</button></li>
                <li><button onClick={() => setTabWithHistory('favorites')} className="footer-link">Favorites</button></li>
                <li><button onClick={() => setTabWithHistory('trips')} className="footer-link">Plan a Trip</button></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <p>Email: info@ceylon-adventures.lk</p>
              <p>Phone: +94 11 234 5678</p>
              <p>Address: 123 Galle Road, Colombo, Sri Lanka</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Ceylon Adventures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
