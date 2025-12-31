import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter,FaYoutube, FaTelegram, FaGithub } from "react-icons/fa";
import Navbaar from "./Navbar";
import axios from "axios"; //step 1: import axious
import Slider from "react-slick"; //in cmd :npm install react-slick --save
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Home() {
  const [courses, setCourses] = useState([]); //step 2: usestate for courses
  const sliderRef = useRef(null);

 

  // compute slidesToShow based on current viewport to avoid incorrect initial calc on mobile refresh
  const [slidesToShowState, setSlidesToShowState] = useState(() => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  });

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const val = w <= 600 ? 1 : w <= 768 ? 2 : w <= 1024 ? 3 : 4;
      setSlidesToShowState(val);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/course/courses`
,
          { withCredentials: true } // ✅ correct spelling
        );
        console.log("Courses fetched:", response.data); // check what backend returns
        setCourses(response.data.courses || []); // fallback if courses undefined

        // force slider to recalculate on mobile refresh
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
          sliderRef.current?.innerSlider?.onWindowResized?.();
          sliderRef.current?.slickGoTo?.(0);
        }, 250); // slightly longer to let layout settle
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  var settings = {
    //for slider use here
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShowState, // dynamic based on viewport
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    adaptiveHeight: false,
    variableWidth: false, // ensure fixed slide widths calculated by slick
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // mobile -> 1 card
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 w-full overflow-x-hidden">
      <Navbaar />
      {/*---------------------------------MAIN SECTION-----------------------------------------------------------------------------------------------------------------------------*/}
      {/* start of div */}
      <div className="min-h-screen flex flex-col text-white">
        {/* section 1 start */}
        <section className="text-center pt-34 pb-21">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-orange-400">
            Upgrade Your Skills, Unlock Your Future
          </h2>{" "}
          <br />
          <p className="text-gray-500 font-medium md:w-2/3 mx-auto">
            Learning should be exciting and effective — that’s why we created
            GyaanSetu. Dive into expert-designed courses that turn ideas into
            action and skills into opportunities.{" "}
          </p>
          <div className="space-x-4 mt-8">
            <Link
              to={"/courses"}
              className="bg-orange-500 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black"
            >
              Explore courses
            </Link>
            <Link
              to={"https://www.youtube.com/learncodingofficial"}
              className="bg-white text-black  p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-orange-500 duration-300 hover:text-white"
            >
              Courses videos
            </Link>
          </div>
        </section>
        {/* section 1 end*/}

        {/* section 2 start */}
        <section className="p-8 w-full ">
          <div className="w-4/5 m-auto">
            <Slider
              key={slidesToShowState}
              ref={sliderRef}
              className=""
              {...settings}
            >
              {courses.map((course) => (
                <div key={course._id} className="w-full">
                  <div className="w-full transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden mx-2">
                      <img
                        className="h-32 w-full object-contain pt-2"
                        src={course.image?.url}
                        alt=""
                      />
                      <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-white">
                          {course.title}
                        </h2>
                        <Link
                          to={`/buy/${course._id}`}
                          className="mt-4 inline-block bg-orange-400 text-white py-2 px-4 rounded-full hover:bg-orange-500 duration-300"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        {/* section 2 end*/}

        {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
        <hr />
        {/* Footer */}
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">GyanSetu</h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2 text-xl text-center">Follow us</p>
                <div className="flex space-x-4">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                  
                </div>
              </div>
            </div>

           {/* Connect Links */}
     <div className="items-center mt-6 md:mt-0 flex flex-col">
      <h3 className="text-lg font-semibold md:mb-4 text-white">Connects</h3>
      <ul className="space-y-3 text-gray-400">
        <li>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white duration-300"
          >
            <FaYoutube className="text-red-500 text-xl" />
            YouTube
          </a>
        </li>
        <li>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white duration-300"
          >
            <FaTelegram className="text-blue-400 text-xl" />
            Telegram
          </a>
        </li>
        <li>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white duration-300"
          >
            <FaGithub className="text-gray-300 text-xl" />
            GitHub
          </a>
        </li>
      </ul>
    </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2025
              </h3>
              <ul className="space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
      {/* end of inner div */}
    </div>
  );
}
