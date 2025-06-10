export type NudgeType = 'none' | 'gentle' | 'alternative' | 'block';

export interface NudgeResponse {
    type: NudgeType;
    data?: {
        productTitle?: string;
        currentProduct?: string;
        currentPrice?: number;
        alternativeProduct?: string;
        alternativePrice?: number;
        alternativeSlug?: string;
        alternativeImage?: string;
        alternativeCategory?: string;
        duration?: number;
        isAlreadyCheapest?: boolean;
    };
}

export interface UserNudgeStats {
    gentle: { shown: number; accepted: number; savings: number };
    alternative: { shown: number; accepted: number; savings: number };
    block: { shown: number; completed: number; savings: number };
}

/**
 * Service to manage nudges for users based on their cart interactions.
 */
class NudgeService {
    private getUserStats(): UserNudgeStats {
        const stored = localStorage.getItem("modshop_nudge_stats");
        return stored ? JSON.parse(stored) : {
            gentle: {shown: 0, accepted: 0, savings: 0},
            alternative: {shown: 0, accepted: 0, savings: 0},
            block: {shown: 0, completed: 0, savings: 0}
        };
    }

    private saveUserStats(stats: UserNudgeStats) {
        localStorage.setItem("modshop_nudge_stats", JSON.stringify(stats));
    }

    /**
     * Selects a nudge type based on the user's interaction history and current cart items.
     * Uses UCB1 algorithm to balance exploration and exploitation.
     * @param cartItems - Array of items in the cart, each with a price.
     * @return A NudgeType indicating which nudge to show.
     */
    private selectNudge(cartItems: { price: number }[]): NudgeType {
        if (cartItems.length === 0) return 'none';

        const stats = this.getUserStats();
        const totalShown = stats.gentle.shown + stats.alternative.shown + stats.block.shown;

        // If not enough data, explore randomly
        if (totalShown < 5) {
            return ['gentle', 'alternative', 'block'][Math.floor(Math.random() * 3)] as NudgeType;
        }

        // Calculate UCB1 values (mean reward + exploration bonus)
        const ucb = (savings: number, shown: number) => {
            if (shown === 0) return Infinity;
            return (savings / shown) + Math.sqrt(2 * Math.log(totalShown) / shown);
        };

        const gentleUCB = ucb(stats.gentle.savings, stats.gentle.shown);
        const altUCB = ucb(stats.alternative.savings, stats.alternative.shown);
        const blockUCB = ucb(stats.block.savings, stats.block.shown);

        const max = Math.max(gentleUCB, altUCB, blockUCB);

        if (max === blockUCB) return 'block';
        if (max === altUCB) return 'alternative';
        return 'gentle';
    }


    /**
     * Fetches a less expensive alternative for the given item in its respective category
     * if it exists and is indeed less expensive than the current item.
     * @param item
     */
    async getCheaperAlternative(item: {
        title: string;
        price: number;
        quantity: number;
        slug?: string;
        category?: string
    }) {
        try {
            let category = item.category;

            if (!category) {
                const title = item.title.toLowerCase();
                if (title.includes('shirt') || title.includes('tshirt') || title.includes('polo') || title.includes('jeans') || title.includes('pants') || title.includes('chino') || title.includes('hoodie') || title.includes('jacket') || title.includes('fleece')) {
                    category = 'clothing';
                } else if (title.includes('game') || title.includes('theft') || title.includes('cyberpunk') || title.includes('witcher') || title.includes('doom') || title.includes('red dead')) {
                    category = 'video-games';
                } else if (title.includes('book') || title.includes('habits') || title.includes('work') || title.includes('guide') || title.includes('atomic') || title.includes('deep')) {
                    category = 'books';
                } else if (title.includes('lamp') || title.includes('kitchen') || title.includes('bottle') || title.includes('scale') || title.includes('container') || title.includes('toilet')) {
                    category = 'household';
                }
            }

            if (category) {
                const response = await fetch(`/api/products?category=${category}&exclude=${item.slug || ''}`);
                if (response.ok) {
                    const cheapestProduct = await response.json();

                    if (cheapestProduct && cheapestProduct.price < item.price) {
                        return {
                            name: cheapestProduct.title,
                            price: cheapestProduct.price,
                            slug: cheapestProduct.slug,
                            image: cheapestProduct.image,
                            category: cheapestProduct.category,
                            description: cheapestProduct.description
                        };
                    } else if (cheapestProduct) {
                        return {
                            name: 'Already the cheapest option',
                            price: item.price,
                            isAlreadyCheapest: true,
                            category: category
                        };
                    }
                }
            }

            return {
                name: 'Budget-Friendly Alternative',
                price: Math.max(5, item.price * 0.7)
            };
        } catch (error) {
            console.error('Error fetching cheaper alternative:', error);
            return {
                name: 'Budget-Friendly Alternative',
                price: Math.max(5, item.price * 0.7)
            };
        }
    }

    /**
     * Triggers a nudge based on the current cart items and total.
     * @param cartItems - Array of items in the cart, each with title, price, quantity, and optional slug and category.
     * @param cartTotal - Total price of the cart (i.e., sum of all item prices).
     * @return A promise that resolves to a NudgeResponse object containing the type of nudge and relevant data.
     */
    async triggerNudge(cartItems: {
        title: string;
        price: number;
        quantity: number;
        slug?: string;
        category?: string
    }[], cartTotal: number): Promise<NudgeResponse> {
        const nudgeType = this.selectNudge(cartItems);

        switch (nudgeType) {
            case 'gentle':
                return {
                    type: 'gentle',
                    data: {
                        productTitle: cartItems[0]?.title || 'this item'
                    }
                };

            case 'alternative':
                const alternative = await this.getCheaperAlternative(cartItems[0]);
                return {
                    type: 'alternative',
                    data: {
                        currentProduct: cartItems[0]?.title || 'Current item',
                        currentPrice: cartItems[0]?.price || 0,
                        alternativeProduct: alternative.name,
                        alternativePrice: alternative.price,
                        alternativeSlug: alternative.slug,
                        alternativeImage: alternative.image,
                        alternativeCategory: alternative.category,
                        isAlreadyCheapest: alternative.isAlreadyCheapest
                    }
                };

            case 'block':
                const blockDuration = Math.min(60, Math.max(10, Math.round(cartTotal / 10) * 5));
                return {
                    type: 'block',
                    data: {
                        duration: blockDuration
                    }
                };

            default:
                return {type: 'none'};
        }
    }

    /**
     * Records a user's interaction with a nudge, updating their stats accordingly.
     * @param type - The type of nudge interaction (gentle, alternative, block).
     * @param accepted - Whether the user accepted the nudge or not.
     * @param options - Additional options for the nudge interaction, such as current item price, alternative price, and cart total.
     */
    recordNudgeInteraction(
        type: NudgeType,
        accepted: boolean,
        options?: {
            currentItemPrice?: number;
            alternativePrice?: number;
            cartTotal?: number;
        }) {

        const stats = this.getUserStats();

        switch (type) {
            case 'gentle':
                stats.gentle.shown++;
                if (accepted) {
                    stats.gentle.accepted++;
                    stats.gentle.savings += options?.currentItemPrice || 0;
                }
                break;
            case 'alternative':
                stats.alternative.shown++;
                if (accepted && options?.currentItemPrice && options?.alternativePrice != null) {
                    stats.alternative.accepted++;
                    stats.alternative.savings += Math.max(0, options.currentItemPrice - options.alternativePrice);
                }
                break;
            case 'block':
                stats.block.shown++;
                stats.block.completed++;
                stats.block.savings += options?.cartTotal || 0;
                break;
        }

        this.saveUserStats(stats);
    }

}

/**
 * Singleton instance of NudgeService to be used throughout the application.
 */
export const nudgeService = new NudgeService();
