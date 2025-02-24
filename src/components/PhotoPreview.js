import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhotoPreview = ({ start, capturedImages }) => {
    // console.log("hello??")
    const stripCanvasRef = useRef(null);
    const navigate = useNavigate();
    const [stripColor, setStripColor] = useState("white");

    useEffect(() => {
        // console.log(capturedImages)
        if (capturedImages.length) {
            setTimeout(() => {
                generatePhotoStrip();
            }, 100);
        }
    }, [capturedImages, stripColor]);

    const generatePhotoStrip = () => {
        const canvas = stripCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
    
        const imgWidth = 300;
        const imgHeight = 200;
        const borderSize = 40;  
        const photoSpacing = 20;  
        const textHeight = 50;  
        const totalHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;

        // Set canvas dimensions
        canvas.width = imgWidth + borderSize * 2;
        canvas.height = totalHeight;

        // console.log(canvas.width)

        // Set background color
        ctx.fillStyle = stripColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let imagesLoaded = 0;
        capturedImages.forEach((image, index) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const yOffset = borderSize + (imgHeight + photoSpacing) * index;

                const imageRatio = img.width / img.height;
                const targetRatio = imgWidth / imgHeight;

                // console.log(imageRatio, targetRatio)

                let sourceWidth = img.width;
                let sourceHeight = img.height;
                let sourceX = 0;
                let sourceY = 0;

                if (imageRatio > targetRatio) {
                    // Image is wider - crop width
                    sourceWidth = sourceHeight * targetRatio;
                    sourceX = (img.width - sourceWidth) / 2;
                } else {
                    // Image is taller - crop height
                    sourceHeight = sourceWidth / targetRatio;
                    sourceY = (img.height - sourceHeight) / 2;
                }

                // Draw image with proper cropping
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight,  // Source (cropping)
                    borderSize, yOffset, imgWidth, imgHeight      // Destination
                );
                
                imagesLoaded++;

                if (imagesLoaded === capturedImages.length) {
                // Format timestamp to match purple strip
                const now = new Date();
                const timestamp = now.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }) + '  ' + 
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                // Set text style
                ctx.fillStyle = "#000000";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                
                // Position text at bottom left with padding
                ctx.fillText("BOGO  " + timestamp, canvas.width / 2, totalHeight - borderSize * 1);


                ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
                ctx.font = "12px Arial";  // Adjust font size
                ctx.textAlign = "center";

                // Draw copyright text at bottom right
                ctx.fillText(
                    "© 2025",
                    canvas.width - borderSize,
                    totalHeight - borderSize / 2
                );
            


                }
            };
        });
    };

    const downloadPhotoStrip = () => {
        const link = document.createElement("a");
        link.download = "photostrip.png";
        link.href = stripCanvasRef.current.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="photo-preview">
        <h2>Photo Strip Preview</h2>

        <div className="color-options">
            <button onClick={() => setStripColor("white")}>White</button>
            <button onClick={() => setStripColor("#fceee9")}>Pink</button>
            <button onClick={() => setStripColor("#dde6d5")}>Green</button>
            <button onClick={() => setStripColor("#adc3e5")}>Blue</button>
            <button onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
            <button onClick={() => setStripColor("#dbcfff")}>Purple</button>
        </div>

        <canvas ref={stripCanvasRef} className="photo-strip" />

        <div className="strip-buttons">
            <button onClick={downloadPhotoStrip}>📥 Download Photo Strip</button>
            <button onClick={start}>🔄 Take New Photos</button>
        </div>
        </div>
    );
};

export default PhotoPreview;