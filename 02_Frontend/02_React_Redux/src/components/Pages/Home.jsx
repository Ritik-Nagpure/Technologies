
import { reviews } from "../../assets/productList";

const Home = () => {
  // https://img.freepik.com/free-vector/hand-drawn-pattern-background_23-2150820517.jpg?semt=ais_hybrid&w=740&q=80
  //https://pam-main-website-media.s3.amazonaws.com/wp-content/uploads/2025/05/23010753/Hanis-Bakery-interior.jpg
  
  return (
    <div className="container mx-auto px-4 py-8">

      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-yellow-700">Sweet Crumbs Bakery</h1>
        <p className="mt-4 text-gray-600">
          Serving happiness through breads, cakes, ice creams, and snacks since 1995.
        </p>
      </section>


      {/* Reviews Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {
          reviews.map((review) => {
            <div className="space-y-4">
              <blockquote className="border-l-4 pl-4 italic text-gray-700">
                {review}
              </blockquote>
            </div>
          })
        }
      </section>

      {/* History Section */}
      <section >
        <div className="">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg text-gray-600">
            In 1995, Sweet Crumbs Bakery was nothing more than a tiny corner shop in Mulshi, run by a family with a single oven and a dream. The shelves held only a handful of items—simple white bread, a few pastries, and homemade ice cream churned by hand. Customers came not for luxury, but for warmth, kindness, and the unmistakable aroma of fresh bread that filled the street each morning.
            <br />
            <br />
            The early years were tough. With limited resources, every loaf of bread and every cake was made with painstaking care. The founders often worked through the night, kneading dough and experimenting with recipes, determined to prove that quality and passion could triumph over circumstance. Word spread quickly: this little bakery wasn’t just selling food, it was serving happiness.
            <br />
            <br />
            As demand grew, so did the bakery’s ambition. New products were introduced—multigrain loaves for the health-conscious, decadent chocolate cakes for celebrations, and colorful pastries that delighted children. Each innovation was guided by the same principle: freshness, honesty, and love in every bite.
            <br />
            <br />
            By the early 2000s, Sweet Crumbs had become a household name in the community. Families relied on it for birthdays, weddings, and everyday meals. Social media amplified its reach, with customers proudly sharing photos of their favorite treats. What began as a modest shop transformed into a thriving brand, with a loyal customer base and recognition beyond Mulshi.
            <br />
            <br />
            Today, Sweet Crumbs Bakery stands as a symbol of resilience and success. From one oven to a bustling kitchen, from a handful of products to a catalog of thirty diverse delights, the bakery’s journey is a testament to hard work, perseverance, and the belief that even the simplest dreams can rise—like dough—to greatness.
          </p>
        </div>
      </section >
    </div>
  );
};

export default Home;
