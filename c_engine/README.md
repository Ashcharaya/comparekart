# CompareKart Native C Core Engine ⚡

A high-performance C implementation of the CompareKart Product Recommendation and Comparison Matrix, featuring:

1. **Weighted Multi-Factor Recommendation Algorithm**:
   $$\text{Score} = (\text{Feature Match } \% \times 0.5) + (\text{Normalized Rating } \times 0.3) + (\text{Budget Saving } \% \times 0.2)$$
2. **Best Value Rating per Rupee Metric**:
   $$\text{Value} = \frac{\text{Rating}}{\text{Price}} \times 10000$$
3. **Side-by-Side Product Comparison Matrix (2 to 4 items)**:
   - Formatted side-by-side terminal matrix.
   - Highlights Lowest Price and Highest Rating.
   - Auto-generated Natural Language Summary.
4. **Trie Prefix Search Data Structure**:
   - $O(L)$ fast prefix matching for live search suggestions.
5. **Headless & Interactive Modes**:
   - Interactive terminal UI wizard.
   - Headless JSON CLI output for integration with Node.js / Express microservices.

---

## 🛠️ How to Compile & Run

### 1. Compile with GCC
```bash
cd CompareKart/c_engine
gcc -Wall -O2 comparekart.c -o comparekart.exe
```

### 2. Interactive Terminal UI Mode
```bash
./comparekart.exe
```
Provides an interactive menu for:
- Step-by-Step Recommendation Wizard
- Side-by-Side Product Comparison
- Live Trie Search
- Product Database Listing

### 3. CLI / Headless JSON Mode (For Node.js / Microservices)

**Recommendation Query**:
```bash
./comparekart.exe --recommend "Mobiles & Electronics Appliances" 30000
```
*Output*:
```json
{"success":true,"count":3,"recommendations":[{"id":2,"name":"UltraLite Slim 5G Smartphone","price":14999,"rating":4.4,"score":86.4,"isBestMatch":true,"isBestValue":true}, ...]}
```

**Side-by-Side Comparison Query**:
```bash
./comparekart.exe --compare 1,2 25000
```

**Trie Prefix Autocomplete Query**:
```bash
./comparekart.exe --search 5g
```
