import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams} from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useTheme } from "../../hooks/ThemeContext";
import useCart from "../../hooks/useCart";
 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";    
import axios from 'axios';
import Swal from 'sweetalert2'

const MenuSingle = () => {
  const { isDarkMode } = useTheme();
  const [menu, setMenu] = useState([]);
    
 // get id from url
  const params = useParams();
     // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/menu/${params.id}`);
      const data = await response.json(); 
      // const filtered = data.filter((el) => el._id === item.id);
      console.log(data)
      setMenu(data ?? []);
   
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching data:", error.message);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    console.log(params)
  
       fetchData();
  }, []);

  const {user} = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
 
  // console.log(item)
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  // add to cart handler
  const handleAddToCart = item => {
    // console.log(item);
    if(user && user.email){
        const cartItem = {menuItemId: item.id, name: item.name, quantity : 1, image: item.image, price: item.price, email: user.email}

        axios.post('http://localhost:5000/carts', cartItem)
        .then((response) => {
          console.log(response);
          if(response){
            refetch(); // refetch cart
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Food added on the cart.',
                  showConfirmButton: false,
                  timer: 1500
                })
          }
        })
        .catch( (error) => {
          console.log(error.response.data.message);
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500
          })
        });
    }
    else{
        Swal.fire({
            title: 'Please login to order the food',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Login now!'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login', {state: {from: location}})
            }
          })
    }
}
 

  return (
    <div>
      {/* menu banner */}
      <div className={`max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100% ${isDarkMode ? "dark" : ""}`}>
        <div className="py-48 flex flex-col items-center justify-center">
          <h1 className="text-4xl my-10 font-bold text-center">{menu.name}</h1>

         
          <div className="flex flex-row ">
            <div className="basis-1/2  mx-10"> 
            <figure>
              <img src={menu.image} alt={menu.name} className="hover:scale-105 transition-all duration-300" />
            </figure>      
            <div
        className={`rating gap-1   right-2 top-2 p-4 heartStar  ${
          isHeartFilled ? "text-rose-500 bg-orange-200" : "text-white bg-orange-600"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" /> Add to Favorites
      </div>
            </div>
            <div className="basis-1/2  mx-10">
            <h2 className="text-2xl my-10 font-bold">Recipe:</h2>
            <p>{menu.recipe}</p>
            <h2 className="text-2xl my-10 font-bold">Category:</h2>
            <p className="uppercase">{menu.category}</p>
            <h2 className="text-2xl my-10 font-bold">Price:</h2>
            <div className="card-actions justify-between items-center mt-2">
              <h5 className="font-semibold text-3xl">
                <span className=" text-red">₹ </span> {menu.price}
              </h5>
              <button onClick={() => handleAddToCart(menu)} className="btn bg-orange-600 text-white">Add to Cart </button>
            </div>
                
            </div>
             
          </div> 
                    
        </div>
      </div> 
    </div>
  );
};

export default MenuSingle;
