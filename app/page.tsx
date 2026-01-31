"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useForm } from "@formspree/react";

/* =========================
   TYPES
========================= */

interface MenuItem {
    id: string;
    name: string;
    batchSize: number;
    pricePerBatch: number;
    options?: string[];
    description: string;
    ingredients: string;
    image: string;
}

interface CartItem extends MenuItem {
    cartId: string;
    option: string;
    batches: number;
    notes: string;
}

/* =========================
   FONT + THEME
========================= */

const style = `
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

const bakeryFont = {
    fontFamily: "'Playfair Display', serif"
};

const textBlack = "#000000";
const outlineColor = "#d9e6b0";

/* =========================
   MENU DATA
========================= */

const MENU: MenuItem[] = [
    {
        id: "muffins",
        name: "Muffins",
        batchSize: 6,
        pricePerBatch: 18,
        options: ["Blueberry", "Strawberry", "Raspberry", "Chocolate Chip", "Banana Nut"],
        description: "Soft, bakery-style muffins made fresh.",
        ingredients: "Flour, sugar, eggs, milk, butter, fruit",
        image: "/Images/Menu/blueberry-muffins-square.jpg",
    },
    {
        id: "danishes",
        name: "Cream Cheese Danishes",
        batchSize: 6,
        pricePerBatch: 18,
        options: ["Blueberry", "Strawberry", "Raspberry"],
        description: "Flaky pastry with sweet cream cheese filling.",
        ingredients: "Flour, butter, cream cheese, sugar, eggs",
        image: "/Images/Menu/199-blueberry-cream-cheese-danish-3-768x1024.jpg",
    },
    {
        id: "cinnamon",
        name: "Cinnamon Rolls",
        batchSize: 12,
        pricePerBatch: 36,
        description: "Soft rolls with cinnamon sugar swirl.",
        ingredients: "Flour, yeast, cinnamon, sugar, butter",
        image: "/Images/Menu/cinnamonbun_800x.jpg",
    },
    {
        id: "scones",
        name: "White Chocolate Scones",
        batchSize: 6,
        pricePerBatch: 16,
        description: "Tender scones with white chocolate",
        ingredients: "Flour, cream, butter, white chocolate",
        image: "/Images/Menu/Scones.jpeg",
    },
];

/* ========================= */

export default function HarmonicBakery() {

    const [page, setPage] = useState("home");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
    const [option, setOption] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [pickupTime, setPickupTime] = useState("");
    const [fulfillment, setFulfillment] = useState("Pickup");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [optionError, setOptionError] = useState("");

    const [state, handleSubmit] = useForm("xojwvzdp");

    /* ========================= */

    useEffect(() => {
        const savedCart = localStorage.getItem("hb_cart");
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem("hb_cart", JSON.stringify(cart));
    }, [cart]);

    const itemCount = cart.reduce((s, i) => s + i.batches, 0);
    const cartTotal = cart.reduce((s, i) => s + i.batches * i.pricePerBatch, 0);

    const isTimeValid = () => {
        if (!pickupTime) return false;
        return (new Date(pickupTime) - new Date()) / 36e5 >= 24;
    };

    /* ========================= */

    const addToCart = (item: MenuItem) => {

        if (item.options && !option) {
            setOptionError("Please select a flavor option.");
            return;
        }

        setCart(prev => [...prev, {
            cartId: crypto.randomUUID(),
            ...item,
            option,
            batches: quantity,
            notes
        }]);

        setAdded(true);

        setTimeout(() => setAdded(false), 10000);
        setTimeout(() => {
            setActiveItem(null);
            setOption("");
            setQuantity(1);
            setNotes("");
            setPage("menu");
        }, 1000);
    };

    const removeItem = (id: string) => {
        setCart(prev => prev.filter(i => i.cartId !== id));
    };

    const adjustQty = (id: string, delta: number) => {
        setCart(prev =>
            prev.map(i =>
                i.cartId === id
                    ? { ...i, batches: Math.max(1, i.batches + delta) }
                    : i
            )
        );
    };

    /* ========================= */

    const onOrderSubmit = async (e: any) => {
        e.preventDefault();
        if (!isTimeValid()) return;
        await handleSubmit(e);
        if (state.succeeded) {
            setShowConfirmation(true);
            setCart([]);
            localStorage.removeItem("hb_cart");
        }
    };

    /* ========================= */

    return (
        <div className="min-h-screen" style={bakeryFont}>

            <style>{style}</style>

            {/* NAV */}
            <nav className="flex justify-between p-6 items-center">

                <button
                    onClick={() => setPage("home")}
                    style={{ color: outlineColor }}
                    className="text-5xl font-bold flex items-center gap-1"
                >
                    Harm
                    <img
                        src="/Images/Menu/logo.png"
                        className="h-10 w-10 inline-block"
                    />
                    nic Bakery
                </button>

                <div className="flex gap-6 items-center">

                    {["home", "menu", "contact"].map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className="px-6 py-2 text-xl border rounded-lg"
                            style={{ borderColor: outlineColor, color: outlineColor }}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}

                    <div
                        onClick={() => setPage("cart")}
                        className="relative cursor-pointer"
                    >
                        <ShoppingCart size={32} color={outlineColor} />

                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </div>

                </div>
            </nav>

            <div className="w-full h-[1px]" style={{ backgroundColor: outlineColor }} />

            {/* HOME */}
            {page === "home" && (
                <section className="p-20 text-center space-y-8" style={{ color: textBlack }}>

                    <img
                        src="/Images/Menu/logo.png"
                        alt="Logo"
                        className="mx-auto h-80 mb-12"
                    />

                    <h2 className="text-6xl font-bold mt-6">
                        Family owned, Handcrafted, Locally sourced pastry's and such
                    </h2>

                    <p className="text-2xl">Out of Dripping Springs Texas</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        {[1, 2, 3, 4].map(i => (
                            <img
                                key={i}
                                src="https://via.placeholder.com/400"
                                className="rounded-xl"
                            />
                        ))}
                    </div>

                </section>
            )}

            {/* CONTACT */}
            {page === "contact" && (
                <section className="p-20 text-center space-y-4" style={{ color: textBlack }}>
                    <h2 className="text-5xl font-bold">Contact Us</h2>
                    <p>Email: micahepps777@gmail.com</p>
                    <p>Phone: +1 (435) 324-1209</p>
                </section>
            )}

            {/* MENU */}
            {page === "menu" && (
                <section className="p-12">

                    <h2
                        className="text-6xl text-center mb-12 font-bold"
                        style={{ color: outlineColor }}
                    >
                        Baked Goods
                    </h2>

                    <div className="grid md:grid-cols-4 gap-10">

                        {MENU.map(item => (
                            <Card
                                key={item.id}
                                onClick={() => {

                                    setActiveItem(item);
                                    setOption("");
                                    setQuantity(1);
                                    setNotes("");
                                    setAdded(false);     // ✅ reset Added!
                                }}
                                className="bg-[#6f7f5e] border-2 border-[var(--outline)] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{ "--outline": outlineColor } as React.CSSProperties}


                            >
                                <CardContent className="p-6">

                                    <img
                                        src={item.image}
                                        className="w-full h-[220px] object-cover rounded-xl mb-3"
                                    />

                                    <h3 className="text-2xl font-bold" style={{ color: outlineColor }}>
                                        {item.name}
                                    </h3>

                                    <p style={{ color: outlineColor }}>
                                        {item.batchSize} {item.name}
                                    </p>

                                    <p style={{ color: outlineColor }}>
                                        ${item.pricePerBatch} per batch
                                    </p>

                                </CardContent>
                            </Card>
                        ))}

                    </div>

                </section>
            )}

            {/* MODAL */}
            {activeItem && (
                <div
                    onClick={() => setActiveItem(null)}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn"

                >
                    <Card
                        onClick={e => e.stopPropagation()}
                        className="bg-[#6f7f5e] p-8 max-w-md relative text-[#f5f1e6] border-2"
                        style={{ borderColor: outlineColor }}
                    >

                        <button
                            className="absolute top-3 left-3"
                            onClick={() => setActiveItem(null)}
                        >
                            <X />
                        </button>

                        <img
                            src={activeItem.image}
                            className="w-full h-[260px] object-cover rounded-xl mb-4"
                        />

                        <h2 className="text-3xl font-bold">{activeItem.name}</h2>
                        <p>{activeItem.description}</p>
                        <p><b>Ingredients:</b> {activeItem.ingredients}</p>

                        {activeItem.options && (
                            <select
                                className="w-full p-2 mt-2 rounded-md bg-[#ebe6d8] text-black border-2 border-[var(--outline)]"
                                value={option}
                                onChange={e => {
                                    setOption(e.target.value);
                                    setOptionError("");
                                }}
                            >
                                {optionError && (
                                    <p className="text-red-400 text-sm mt-2">{optionError}</p>
                                )}
                                <option value="">Select Flavor</option>
                                {activeItem.options.map(o => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        )}

                        <textarea
                            placeholder="Order Notes (optional)"
                            className="w-full p-2 mt-3 text-black rounded-md"
                            style={{ backgroundColor: "#f5f1e6" }}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />


                        <div className="flex items-center gap-4 mt-4">
                            <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                            <span>
                                {quantity} {quantity === 1 ? "batch" : "batches"}
                            </span>
                            <Button onClick={() => setQuantity(q => q + 1)}>+</Button>
                        </div>

                        <Button
                            onClick={() => addToCart(activeItem)}
                            className="mt-6 w-full"
                            disabled={activeItem.options && !option}
                        >
                            {added ? "Added!" : "Add To Cart"}
                        </Button>

                    </Card>
                </div>
            )}

            {/* CART */}
            {page === "cart" && (
                <section className="max-w-xl mx-auto p-16 space-y-8" style={{ color: textBlack }}>

                    {cart.map(i => (
                        <div key={i.cartId} className="grid grid-cols-3 gap-4 items-center">

                            <div>
                                <b>{i.name}</b>
                                {i.option && <div>({i.option})</div>}
                                {i.notes && <div className="italic text-sm">"{i.notes}"</div>}
                            </div>

                            <div className="flex justify-center items-center gap-2">
                                <Button onClick={() => adjustQty(i.cartId, -1)}>-</Button>
                                <span>{i.batches}</span>
                                <Button onClick={() => adjustQty(i.cartId, 1)}>+</Button>
                            </div>

                            <div className="text-right space-y-2">
                                <div>${i.batches * i.pricePerBatch}</div>

                                <button
                                    onClick={() => removeItem(i.cartId)}
                                    className="text-red-600 hover:text-red-800 ml-auto"
                                >
                                    <Trash2 size={26} />
                                </button>
                            </div>

                        </div>
                    ))}

                    <p className="text-xl font-bold">Total: ${cartTotal}</p>

                    <form onSubmit={onOrderSubmit} className="space-y-6">

                        <input required name="name" placeholder="Your Name" className="p-2 text-black" />
                        <input required type="email" name="email" placeholder="Your Email" className="p-2 text-black" />

                        <select value={fulfillment} onChange={e => setFulfillment(e.target.value)} className="p-2 text-black">
                            <option>Pickup</option>
                            <option>Delivery</option>
                        </select>

                        {fulfillment === "Delivery" && (
                            <>
                                <input
                                    placeholder="Delivery Address"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="p-2 text-black"
                                />
                                <p className="italic">We will contact you for a delivery quote.</p>
                            </>
                        )}

                        <input
                            type="datetime-local"
                            value={pickupTime}
                            onChange={e => setPickupTime(e.target.value)}
                            className="p-2 text-black"
                            required
                        />

                        {!isTimeValid() && pickupTime && (
                            <p className="text-red-400">
                                Must be at least 24 hours in advance.
                            </p>
                        )}

                        <input type="hidden" name="order" value={JSON.stringify(cart)} />

                        <Button type="submit" disabled={!cart.length || !isTimeValid()}>
                            Place Order
                        </Button>

                    </form>
                </section>
            )}

            {/* CONFIRMATION */}
            {showConfirmation && (
                <div
                    onClick={() => setShowConfirmation(false)}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center"
                >
                    <Card className="bg-emerald-900 p-10 text-center text-white">
                        <h2 className="text-4xl font-bold">Order Received!</h2>
                        <p className="mt-4">A confirmation email has been sent.</p>
                    </Card>
                </div>
            )}

        </div>
    );
}
