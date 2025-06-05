"use client";

interface CheaperAlternativeNudgeProps {
    currentProduct: string;
    currentPrice: number;
    alternativeProduct: string;
    alternativePrice: number;
    onAcceptAction: () => void;
    onRejectAction: () => void;
    isAlreadyCheapest?: boolean;
}

/**
 * CheaperAlternativeNudge component displays a nudge to encourage users to consider a
 * less expensive alternative product. It shows the current product, its price,
 * and a suggested alternative with its price.
 */
export default function CheaperAlternativeNudge(
    {
        currentProduct,
        currentPrice,
        alternativeProduct,
        alternativePrice,
        onAcceptAction,
        onRejectAction,
        isAlreadyCheapest = false
    }: CheaperAlternativeNudgeProps) {
    const savings = currentPrice - alternativePrice;

    if (isAlreadyCheapest) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md mx-4">
                    <h3 className="text-lg font-semibold mb-4 text-orange-600">
                        💡 Think It Over
                    </h3>
                    <p className="mb-4 text-gray-700">
                        <strong>{currentProduct}</strong> is already the cheapest option in its category.
                    </p>
                    <p className="mb-4 text-orange-600 font-semibold">
                        You could save €{currentPrice.toFixed(2)} by not buying this at all!
                    </p>
                    <p className="mb-4 text-gray-600">
                        Sometimes the best purchase is no purchase. Take a moment to really think about whether you need
                        this item right now.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onAcceptAction}
                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                        >
                            Remove & Save €{currentPrice.toFixed(2)}
                        </button>
                        <button
                            onClick={onRejectAction}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                        >
                            Keep in Cart
                        </button>
                    </div>
                </div>
            </div>);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                    💰 Save Money with This Alternative
                </h3>
                <p className="mb-4 text-gray-700">
                    Instead of <strong>{currentProduct}</strong> (€{currentPrice}),
                    consider <strong>{alternativeProduct}</strong> (€{alternativePrice}).
                </p>
                <p className="mb-4 text-green-600 font-semibold">
                    You could save €{savings.toFixed(2)}!
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onAcceptAction}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Switch to Alternative
                    </button>
                    <button
                        onClick={onRejectAction}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Keep Original
                    </button>
                </div>
            </div>
        </div>
    );
}
