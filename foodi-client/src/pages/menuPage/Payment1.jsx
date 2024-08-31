 
import React from "react";
 
 
import useCart from "../../hooks/useCart";

 

const Payment = () => {
  const [cart] = useCart();

     
  function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

async function displayRazorpay(){
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if(!res){
      alert("Razorpay SDK failed to load")
      return
  }
  //creating a new order 
  const result = await axios.post("http://localhost:5400/payment/orders",  
    {
        amount: 500, 
        currency: "INR",
        receipt: "receipt_order_74394"}
  );

  console.log(result.data)

  if(!result){
      alert("Server error. Please try again later")
      return
  }

  // get all details of the order
  const {amount, id: order_id, currency} = result.data

  const options = {
      key: "rzp_test_G7n5glU9Reb2xm",
      amount: amount.toString(),
      currency: currency,
      name: "Acme Corp",   
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response){
          const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
      };
      console.log(result.data)
      const result = await axios.post("http://localhost:5400/payment/success", data);
      alert(result.data.msg)
   },
   prefill: {
       name: "Shahzad Hussain",
       email: "yourname@example.com",
       contact: "9999999999"
    },
    notes : {
       address: "Razorpay Corporate Office"
    },
    theme: {
       color: "#3399cc"
    },
    
   }
   const paymentObject = new window.Razorpay(options); 
   paymentObject.open();
 
  }   
 
  // Calculate the cart price
   const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
   const totalPrice = parseFloat(cartTotal.toFixed(2));
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
      
    </div>
  );
};

export default Payment;
