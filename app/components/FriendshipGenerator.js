"use client";
import NextImage from 'next/image'; // Renamed import to avoid conflict
import { useRef, useState } from 'react';

export default function FriendshipGenerator() {
  const [oldFriendName, setOldFriendName] = useState('');
  const [newFriendName, setNewFriendName] = useState('');
  const [images, setImages] = useState({
    newFriend: null,
    oldFriend1: null,
    oldFriend2: null,
  });
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => ({
          ...prev,
          [name]: {
            src: event.target.result,
            file: files[0]
          }
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const generateImage = async () => {
    if (!images.newFriend || !images.oldFriend1 || !images.oldFriend2) {
      alert('Please select all required images');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    // Load images
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image(); // Using built-in Image constructor
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    // Create X overlay - make it look more like MS Paint with imperfect lines
    const createXOverlay = (width, height) => {
      const xCanvas = document.createElement('canvas');
      xCanvas.width = width;
      xCanvas.height = height;
      const xCtx = xCanvas.getContext('2d');
      
      // Draw X with green color and uneven MS Paint style
      xCtx.strokeStyle = 'lime'; // Bright green like in your examples
      xCtx.lineCap = 'round'; // Round line caps for MS Paint look
      xCtx.lineWidth = 20; // Thick lines
      
      // Add some wobble function to make lines imperfect
      const wobble = () => (Math.random() - 0.5) * (width * 0.08);
      
      // First diagonal - with multiple segments for irregular look
      xCtx.beginPath();
      const segments = 4; // Number of segments to create a wobble effect
      
      // Start at top left (with small random offset)
      let lastX = width * 0.05 + wobble();
      let lastY = height * 0.05 + wobble();
      xCtx.moveTo(lastX, lastY);
      
      // Create multiple segments with slight offsets to make an irregular line
      for (let i = 1; i <= segments; i++) {
        const nextX = width * (0.05 + (i * 0.9 / segments)) + wobble();
        const nextY = height * (0.05 + (i * 0.9 / segments)) + wobble();
        xCtx.lineTo(nextX, nextY);
        lastX = nextX;
        lastY = nextY;
      }
      xCtx.stroke();
      
      // Second diagonal - also with multiple segments
      xCtx.beginPath();
      lastX = width * 0.95 + wobble();
      lastY = height * 0.05 + wobble();
      xCtx.moveTo(lastX, lastY);
      
      // Create multiple segments with slight offsets
      for (let i = 1; i <= segments; i++) {
        const nextX = width * (0.95 - (i * 0.9 / segments)) + wobble();
        const nextY = height * (0.05 + (i * 0.9 / segments)) + wobble();
        xCtx.lineTo(nextX, nextY);
        lastX = nextX;
        lastY = nextY;
      }
      xCtx.stroke();
      
      return xCanvas;
    };

    try {
      // Load background (new friend) image
      const bgImage = await loadImage(images.newFriend.src);
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      
      // Draw top text with gradient
      const topText = `Friendship ended with ${oldFriendName.toUpperCase()}`;
      ctx.save();
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#CF4E09');
      gradient.addColorStop(1, '#00B92C');
      
      // Increased font size and moved position up to prevent cutoff
      ctx.font = 'bold 65px Arial, Helvetica, sans-serif';
      ctx.scale(0.8, 2);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#006488';
      ctx.lineWidth = 1;
      ctx.fillText(topText, 0, 50); // Moved higher to prevent cutoff
      ctx.strokeText(topText, 0, 50);
      ctx.restore();
      
      // Draw other text elements with larger font
      ctx.font = 'bold 45px Arial, Helvetica, sans-serif'; // Increased from 38px
      ctx.strokeStyle = '#006488';
      ctx.lineWidth = 1;
      
      // Moved text down to avoid overlap with the top text
      // Now
      ctx.fillStyle = '#DF0676';
      ctx.fillText('Now', 300, 120); // Moved down from 70 to 120
      ctx.strokeText('Now', 300, 120);

      // New friend name
      ctx.fillStyle = '#AB5955';
      ctx.fillText(newFriendName.toUpperCase(), 300, 170); // Moved down from 110 to 170
      ctx.strokeText(newFriendName.toUpperCase(), 300, 170);

      // is my
      ctx.fillStyle = '#7C9535';
      ctx.fillText('is my', 300, 220); // Moved down from 150 to 220
      ctx.strokeText('is my', 300, 220);

      // best friend
      ctx.fillStyle = '#4CBF1F';
      ctx.fillText('best friend', 300, 270); // Moved down from 185 to 270
      ctx.strokeText('best friend', 300, 270);
      
      // Load and draw old friend images with X overlays
      const oldFriend1 = await loadImage(images.oldFriend1.src);
      const oldFriend2 = await loadImage(images.oldFriend2.src);
      
      // Draw first old friend
      ctx.drawImage(oldFriend1, 0, 341, 172, 259);
      const x1 = createXOverlay(172, 259);
      ctx.drawImage(x1, 0, 341);
      
      // Draw second old friend
      ctx.drawImage(oldFriend2, 579, 358, 221, 242);
      const x2 = createXOverlay(221, 242);
      ctx.drawImage(x2, 579, 358);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setResult(dataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    }
  };

  const downloadImage = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'friendship-ended.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setOldFriendName('');
    setNewFriendName('');
    setImages({
      newFriend: null,
      oldFriend1: null,
      oldFriend2: null,
    });
    setResult(null);
    
    // Reset file inputs
    document.getElementById('new-friend-pic').value = '';
    document.getElementById('old-friend-1').value = '';
    document.getElementById('old-friend-2').value = '';
  };

  return (
    <div>
      {!result ? (
        <form className="mb-6" onSubmit={(e) => { e.preventDefault(); generateImage(); }}>
          <div className="mb-4">
            <label htmlFor="old-friend-name" className="block mb-2">BYE</label>
            <input 
              type="text" 
              id="old-friend-name"
              className="border rounded px-3 py-2 w-full max-w-md"
              placeholder="Old Friend's Name"
              value={oldFriendName}
              onChange={(e) => setOldFriendName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="new-friend-name" className="block mb-2">HI</label>
            <input 
              type="text" 
              id="new-friend-name"
              className="border rounded px-3 py-2 w-full max-w-md"
              placeholder="New Friend's Name"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="new-friend-pic" className="block mb-2">Attach a picture of your new friend</label>
            <input 
              type="file" 
              id="new-friend-pic"
              name="newFriend"
              className="border rounded px-3 py-2 w-full max-w-md"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            <p className="text-sm text-gray-500">You can be in it but you don&apos;t have to be</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="old-friend-1" className="block mb-2">Attach a picture of your old friend</label>
            <input 
              type="file" 
              id="old-friend-1"
              name="oldFriend1"
              className="border rounded px-3 py-2 w-full max-w-md"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            <p className="text-sm text-gray-500">Hopefully, an unflattering one.</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="old-friend-2" className="block mb-2">Attach another picture of your old friend</label>
            <input 
              type="file" 
              id="old-friend-2"
              name="oldFriend2"
              className="border rounded px-3 py-2 w-full max-w-md"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            <p className="text-sm text-gray-500">They are no longer your friend.</p>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            FRIEND
          </button>
        </form>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Bless Your New Friendship With <em>{newFriendName.toUpperCase()}</em></h2>
          <div className="mb-4 mx-auto relative" style={{ maxWidth: '100%', height: 'auto' }}>
            <NextImage 
              src={result} 
              alt="Friendship ended" 
              width={800}
              height={600}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="flex justify-center gap-4">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={downloadImage}
            >
              Download Image
            </button>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={resetForm}
            >
              Create Another
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden canvas for generating the image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}