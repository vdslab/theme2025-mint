import Header from './components/Header.jsx';
import PrecureVisualization from './components/PrecureVisualization.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <Header /> */}

      <main className="flex-grow flex flex-col items-center py-8">
        <PrecureVisualization />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
