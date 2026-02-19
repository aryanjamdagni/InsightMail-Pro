import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setItems((p) => p.filter((x) => x.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  const push = useCallback((title, message = "", ttl = 2400) => {
    const id = crypto.randomUUID();
    setItems((p) => [{ id, title, message }, ...p].slice(0, 4));
    const timer = setTimeout(() => remove(id), ttl);
    timers.current.set(id, timer);
  }, [remove]);

  return { items, push, remove };
}
