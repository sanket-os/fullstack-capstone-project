// import React, { useState } from "react";
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import { Button } from "antd";
// import { message } from "antd";

// const CheckoutForm = ({ book }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       message.error("Stripe has not loaded yet.");
//       return;
//     }

//     setLoading(true);

//     // Confirm payment with Stripe
//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // No redirect needed, we handle result manually
//         return_url: window.location.href,
//       },
//       redirect: "if_required",
//     });

//     if (error) {
//       message.error(error.message);
//       setLoading(false);
//       return;
//     }

//     // Payment successful
//     if (paymentIntent.status === "succeeded") {
//       message.success("Payment successful!");

//       // Your existing logic to save booking in DB
//       await book(paymentIntent.id);
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
//       <PaymentElement />

//       <Button
//         htmlType="submit"
//         type="primary"
//         shape="round"
//         size="large"
//         block
//         loading={loading}
//         disabled={!stripe}
//         style={{ marginTop: "20px" }}
//       >
//         Pay Now
//       </Button>
//     </form>
//   );
// };

// export default CheckoutForm;
