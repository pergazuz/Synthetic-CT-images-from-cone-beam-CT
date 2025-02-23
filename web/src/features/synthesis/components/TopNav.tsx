import LaptopImage from "../../../assets/laptop.png";

const TopNav = () => {
  return (
    <header className="relative w-full bg-[#D9D9D9] overflow-hidden">
      {/* Three orange circles in the top-right corner */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
        <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
        <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
      </div>

      {/* Main content container with reduced spacing */}
      <div className="relative flex flex-col md:flex-row items-center max-w-6xl mx-auto px-4 py-8 md:gap-4">
        {/* Left side: image */}
        <div className="w-1/3 md:w-1/2 flex justify-start">
          <img
            src={LaptopImage}
            alt="Laptop illustration"
            className="flex-shrink-0 w-1/2 h-auto"
          />
        </div>

        {/* Right side: text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-xl md:text-3xl font-bold mb-2">
            Cone Beam Computed Tomography,
          </h1>
          <p className="text-md md:text-base text-gray-800">
            which is a medical imaging technique that generates 3D images of structures within the body.
          </p>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
