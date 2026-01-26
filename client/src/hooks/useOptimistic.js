import { useState, useCallback, useRef } from "react";

export function useOptimistic(initialValue, options = {}) {
  const { onError, rollbackDelay = 0 } = options;
  
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const previousValueRef = useRef(initialValue);

  const optimisticUpdate = useCallback(async (newValue, asyncAction) => {
    previousValueRef.current = value;
    setError(null);
    setIsUpdating(true);

    setValue(typeof newValue === "function" ? newValue(value) : newValue);

    try {
      const result = await asyncAction();
      setIsUpdating(false);
      return result;
    } catch (err) {
      if (rollbackDelay > 0) {
        setTimeout(() => {
          setValue(previousValueRef.current);
        }, rollbackDelay);
      } else {
        setValue(previousValueRef.current);
      }
      
      setError(err);
      setIsUpdating(false);
      onError?.(err);
      throw err;
    }
  }, [value, onError, rollbackDelay]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setIsUpdating(false);
  }, [initialValue]);

  return {
    value,
    setValue,
    isUpdating,
    error,
    optimisticUpdate,
    reset
  };
}

export function useOptimisticList(initialItems = [], options = {}) {
  const { idKey = "id", onError } = options;
  
  const [items, setItems] = useState(initialItems);
  const [pendingIds, setPendingIds] = useState(new Set());
  const previousItemsRef = useRef(initialItems);

  const addItem = useCallback(async (newItem, asyncAction) => {
    const tempId = newItem[idKey] || `temp-${Date.now()}`;
    const itemWithId = { ...newItem, [idKey]: tempId, _pending: true };
    
    previousItemsRef.current = items;
    setItems(prev => [...prev, itemWithId]);
    setPendingIds(prev => new Set([...prev, tempId]));

    try {
      const result = await asyncAction();
      setItems(prev => prev.map(item => 
        item[idKey] === tempId ? { ...result, _pending: false } : item
      ));
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      return result;
    } catch (err) {
      setItems(previousItemsRef.current);
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      onError?.(err);
      throw err;
    }
  }, [items, idKey, onError]);

  const updateItem = useCallback(async (id, updates, asyncAction) => {
    previousItemsRef.current = items;
    setPendingIds(prev => new Set([...prev, id]));
    
    setItems(prev => prev.map(item =>
      item[idKey] === id ? { ...item, ...updates, _pending: true } : item
    ));

    try {
      const result = await asyncAction();
      setItems(prev => prev.map(item =>
        item[idKey] === id ? { ...result, _pending: false } : item
      ));
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return result;
    } catch (err) {
      setItems(previousItemsRef.current);
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onError?.(err);
      throw err;
    }
  }, [items, idKey, onError]);

  const removeItem = useCallback(async (id, asyncAction) => {
    previousItemsRef.current = items;
    setPendingIds(prev => new Set([...prev, id]));
    
    setItems(prev => prev.filter(item => item[idKey] !== id));

    try {
      await asyncAction();
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setItems(previousItemsRef.current);
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onError?.(err);
      throw err;
    }
  }, [items, idKey, onError]);

  return {
    items,
    setItems,
    pendingIds,
    addItem,
    updateItem,
    removeItem,
    isPending: (id) => pendingIds.has(id)
  };
}

export default useOptimistic;
