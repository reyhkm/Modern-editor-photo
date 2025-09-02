import ImageEditor from './components/ImageEditor';
import './App.css'; // Specific styles for App if needed, otherwise index.css is enough

function App() {
  return (
    <div className="app-container">
      <h1>Modern Photo Editor</h1>
      <ImageEditor />
    </div>
  );
}

export default App;
