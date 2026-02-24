import { useState } from "react";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import ConfirmationModal from "./Utils/ConfirmationModal";

const CartSlider = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  // Removal Confirmation State
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    } else {
      handleRemoveClick(id);
    }
  };

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleRemoveClick = (id) => {
    setItemToRemove(id);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove));
      toast.info("Item removed from cart");
      setIsRemoveModalOpen(false);
      setItemToRemove(null);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-5 pt-16 border-b border-gray-100">
          <h2 className="text-2xl font-medium uppercase">Your Cart</h2>
          <button onClick={onClose}>
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-160px)]">
          {cartItems.ids.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.ids.map((id) => {
              const item = cartItems.entities[id];
              return (
                <div
                  key={id}
                  className="flex items-center border-b border-gray-100 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {/* Quantity controls */}
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => handleDecrease(item._id, item.quantity)}
                        className="px-2 py-1 text-sm bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item._id, item.quantity)}
                        className="px-2 py-1 text-sm bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Price: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  {/* Delete button */}
                  <button onClick={() => handleRemoveClick(item._id)}>
                    <IoTrashOutline className="text-xl text-red-500" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full text-center bg-gray-200 text-gray-800 py-2 rounded mb-2"
          >
            View Cart
          </Link>
          <Link
            to="/checkout"
            onClick={onClose}
            className="block w-full text-center bg-black text-white py-2 rounded"
          >
            Checkout
          </Link>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isRemoveModalOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsRemoveModalOpen(false)}
        confirmText="Remove"
      />
    </>
  );
};

export default CartSlider;

