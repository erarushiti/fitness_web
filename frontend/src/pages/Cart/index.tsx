"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import "../../app/globals.css";

interface CartItem {
  supplementId: string;
  quantity: number;
  supplement: Supplement;
  storedUser: string;
}

interface Supplement {
  id: string;
  name: string;
  price: number;
  img?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // useEffect(() => {
  //   // Retrieve token and user from localStorage
  // const clientData = localStorage.getItem("user");
  //   console.log("clientdata", clientData);

  //   if (!clientData) {
  //     console.warn("Missing clientId");
  //     return;
  //   }

  //   const userId = JSON.parse(clientData).id;
  // }, []);

  useEffect(() => {
    const clientData = localStorage.getItem("user");
    console.log("clientdata", clientData);

    if (!clientData) {
      console.warn("Missing clientId");
      return;
    }

    const userId = JSON.parse(clientData).id;
    if (userId) {
      const fetchCart = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/cart/${userId}`, {
            headers: {
              // 'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setToken("");
            setUser(null);
            return;
          }
          if (!res.ok) throw new Error("Failed to fetch cart");
          const cartItems = await res.json();
          setCart(cartItems);
        } catch (err: any) {
          console.error("Fetch cart failed:", err);
          setError("Failed to load cart.");
        }
      };
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  const updateQuantity = async (supplementId: string, quantity: number) => {
    const clientData = localStorage.getItem("user");
    console.log("clientdata", clientData);

    if (!clientData) {
      console.warn("Missing clientId");
      return;
    }

    const userId = JSON.parse(clientData).id;
    if (quantity < 1) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/${supplementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity, userId }),
        }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      const updatedCartItem = await res.json();
      setCart((prev) =>
        prev.map((item) =>
          item.supplementId === supplementId ? updatedCartItem : item
        )
      );
    } catch (err: any) {
      console.error("Update quantity failed:", err);
      setError("Failed to update quantity.");
    }
  };

  const removeItem = async (supplementId: string) => {
    console.log("supplementid", supplementId);
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/${supplementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove item");
      setCart((prev) =>
        prev.filter((item) => item.supplementId !== supplementId)
      );
    } catch (err: any) {
      console.error("Remove item failed:", err);
      setError("Failed to remove item.");
    }
  };
const handleCheckout = async () => {
  const clientData = localStorage.getItem("user");
  console.log("clientdata", clientData);
  if (!clientData) {
    console.warn("Missing clientId");
    setError("Please log in to proceed with checkout.");
    return;
  }
  const userId = JSON.parse(clientData).id;
  console.log('Sending checkout request:', {
    userId,
    items: cart.map((item) => ({
      supplementId: item.supplementId,
      quantity: item.quantity,
    })),
  });
  if (cart.length === 0) {
    setError("Your cart is empty.");
    return;
  }
  try {
    const res = await fetch("http://localhost:8080/api/supplement/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        items: cart.map((item) => ({
          supplementId: item.supplementId,
          quantity: item.quantity,
        })),
      }),
    });
    const data = await res.json();
    console.log("Checkout response:", data);
    if (!res.ok) {
      throw new Error(data.error || "Failed to create order");
    }
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL provided");
    }
    setSuccess("Order placed successfully!");
    setCart([]);
  } catch (err) {
    console.error("Checkout failed:", err);
    // setError(err.message);
  }
};

  const totalPrice = cart.reduce((total, item) => {
    return (
      total + (item.supplement ? item.supplement.price * item.quantity : 0)
    );
  }, 0);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Your Cart</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              if (!item.supplement) return null;
              return (
                <div
                  key={item.supplementId}
                  className="flex items-center bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <img
                    src={
                      item.supplement.img
                        ? `http://localhost:8080/uploads/${item.supplement.img}`
                        : "/placeholder.png"
                    }
                    alt={item.supplement.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">
                      {item.supplement.name}
                    </h3>
                    <p className="text-gray-600">
                      ${item.supplement.price} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.supplementId,
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="w-16 border p-1 rounded text-black"
                    />
                    <button
                      onClick={() => removeItem(item.supplementId)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="text-right mt-6">
              <p className="text-xl font-bold text-black">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleCheckout}
                className="mt-4 px-6 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
              >
                Proceed to Checkout
              </button>
              <Link
                href="/supplements"
                className="ml-4 text-[#EE7838] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
