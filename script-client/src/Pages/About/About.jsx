import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            About Homiara Limited
          </h1>
          <p className="text-lg sm:text-xl">
            Timeless Decor. Handcrafted Elegance. Inspired Living.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4">
              Homiara Limited was born from a vision to transform houses into homes through the beauty of handcrafted decor. Our journey began with a deep appreciation for traditional craftsmanship and modern interior aesthetics. We curate unique pieces that evoke emotion and character, sourcing from talented artisans who share our passion for quality and design.
            </p>
            <p className="text-gray-700">
              Each item in our collection is carefully selected or designed to be a conversation piece, ensuring that your living space reflects your unique personality and style.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-50 py-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Artisanal Quality
              </h3>
              <p className="text-gray-600">
                We celebrate the human touch, partnering with master artisans to bring you home decor that is as durable as it is beautiful.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Curated Design
              </h3>
              <p className="text-gray-600">
                Our collections are thoughtfully curated to offer a blend of timeless elegance and contemporary flair for every room.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                Authentic Living
              </h3>
              <p className="text-gray-600">
                We believe in creating spaces that are authentically yours, providing the accents that turn a house into a sanctuary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team section (commented out as in original) */}

      {/* Call to Action */}
      <section className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Elevate Your Space?
          </h2>
          <p className="text-gray-200 mb-6">
            Explore our curated collections and discover the perfect accents for your home.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
