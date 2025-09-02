# Modern Photo Editor App

This is a client-side photo editing web application built with React and Vite, featuring a modern, elegant, and clear user interface with custom CSS. It allows users to upload an image and apply various filters and transformations directly in the browser.

## Features

*   **Image Upload**: Easily upload images from your local machine.
*   **Real-time Previews**: See changes instantly as you adjust filters.
*   **Basic Filters**: Adjust brightness, contrast, saturation, grayscale, sepia, and invert colors.
*   **Transformations**: Rotate and flip images.
*   **Reset**: Revert to the original image.
*   **Download**: Save your edited image.

## Technologies Used

*   **React**: For building the user interface.
*   **Vite**: As a fast development build tool.
*   **TypeScript**: For type safety and improved developer experience.
*   **Custom CSS**: For a modern, elegant, and clear design without relying on heavy UI frameworks.
*   **HTML Canvas API**: For powerful client-side image manipulation.

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation Steps

1.  **Clone the repository (or create the project files):**

    ```bash
    git clone <repository-url>
    cd photo-editor-app
    ```
    (If you've received the files directly, navigate to the project root directory.)

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

4.  **Build for production:**

    ```bash
    npm run build
    # or
    yarn build
    ```

    This will create a `dist` directory with the optimized production build.

## Usage

1.  **Upload Image**: Click the "Upload Image" button and select an image file (JPG, PNG, etc.) from your computer.
2.  **Apply Filters**: Use the sliders and buttons in the control panel to adjust various image properties.
3.  **Reset**: Click the "Reset" button to revert the image to its original state.
4.  **Download**: Once you are satisfied with your edits, click the "Download Image" button to save the modified image to your device.

## Project Structure

```
photo-editor-app/
├── public/
│   └── vite.svg          # Placeholder SVG for favicon
├── src/
│   ├── components/
│   │   ├── Controls.tsx    # UI for filter sliders and buttons
│   │   └── ImageEditor.tsx # Main component handling image state and canvas rendering
│   ├── utils/
│   │   └── imageUtils.ts   # Helper functions for canvas image manipulation
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles for the application
│   └── main.tsx            # Entry point for React application
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
