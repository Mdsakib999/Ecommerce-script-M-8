import { useEffect, useState } from "react";

const OfferSection = () => {
  const [timeLeft, setTimeLeft] = useState(3600 * 24 * 3); // 3 days countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${days} : ${hours} : ${minutes} : ${seconds}`;
  };

  return (
    <div className="px-4 sm:px-10 py-10">
      <div className="bg-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between rounded-lg ">
        <div className="w-full lg:w-1/2">
          <img
            src="https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="rounded-lg w-full object-cover"
            alt="Home Decor Offer"
          />
        </div>

        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tight text-gray-900">
            Get 20% off from our curated home decor
          </h2>
          <p className="text-gray-600 mb-6">
            Limited time offer! Refresh your living space with our premium 
            selection of handcrafted accents and enjoy 20% off. Don't miss out!
          </p>
          <div className="border-b-2 border-gray-200 "></div>
          <div className="text-xl  py-2 px-4 inline-block">
            <span className="text-black text-6xl">{formatTime(timeLeft)}</span>
          </div>
          <div className="border-b-2 border-gray-200 "></div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
