import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <Footer />
    </main>
  );
}

export default App;
