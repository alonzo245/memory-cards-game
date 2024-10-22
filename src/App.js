import React, { useState, useEffect } from "react";
import "./App.css"; // Importing the dark mode CSS

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [localImages, setLocalImages] = useState([]);

  // Load images from localStorage when component mounts
  useEffect(() => {
    const storedImages = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const base64String = localStorage.getItem(key);
      storedImages.push({ name: key, data: base64String });
    }
    setLocalImages(storedImages);
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files); // Convert to array

    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;

        // Display the image and save to localStorage
        setImages((prevImages) => [
          ...prevImages,
          { name: file.name, data: base64String },
        ]);
        localStorage.setItem(file.name, base64String);
      };

      // Read the image file as Base64
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <h1>Image Uploader</h1>

      {/* File input to upload images */}
      <input type="file" multiple onChange={handleImageUpload} />

      <h2>Uploaded Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Display uploaded images */}
        {images.map((image, index) => (
          <img
            key={index}
            src={image.data}
            alt={image.name}
            style={{ width: "100px", height: "100px", margin: "10px" }}
          />
        ))}
      </div>

      <h2>Images from LocalStorage</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Display images loaded from localStorage */}
        {localImages.map((image, index) => (
          <img
            key={index}
            src={image.data}
            alt={image.name}
            style={{ width: "100px", height: "100px", margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
};

// Card component to display each memory card
const Card = ({
  image,
  onRemember,
  onForget,
  revealCard,
  isRevealed,
  setIsRevealed,
}) => {
  return (
    <div>
      <div className="card">
        <div onClick={revealCard} style={{ cursor: "pointer" }}>
          {isRevealed ? (
            <img src={image} alt="memory card" />
          ) : (
            <div className="card-back"></div>
          )}
        </div>
      </div>
      {true && (
        <div className="buttons">
          <button onClick={onForget} style={{ backgroundColor: "red" }}>
            שכחתי
          </button>
          <button onClick={onRemember} style={{ backgroundColor: "green" }}>
            זכרתי
          </button>
        </div>
      )}
    </div>
  );
};

// Main Game component
const MemoryGame = ({ images }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [forgottenCount, setForgottenCount] = useState(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const revealCard = () => setIsRevealed(!isRevealed);

  // Handle "I did remember the card"
  const handleRemember = () => {
    if (!isRevealed) return;
    setRememberedCount(rememberedCount + 1); // Increment remembered count
    nextCard();
  };

  // Handle "I didn’t remember the card"
  const handleForget = () => {
    if (!isRevealed) return;
    setForgottenCount(forgottenCount + 1); // Increment forgotten count
    nextCard();
  };

  // Move to the next card
  const nextCard = () => {
    if (currentCardIndex < images.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert(
        `Game over! You remembered ${rememberedCount} cards and forgot ${forgottenCount} cards.`
      );
      setCurrentCardIndex(0); // Restart the game
      setRememberedCount(0); // Reset remembered count
      setForgottenCount(0); // Reset forgotten count
    }
  };

  return (
    <div className="memory-game">
      <p>
        זכרתי: {rememberedCount} | שכחתי: {forgottenCount}
      </p>
      <Card
        revealCard={revealCard}
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        image={images[currentCardIndex]}
        onRemember={handleRemember}
        onForget={handleForget}
      />
    </div>
  );
};

// App component
const App = () => {
  // Array of image URLs
  const images = Array.from({ length: 46 }, (_, i) => `/images/${i + 1}.png`);

  return (
    <div className="App">
      <ImageUploader />
      <MemoryGame images={images} />
    </div>
  );
};

export default App;
