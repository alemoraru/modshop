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

    private selectNudge(cartTotal: number, itemCount: number): NudgeType {
        const stats = this.getUserStats();

        const gentleSuccess = stats.gentle.shown > 0 ? stats.gentle.accepted / stats.gentle.shown : 0.5;
        const altSuccess = stats.alternative.shown > 0 ? stats.alternative.accepted / stats.alternative.shown : 0.5;
        const blockSuccess = stats.block.shown > 0 ? stats.block.completed / stats.block.shown : 0.8;

        if (cartTotal > 100 || itemCount > 5) {
            return blockSuccess > gentleSuccess ? 'block' : 'gentle';
        } else if (cartTotal > 50) {
            return altSuccess > gentleSuccess ? 'alternative' : 'gentle';
        } else {
            return Math.random() > 0.7 ? 'gentle' : 'none';
        }
    }

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

    async triggerNudge(cartItems: {
        title: string;
        price: number;
        quantity: number;
        slug?: string;
        category?: string
    }[], cartTotal: number): Promise<NudgeResponse> {
        const nudgeType = this.selectNudge(cartTotal, cartItems.length);

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
                return {
                    type: 'block',
                    data: {
                        duration: Math.random() > 0.5 ? 15 : 20
                    }
                };

            default:
                return {type: 'none'};
        }
    }

    recordNudgeInteraction(type: NudgeType, accepted: boolean) {
        const stats = this.getUserStats();

        switch (type) {
            case 'gentle':
                stats.gentle.shown++;
                if (accepted) stats.gentle.accepted++;
                if (accepted) stats.gentle.savings += item.price;
                break;
            case 'alternative':
                stats.alternative.shown++;
                if (accepted) stats.alternative.accepted++;
                if (accepted) stats.alternative.savings += item.price - alternative.price;
                break;
            case 'block':
                stats.block.shown++;
                stats.block.completed++;
                stats.block.savings += item.price
                break;
        }

        this.saveUserStats(stats);
    }
}

export const nudgeService = new NudgeService();
