import cv2
import numpy as np

# Load video
cap = cv2.VideoCapture('fv_video.mp4')
cap.set(cv2.CAP_PROP_POS_MSEC, 2000) # go to 2 seconds
ret, frame = cap.read()
if ret:
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Threshold for bright white text (Instagram text is usually white)
    _, text_mask = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)
    
    # Find contours to filter out large bright areas that aren't text
    contours, _ = cv2.findContours(text_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    refined_mask = np.zeros_like(text_mask)
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = w / float(h)
        area = cv2.contourArea(cnt)
        # Text characters usually have small width and height compared to full image
        if area > 10 and area < 5000:
            cv2.drawContours(refined_mask, [cnt], -1, 255, -1)
            
    # Dilate the mask to cover text edges and glowing shadows
    kernel = np.ones((7,7), np.uint8)
    refined_mask = cv2.dilate(refined_mask, kernel, iterations=2)
    
    # Inpaint the text
    cleaned_frame = cv2.inpaint(frame, refined_mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)
    
    # Crop the top 10% and bottom 20% to remove Instagram UI (like username, description, music track)
    height, width = cleaned_frame.shape[:2]
    t_crop = int(height * 0.10)
    b_crop = int(height * 0.20)
    cleaned_frame = cleaned_frame[t_crop:height-b_crop, :]
    
    # Save the output
    cv2.imwrite('fv_bg.jpg', cleaned_frame)
    print("Successfully created fv_bg.jpg")
else:
    print("Failed to read video")
cap.release()
