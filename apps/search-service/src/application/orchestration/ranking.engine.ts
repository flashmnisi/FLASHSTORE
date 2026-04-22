export class RankingEngine {
  /**
   * 🔥 Score a product
   */
  score(product: any, user?: any): number {
    let score = product._score || 0;

    // =========================
    // 📈 Popularity boost
    // =========================
    score += Math.log10((product.reviewCount || 0) + 1) * 2;

    // =========================
    // ⭐ Rating boost
    // =========================
    score += (product.rating || 0) * 1.5;

    // =========================
    // 📦 Stock boost
    // =========================
    if (product.inStock) score += 2;

    // =========================
    // 🆕 Recency boost
    // =========================
    if (product.createdAt) {
      const ageDays =
        (Date.now() - new Date(product.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      score += Math.max(0, 10 - ageDays * 0.1);
    }

    // =========================
    // 🎯 Personalization (future-ready)
    // =========================
    if (user?.preferredBrands?.includes(product.brand)) {
      score += 3;
    }

    return score;
  }

  /**
   * 🔥 Rank results
   */
  rank(products: any[], user?: any) {
    return products
      .map((p) => ({
        ...p,
        finalScore: this.score(p, user),
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }
}