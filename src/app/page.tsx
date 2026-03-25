import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsFeed from "@/components/NewsFeed";
import CategoryShowcase from "@/components/CategoryShowcase";
import Newsletter from "@/components/Newsletter";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <NewsFeed />
        <CategoryShowcase />
        <Newsletter />
        <About />
      </main>
      <Footer />
    </>
  );
}
