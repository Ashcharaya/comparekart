import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('comparekart_compare_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTrayOpen, setIsTrayOpen] = useState(true);
  const [compareBudget, setCompareBudget] = useState(() => {
    const saved = localStorage.getItem('comparekart_compare_budget');
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('comparekart_compare_list', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    if (compareBudget) {
      localStorage.setItem('comparekart_compare_budget', compareBudget.toString());
    } else {
      localStorage.removeItem('comparekart_compare_budget');
    }
  }, [compareBudget]);

  const addToCompare = (product) => {
    if (!product) return { success: false, message: 'Invalid product' };

    // Check if already in list
    if (compareList.some(p => p._id === product._id)) {
      return { success: false, message: `${product.name} is already in comparison` };
    }

    // Check max limit (4 products)
    if (compareList.length >= 4) {
      return {
        success: false,
        message: 'You can compare up to 4 products at a time. Remove one first.'
      };
    }

    // Category consistency check: warn if category is completely different
    if (compareList.length > 0 && compareList[0].category !== product.category) {
      return {
        success: false,
        message: `Comparison works best within the same category (${compareList[0].category}). Please clear current list first.`
      };
    }

    setCompareList(prev => [...prev, product]);
    setIsTrayOpen(true);
    return { success: true, message: `Added ${product.name} to comparison` };
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some(p => p._id === productId);
  };

  const toggleCompare = (product) => {
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
      return { success: true, action: 'removed' };
    } else {
      return addToCompare(product);
    }
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        toggleCompare,
        isTrayOpen,
        setIsTrayOpen,
        compareBudget,
        setCompareBudget
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
