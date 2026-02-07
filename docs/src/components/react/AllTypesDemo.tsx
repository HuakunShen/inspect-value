import { useRef, useEffect } from 'react';
import { allTypesData } from '../shared/demo-data';

export default function AllTypesDemo() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    import('../../../../dist/inspect-value.js').then(() => {
      if (!ref.current) return;
      (ref.current as any).value = allTypesData;
      (ref.current as any).expandAll = true;
    });
  }, []);

  return <inspect-value ref={ref} name="types" />;
}
