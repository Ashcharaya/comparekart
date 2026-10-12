/**
 * ============================================================================
 * CompareKart Core Recommendation & Comparison Engine (C Language)
 * ============================================================================
 * High-performance native algorithmic module featuring:
 *  1. Weighted Recommendation Engine:
 *     Score = (Feature Match % * 0.5) + (Normalized Rating * 0.3) + (Price Saving * 0.2)
 *  2. Best Value Evaluation:
 *     Value = (Rating / Price) * 10000
 *  3. Side-by-Side Comparison Matrix (2 to 4 products) with Auto-Summary
 *  4. Fast Prefix Search Auto-complete using Trie Data Structure
 *  5. Dual Mode: Interactive Terminal UI or Headless JSON Output for Node.js
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

#define MAX_PRODUCTS 64
#define MAX_FEATURES 16
#define MAX_STORES 4
#define ALPHABET_SIZE 128

/* -------------------------------------------------------------------------- */
/* Data Structures                                                            */
/* -------------------------------------------------------------------------- */

typedef struct {
    char name[64];
    double price;
    char url[128];
} Store;

typedef struct {
    char key[64];
    char value[64];
} Feature;

typedef struct {
    int id;
    char name[128];
    char brand[64];
    char category[64];
    double price;
    double oldPrice;
    double rating;
    int reviewCount;
    int featureCount;
    Feature features[MAX_FEATURES];
    int storeCount;
    Store stores[MAX_STORES];
} Product;

typedef struct {
    const Product* product;
    double featureMatchPct;
    int matchedFeatures;
    int totalReqFeatures;
    double ratingPct;
    double priceSavingPct;
    double totalScore;
    double valueScore;
    double savings;
    bool isBestMatch;
    bool isBestValue;
} ScoredProduct;

/* -------------------------------------------------------------------------- */
/* Trie Data Structure for Fast Search Suggestions                             */
/* -------------------------------------------------------------------------- */

typedef struct TrieNode {
    struct TrieNode* children[ALPHABET_SIZE];
    int productIds[MAX_PRODUCTS];
    int productCount;
    bool isEndOfWord;
} TrieNode;

TrieNode* createTrieNode() {
    TrieNode* node = (TrieNode*)malloc(sizeof(TrieNode));
    node->isEndOfWord = false;
    node->productCount = 0;
    for (int i = 0; i < ALPHABET_SIZE; i++) {
        node->children[i] = NULL;
    }
    return node;
}

void insertTrie(TrieNode* root, const char* str, int productId) {
    TrieNode* curr = root;
    int len = strlen(str);
    for (int i = 0; i < len; i++) {
        unsigned char c = (unsigned char)tolower(str[i]);
        if (c >= ALPHABET_SIZE) continue;
        if (!curr->children[c]) {
            curr->children[c] = createTrieNode();
        }
        curr = curr->children[c];
        // Add product ID if not already in list
        bool exists = false;
        for (int j = 0; j < curr->productCount; j++) {
            if (curr->productIds[j] == productId) {
                exists = true;
                break;
            }
        }
        if (!exists && curr->productCount < MAX_PRODUCTS) {
            curr->productIds[curr->productCount++] = productId;
        }
    }
    curr->isEndOfWord = true;
}

void collectTrieMatches(TrieNode* node, int* outIds, int* outCount, int maxLimit) {
    if (!node) return;
    for (int i = 0; i < node->productCount && *outCount < maxLimit; i++) {
        bool exists = false;
        for (int j = 0; j < *outCount; j++) {
            if (outIds[j] == node->productIds[i]) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            outIds[(*outCount)++] = node->productIds[i];
        }
    }
}

int searchTrie(TrieNode* root, const char* prefix, int* outIds, int maxLimit) {
    TrieNode* curr = root;
    int len = strlen(prefix);
    int count = 0;

    for (int i = 0; i < len; i++) {
        unsigned char c = (unsigned char)tolower(prefix[i]);
        if (c >= ALPHABET_SIZE || !curr->children[c]) {
            return 0; // No match found
        }
        curr = curr->children[c];
    }

    collectTrieMatches(curr, outIds, &count, maxLimit);
    return count;
}

/* -------------------------------------------------------------------------- */
/* Global Product Database                                                    */
/* -------------------------------------------------------------------------- */

static Product database[MAX_PRODUCTS];
static int totalDatabaseProducts = 0;
static TrieNode* searchTrieRoot = NULL;

void addProduct(Product p) {
    if (totalDatabaseProducts < MAX_PRODUCTS) {
        database[totalDatabaseProducts] = p;
        // Index words into Trie for prefix autocomplete
        char temp[256];
        strncpy(temp, p.name, sizeof(temp) - 1);
        char* token = strtok(temp, " ");
        while (token) {
            insertTrie(searchTrieRoot, token, p.id);
            token = strtok(NULL, " ");
        }
        insertTrie(searchTrieRoot, p.brand, p.id);
        insertTrie(searchTrieRoot, p.category, p.id);

        totalDatabaseProducts++;
    }
}

void initializeDatabase() {
    searchTrieRoot = createTrieNode();

    // 1. Mobiles & Electronics Appliances
    addProduct((Product){
        .id = 1,
        .name = "PixelPrime Pro 5G (8GB RAM, 128GB Storage)",
        .brand = "PixelTech",
        .category = "Mobiles & Electronics Appliances",
        .price = 24999.0,
        .oldPrice = 32999.0,
        .rating = 4.6,
        .reviewCount = 5410,
        .featureCount = 6,
        .features = {
            {"5g", "yes"}, {"ram", "8"}, {"battery", "5000"},
            {"display", "amoled"}, {"camera", "64mp"}, {"charging", "67w"}
        },
        .storeCount = 3,
        .stores = {
            {"CompareKart Direct", 24999.0, "https://comparekart.com"},
            {"Flipkart Electronics", 25499.0, "https://flipkart.com"},
            {"Croma Digital", 25999.0, "https://croma.com"}
        }
    });

    addProduct((Product){
        .id = 2,
        .name = "UltraLite Slim 5G Smartphone (6GB RAM, 128GB)",
        .brand = "NeoVolt",
        .category = "Mobiles & Electronics Appliances",
        .price = 14999.0,
        .oldPrice = 19999.0,
        .rating = 4.4,
        .reviewCount = 3820,
        .featureCount = 5,
        .features = {
            {"5g", "yes"}, {"ram", "6"}, {"battery", "5000"},
            {"display", "ips"}, {"camera", "50mp"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 14999.0, "https://comparekart.com"},
            {"Amazon India", 15299.0, "https://amazon.in"}
        }
    });

    addProduct((Product){
        .id = 3,
        .name = "Apex Max Flagship 5G (12GB RAM, 256GB)",
        .brand = "Apex",
        .category = "Mobiles & Electronics Appliances",
        .price = 48999.0,
        .oldPrice = 59999.0,
        .rating = 4.8,
        .reviewCount = 2900,
        .featureCount = 6,
        .features = {
            {"5g", "yes"}, {"ram", "12"}, {"battery", "5400"},
            {"display", "amoled"}, {"camera", "108mp"}, {"charging", "100w"}
        },
        .storeCount = 3,
        .stores = {
            {"CompareKart Direct", 48999.0, "https://comparekart.com"},
            {"Official Store", 49999.0, "https://apex.com"},
            {"Croma Retail", 50999.0, "https://croma.com"}
        }
    });

    addProduct((Product){
        .id = 4,
        .name = "SmartVision 43 Inch 4K Ultra HD Smart TV",
        .brand = "VisionTech",
        .category = "Mobiles & Electronics Appliances",
        .price = 21999.0,
        .oldPrice = 34999.0,
        .rating = 4.4,
        .reviewCount = 1870,
        .featureCount = 4,
        .features = {
            {"display", "4k uhd"}, {"energyrating", "4"},
            {"audio", "dolby atmos"}, {"capacity", "43 inch"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 21999.0, "https://comparekart.com"},
            {"Reliance Digital", 22999.0, "https://reliancedigital.in"}
        }
    });

    // 2. Clothes
    addProduct((Product){
        .id = 11,
        .name = "Men Slim Fit Pure Cotton Casual Shirt",
        .brand = "Roadster",
        .category = "Clothes",
        .price = 899.0,
        .oldPrice = 1999.0,
        .rating = 4.3,
        .reviewCount = 1420,
        .featureCount = 4,
        .features = {
            {"fabric", "cotton"}, {"gender", "men"},
            {"fit", "slim"}, {"sleeve", "long"}
        },
        .storeCount = 3,
        .stores = {
            {"CompareKart Direct", 899.0, "https://comparekart.com"},
            {"Myntra Mart", 949.0, "https://myntra.com"},
            {"Ajio Trends", 999.0, "https://ajio.com"}
        }
    });

    addProduct((Product){
        .id = 12,
        .name = "Women Floral Print A-Line Midi Dress",
        .brand = "ZaraStyle",
        .category = "Clothes",
        .price = 1499.0,
        .oldPrice = 2799.0,
        .rating = 4.5,
        .reviewCount = 980,
        .featureCount = 4,
        .features = {
            {"fabric", "rayon"}, {"gender", "women"},
            {"fit", "flared"}, {"pattern", "floral"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 1499.0, "https://comparekart.com"},
            {"Nykaa Fashion", 1549.0, "https://nykaafashion.com"}
        }
    });

    addProduct((Product){
        .id = 13,
        .name = "Men Tapered Stretch Denim Jeans",
        .brand = "LeviCraft",
        .category = "Clothes",
        .price = 2499.0,
        .oldPrice = 4299.0,
        .rating = 4.4,
        .reviewCount = 3100,
        .featureCount = 4,
        .features = {
            {"fabric", "cotton"}, {"gender", "men"},
            {"fit", "slim"}, {"stretch", "active"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 2499.0, "https://comparekart.com"},
            {"Lifestyle Mart", 2799.0, "https://lifestyle.com"}
        }
    });

    // 3. Sports & Toys
    addProduct((Product){
        .id = 21,
        .name = "ProStance English Willow Cricket Bat",
        .brand = "WillowKing",
        .category = "Sports & Toys",
        .price = 4999.0,
        .oldPrice = 8999.0,
        .rating = 4.6,
        .reviewCount = 640,
        .featureCount = 4,
        .features = {
            {"material", "willow"}, {"agegroup", "adult"},
            {"weight", "1200g"}, {"sweetspot", "mid"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 4999.0, "https://comparekart.com"},
            {"Decathlon Sport", 5499.0, "https://decathlon.in"}
        }
    });

    addProduct((Product){
        .id = 22,
        .name = "AeroSmash Carbon Fiber Badminton Racket",
        .brand = "YonCraft",
        .category = "Sports & Toys",
        .price = 2499.0,
        .oldPrice = 4499.0,
        .rating = 4.7,
        .reviewCount = 2150,
        .featureCount = 4,
        .features = {
            {"material", "carbon"}, {"weight", "82g"},
            {"agegroup", "adult"}, {"tension", "30lbs"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 2499.0, "https://comparekart.com"},
            {"SportsIndia", 2699.0, "https://sportsindia.com"}
        }
    });

    // 4. Beauty Products
    addProduct((Product){
        .id = 31,
        .name = "HydraGlow 10% Vitamin C Radiance Face Serum",
        .brand = "GlowScience",
        .category = "Beauty Products",
        .price = 649.0,
        .oldPrice = 999.0,
        .rating = 4.6,
        .reviewCount = 3890,
        .featureCount = 4,
        .features = {
            {"ingredients", "vitaminc"}, {"skintype", "all"},
            {"benefit", "brightening"}, {"crueltyfree", "yes"}
        },
        .storeCount = 3,
        .stores = {
            {"CompareKart Direct", 649.0, "https://comparekart.com"},
            {"Nykaa Beauty", 699.0, "https://nykaa.com"},
            {"Purplle Store", 729.0, "https://purplle.com"}
        }
    });

    addProduct((Product){
        .id = 32,
        .name = "UltraMatte Oil-Free Gel Sunscreen SPF 50",
        .brand = "DermaShield",
        .category = "Beauty Products",
        .price = 499.0,
        .oldPrice = 799.0,
        .rating = 4.7,
        .reviewCount = 4850,
        .featureCount = 4,
        .features = {
            {"spf", "50"}, {"skintype", "oily"},
            {"finish", "matte"}, {"crueltyfree", "yes"}
        },
        .storeCount = 2,
        .stores = {
            {"CompareKart Direct", 499.0, "https://comparekart.com"},
            {"Nykaa Beauty", 549.0, "https://nykaa.com"}
        }
    });
}

/* -------------------------------------------------------------------------- */
/* Recommendation Engine Scoring Logic                                        */
/* -------------------------------------------------------------------------- */

int compareScoredProducts(const void* a, const void* b) {
    ScoredProduct* p1 = (ScoredProduct*)a;
    ScoredProduct* p2 = (ScoredProduct*)b;
    if (p2->totalScore > p1->totalScore) return 1;
    if (p2->totalScore < p1->totalScore) return -1;
    return 0;
}

int recommendProducts(const char* category, double budget,
                      const char reqKeys[][64], const char reqVals[][64], int reqCount,
                      ScoredProduct* outResults, int maxResults) {

    ScoredProduct candidateList[MAX_PRODUCTS];
    int candidateCount = 0;

    for (int i = 0; i < totalDatabaseProducts; i++) {
        Product* p = &database[i];

        // Filter by category
        if (category && strlen(category) > 0 && strcmp(category, "All") != 0) {
            if (strcasecmp(p->category, category) != 0) {
                continue;
            }
        }

        // Budget ceiling check (with 10% tolerance)
        if (budget > 0 && p->price > (budget * 1.10)) {
            continue;
        }

        // Feature matching calculation
        int matched = 0;
        if (reqCount > 0) {
            for (int r = 0; r < reqCount; r++) {
                bool found = false;
                for (int f = 0; f < p->featureCount; f++) {
                    if (strcasecmp(p->features[f].key, reqKeys[r]) == 0) {
                        // Check value compatibility
                        if (strcasecmp(reqVals[r], "yes") == 0 || strcasecmp(reqVals[r], "true") == 0) {
                            if (strcasecmp(p->features[f].value, "yes") == 0 || strcasecmp(p->features[f].value, "true") == 0) {
                                found = true;
                            }
                        } else {
                            double reqNum = atof(reqVals[r]);
                            double actualNum = atof(p->features[f].value);
                            if (reqNum > 0 && actualNum > 0) {
                                if (actualNum >= reqNum) found = true;
                            } else if (strstr(p->features[f].value, reqVals[r])) {
                                found = true;
                            }
                        }
                        break;
                    }
                }
                if (found) matched++;
            }
        }

        double featureMatchPct = reqCount > 0 ? ((double)matched / reqCount) * 100.0 : 100.0;
        double ratingPct = (p->rating / 5.0) * 100.0;
        double priceSavingPct = 50.0;

        if (budget > 0) {
            priceSavingPct = (p->price <= budget) ? ((budget - p->price) / budget) * 100.0 : 0.0;
        }

        // Weighted formula: (Feature Match * 0.5) + (Rating * 0.3) + (Savings * 0.2)
        double totalScore = (featureMatchPct * 0.5) + (ratingPct * 0.3) + (priceSavingPct * 0.2);
        double valueScore = (p->rating / p->price) * 10000.0;

        candidateList[candidateCount].product = p;
        candidateList[candidateCount].matchedFeatures = matched;
        candidateList[candidateCount].totalReqFeatures = reqCount;
        candidateList[candidateCount].featureMatchPct = featureMatchPct;
        candidateList[candidateCount].ratingPct = ratingPct;
        candidateList[candidateCount].priceSavingPct = priceSavingPct;
        candidateList[candidateCount].totalScore = totalScore;
        candidateList[candidateCount].valueScore = valueScore;
        candidateList[candidateCount].savings = budget > p->price ? (budget - p->price) : 0.0;
        candidateList[candidateCount].isBestMatch = false;
        candidateList[candidateCount].isBestValue = false;

        candidateCount++;
    }

    if (candidateCount == 0) return 0;

    // Sort candidates descending by totalScore
    qsort(candidateList, candidateCount, sizeof(ScoredProduct), compareScoredProducts);

    // Identify Best Value (highest rating per rupee)
    int bestValueIdx = 0;
    for (int i = 1; i < candidateCount; i++) {
        if (candidateList[i].valueScore > candidateList[bestValueIdx].valueScore) {
            bestValueIdx = i;
        }
    }
    candidateList[bestValueIdx].isBestValue = true;
    candidateList[0].isBestMatch = true;

    int returnCount = candidateCount < maxResults ? candidateCount : maxResults;
    for (int i = 0; i < returnCount; i++) {
        outResults[i] = candidateList[i];
    }

    return returnCount;
}

/* -------------------------------------------------------------------------- */
/* Side-by-Side Comparison Engine                                             */
/* -------------------------------------------------------------------------- */

void compareProducts(const int* ids, int count, double budget) {
    if (count < 1 || count > 4) {
        printf("Error: Can compare between 1 and 4 products.\n");
        return;
    }

    const Product* prods[4];
    int validCount = 0;

    for (int i = 0; i < count; i++) {
        for (int j = 0; j < totalDatabaseProducts; j++) {
            if (database[j].id == ids[i]) {
                prods[validCount++] = &database[j];
                break;
            }
        }
    }

    if (validCount == 0) {
        printf("No matching products found for the given IDs.\n");
        return;
    }

    // Determine Best Price and Best Rating
    const Product* bestPrice = prods[0];
    const Product* bestRating = prods[0];

    for (int i = 1; i < validCount; i++) {
        if (prods[i]->price < bestPrice->price) bestPrice = prods[i];
        if (prods[i]->rating > bestRating->rating) bestRating = prods[i];
    }

    printf("\n========================================================================================\n");
    printf("                       COMPAREKART SIDE-BY-SIDE SPECIFICATION MATRIX                   \n");
    printf("========================================================================================\n");

    printf("%-20s", "ATTRIBUTE");
    for (int i = 0; i < validCount; i++) {
        printf(" | %-26.26s", prods[i]->name);
    }
    printf("\n----------------------------------------------------------------------------------------\n");

    // Brand
    printf("%-20s", "Brand");
    for (int i = 0; i < validCount; i++) {
        printf(" | %-26s", prods[i]->brand);
    }
    printf("\n");

    // Price with highlight
    printf("%-20s", "Price (INR)");
    for (int i = 0; i < validCount; i++) {
        char buf[32];
        if (prods[i]->id == bestPrice->id) {
            snprintf(buf, sizeof(buf), "Rs. %.0f [BEST PRICE]", prods[i]->price);
        } else {
            snprintf(buf, sizeof(buf), "Rs. %.0f", prods[i]->price);
        }
        printf(" | %-26s", buf);
    }
    printf("\n");

    // Rating
    printf("%-20s", "Rating");
    for (int i = 0; i < validCount; i++) {
        char buf[32];
        if (prods[i]->id == bestRating->id) {
            snprintf(buf, sizeof(buf), "%.1f/5.0 [TOP RATED]", prods[i]->rating);
        } else {
            snprintf(buf, sizeof(buf), "%.1f/5.0 (%d)", prods[i]->rating, prods[i]->reviewCount);
        }
        printf(" | %-26s", buf);
    }
    printf("\n");

    // Value Score (Rating per Rupee)
    printf("%-20s", "Value (Score/Rs)");
    for (int i = 0; i < validCount; i++) {
        double vs = (prods[i]->rating / prods[i]->price) * 10000.0;
        char buf[32];
        snprintf(buf, sizeof(buf), "%.2f pts", vs);
        printf(" | %-26s", buf);
    }
    printf("\n");

    // Stores comparison
    printf("%-20s", "Cheapest Store");
    for (int i = 0; i < validCount; i++) {
        if (prods[i]->storeCount > 0) {
            Store minStore = prods[i]->stores[0];
            for (int s = 1; s < prods[i]->storeCount; s++) {
                if (prods[i]->stores[s].price < minStore.price) {
                    minStore = prods[i]->stores[s];
                }
            }
            char buf[32];
            snprintf(buf, sizeof(buf), "%s (Rs. %.0f)", minStore.name, minStore.price);
            printf(" | %-26s", buf);
        } else {
            printf(" | %-26s", "Direct");
        }
    }
    printf("\n========================================================================================\n");

    // Automatic Natural Language Summary
    printf("\n>>> AUTOMATIC RECOMMENDATION SUMMARY:\n");
    if (budget > 0) {
        const Product* withinBudget[4];
        int inBudgetCount = 0;
        for (int i = 0; i < validCount; i++) {
            if (prods[i]->price <= budget) {
                withinBudget[inBudgetCount++] = prods[i];
            }
        }

        if (inBudgetCount > 0) {
            const Product* bestChoice = withinBudget[0];
            for (int i = 1; i < inBudgetCount; i++) {
                if (withinBudget[i]->rating > bestChoice->rating ||
                    (withinBudget[i]->rating == bestChoice->rating && withinBudget[i]->price < bestChoice->price)) {
                    bestChoice = withinBudget[i];
                }
            }
            double savings = budget - bestChoice->price;
            printf("\"%s is the best overall choice within your Rs. %.0f budget because it delivers a\n"
                   " stellar rating of %.1f/5.0 at Rs. %.0f, saving you Rs. %.0f.\"\n",
                   bestChoice->name, budget, bestChoice->rating, bestChoice->price, savings);
        } else {
            printf("\"All selected products exceed your Rs. %.0f budget. The closest option is %s at Rs. %.0f.\"\n",
                   budget, bestPrice->name, bestPrice->price);
        }
    } else {
        printf("\"%s delivers the highest rating (%.1f/5.0), while %s offers the lowest entry price at Rs. %.0f.\"\n",
               bestRating->name, bestRating->rating, bestPrice->name, bestPrice->price);
    }
    printf("========================================================================================\n\n");
}

/* -------------------------------------------------------------------------- */
/* Terminal UI & Menu                                                         */
/* -------------------------------------------------------------------------- */

void printBanner() {
    printf("\n");
    printf("  =======================================================\n");
    printf("  |             COMPAREKART C CORE ENGINE               |\n");
    printf("  |   Flipkart-Style Product Recommendations & Matrix   |\n");
    printf("  =======================================================\n");
}

void runInteractiveMenu() {
    int choice = 0;
    while (1) {
        printBanner();
        printf("  1. Smart Budget Recommendation Wizard\n");
        printf("  2. Compare Products Side-by-Side (2 to 4 IDs)\n");
        printf("  3. Live Trie Prefix Search Autocomplete\n");
        printf("  4. View All Products in Database\n");
        printf("  5. Exit Engine\n");
        printf("  -------------------------------------------------------\n");
        printf("  Enter your selection (1-5): ");
        if (scanf("%d", &choice) != 1) {
            while (getchar() != '\n');
            continue;
        }

        if (choice == 1) {
            char category[64];
            double budget = 0;
            int featureCount = 0;
            char keys[MAX_FEATURES][64];
            char vals[MAX_FEATURES][64];

            printf("\n--- Step 1: Select Category ---\n");
            printf("Options: [1] Mobiles & Electronics Appliances, [2] Clothes, [3] Sports & Toys, [4] Beauty Products\n");
            int catChoice;
            printf("Choice (1-4): ");
            scanf("%d", &catChoice);

            if (catChoice == 1) strcpy(category, "Mobiles & Electronics Appliances");
            else if (catChoice == 2) strcpy(category, "Clothes");
            else if (catChoice == 3) strcpy(category, "Sports & Toys");
            else if (catChoice == 4) strcpy(category, "Beauty Products");
            else strcpy(category, "All");

            printf("\n--- Step 2: Set Maximum Budget (in INR) ---\n");
            printf("Enter budget (e.g. 25000): ");
            scanf("%lf", &budget);

            printf("\n--- Step 3: Must-Have Features ---\n");
            printf("How many must-have features do you need? (0-3): ");
            scanf("%d", &featureCount);

            for (int i = 0; i < featureCount; i++) {
                printf("Feature %d Key (e.g. 5g, ram, battery, fabric, spf): ", i + 1);
                scanf("%s", keys[i]);
                printf("Feature %d Value (e.g. yes, 8, 5000, cotton, 50): ", i + 1);
                scanf("%s", vals[i]);
            }

            printf("\n--- Step 4: Computing Algorithmic Recommendations ---\n");
            ScoredProduct results[10];
            int resCount = recommendProducts(category, budget, keys, vals, featureCount, results, 10);

            if (resCount == 0) {
                printf("No matching products found within Rs. %.0f.\n", budget);
            } else {
                printf("\nRank | Score | Badge       | Price      | Rating | Product Name\n");
                printf("----------------------------------------------------------------------------------\n");
                for (int i = 0; i < resCount; i++) {
                    const char* badge = results[i].isBestMatch ? "BEST MATCH" : (results[i].isBestValue ? "BEST VALUE" : "RECOMMENDED");
                    printf("#%-3d | %5.1f | %-11s | Rs. %-6.0f | %.1f★   | %s\n",
                           i + 1, results[i].totalScore, badge,
                           results[i].product->price, results[i].product->rating,
                           results[i].product->name);
                    printf("      Matches %d of %d features | Savings within budget: Rs. %.0f\n",
                           results[i].matchedFeatures, results[i].totalReqFeatures, results[i].savings);
                }
            }
            printf("\nPress Enter to return to menu...");
            getchar(); getchar();

        } else if (choice == 2) {
            int idCount = 0;
            int ids[4];
            double budget = 0;

            printf("\nEnter number of products to compare (2 to 4): ");
            scanf("%d", &idCount);
            if (idCount < 2) idCount = 2;
            if (idCount > 4) idCount = 4;

            for (int i = 0; i < idCount; i++) {
                printf("Enter Product ID %d (e.g. 1, 2, 3, 11, 21, 31): ", i + 1);
                scanf("%d", &ids[i]);
            }
            printf("Enter optional target budget (0 for none): ");
            scanf("%lf", &budget);

            compareProducts(ids, idCount, budget);

            printf("Press Enter to return to menu...");
            getchar(); getchar();

        } else if (choice == 3) {
            char query[64];
            printf("\nEnter search prefix (e.g. '5g', 'pixel', 'cot', 'bat', 'serum'): ");
            scanf("%s", query);

            int matchedIds[16];
            int count = searchTrie(searchTrieRoot, query, matchedIds, 16);

            printf("\nFound %d instant suggestions for prefix '%s':\n", count, query);
            for (int i = 0; i < count; i++) {
                for (int j = 0; j < totalDatabaseProducts; j++) {
                    if (database[j].id == matchedIds[i]) {
                        printf(" -> [ID %d] %s (%s) - Rs. %.0f (Rating: %.1f★)\n",
                               database[j].id, database[j].name, database[j].brand,
                               database[j].price, database[j].rating);
                        break;
                    }
                }
            }
            printf("\nPress Enter to return to menu...");
            getchar(); getchar();

        } else if (choice == 4) {
            printf("\nAll Products in CompareKart Database:\n");
            printf("----------------------------------------------------------------------------------\n");
            for (int i = 0; i < totalDatabaseProducts; i++) {
                printf("[ID %2d] %-30s | %-12s | Rs. %-6.0f | %.1f★\n",
                       database[i].id, database[i].name, database[i].category,
                       database[i].price, database[i].rating);
            }
            printf("----------------------------------------------------------------------------------\n");
            printf("Press Enter to return to menu...");
            getchar(); getchar();

        } else if (choice == 5) {
            printf("Exiting CompareKart C Engine. Happy comparing!\n");
            break;
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Main Entry Point (Supports CLI Flags & Interactive Mode)                   */
/* -------------------------------------------------------------------------- */

int main(int argc, char* argv[]) {
    initializeDatabase();

    // Headless / CLI invocation mode (e.g. from Node.js or scripts)
    if (argc > 1) {
        if (strcmp(argv[1], "--recommend") == 0 && argc >= 4) {
            const char* category = argv[2];
            double budget = atof(argv[3]);
            ScoredProduct results[10];
            int count = recommendProducts(category, budget, NULL, NULL, 0, results, 10);

            // Output JSON for external programs / Node.js
            printf("{\"success\":true,\"count\":%d,\"recommendations\":[", count);
            for (int i = 0; i < count; i++) {
                printf("{\"id\":%d,\"name\":\"%s\",\"price\":%.0f,\"rating\":%.1f,\"score\":%.1f,\"isBestMatch\":%s,\"isBestValue\":%s}%s",
                       results[i].product->id, results[i].product->name,
                       results[i].product->price, results[i].product->rating,
                       results[i].totalScore,
                       results[i].isBestMatch ? "true" : "false",
                       results[i].isBestValue ? "true" : "false",
                       (i == count - 1) ? "" : ",");
            }
            printf("]}\n");
            return 0;
        } else if (strcmp(argv[1], "--compare") == 0 && argc >= 3) {
            int ids[4] = {0};
            int count = 0;
            char* token = strtok(argv[2], ",");
            while (token && count < 4) {
                ids[count++] = atoi(token);
                token = strtok(NULL, ",");
            }
            double budget = (argc >= 4) ? atof(argv[3]) : 0;
            compareProducts(ids, count, budget);
            return 0;
        } else if (strcmp(argv[1], "--search") == 0 && argc >= 3) {
            int matchedIds[16];
            int count = searchTrie(searchTrieRoot, argv[2], matchedIds, 16);
            printf("{\"query\":\"%s\",\"matches\":%d}\n", argv[2], count);
            return 0;
        }
    }

    // Default: run interactive terminal interface
    runInteractiveMenu();
    return 0;
}
