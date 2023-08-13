import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import Script from 'next/script';
import { handlePayment } from '../pages/api/paystack';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext();
  const [ data, setData ] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePayment(data.email, parseFloat(data.amount));
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [ e.target.name ]: e.target.value
        })
    }


  return (
    <>
     <Script src="https://js.paystack.co/v1/inline.js"/>

    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">

        <div className='payment-control'>
              <form type="form" onSubmit={handleSubmit}>
            <h3 className="payment-form">Pay with PayStack</h3>
                <div className="input-control">
                   <label for="Email">Email</label>
                   <input type="email" required name="email" placeholder="Your email.." onChange={handleChange}/>
                </div>
                 <div className="input-control">
                   <label for="Amount">Amount (₦)</label>
                     <input type="amount" name="amount" value={data.amount=totalPrice} onChange={handleChange}/>
              <br></br>
                   <button type="submit" className='btn-submit'>Pay Now</button>
                </div>
                            
              </form>
            </div>

          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>₦ {item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'dec')
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num" onClick="">
                          {item.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'inc')
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>₦ {totalPrice}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cart;
