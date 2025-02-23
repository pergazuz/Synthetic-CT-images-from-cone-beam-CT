import { Link } from "react-router-dom";
import CTImage from "../../assets/logo.svg";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F0] relative">
      <nav className="fixed top-0 left-0 w-full bg-[#D9D9D9] py-3 flex items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
          <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
          <span className="w-5 h-5 bg-orange-500 rounded-full"></span>
        </div>
      </nav>
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="text-4xl font-semibold mb-4">Welcome</h1>
        <img src={CTImage} alt="CT Insight" className="mb-4 w-60 h-auto" />
        <h2 className="text-5xl font-bold mb-2">CT Insight</h2>
        <p className="text-gray-700 mb-8">Let's start to find your CT!</p>
        <Link
          to="/next"
          className="flex items-center gap-2 px-6 py-2 bg-[#FD662E] text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-md"
        >
          <span>Get Started</span>
        </Link>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-[#FD662E] shadow-md py-2 flex justify-end border-t border-gray-200 px-4">
        <div className="text-white font-semibold">CT Insight</div>
      </nav>
    </div>
  );
};

export default WelcomePage;
