import React, { useEffect, useState } from 'react';
import { parse } from '../../bipuuk/parser';
import { System } from '../../bipuuk/renderer';
import styles from './styles.module.css';

interface Props {
  text: string;
}

function Renderer({ text }: Props) {
  const [svg, setSvg] = useState<JSX.Element>();
  useEffect(() => {
    const result = parse(text);
    if (result.status) {
      const system = new System(result.value);
      system.stabilize();
      setSvg(system.render({ className: styles.renderer }));
    } else {
      console.error(result);
    }
  }, [text]);
  return (
    <>
      <p>{svg}</p>
    </>
  );
}

export default Renderer;
