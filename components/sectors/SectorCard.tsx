"use client";

import { SectorPlate } from "@/content/plates/sector-plates";
import type { Sector } from "@/content/sectors/sectors";
import { useDrawOnEnter } from "@/lib/motion/useDrawOnEnter";

import styles from "./Sectors.module.css";

function SectorArtwork({ sector }: { sector: Sector }) {
  const { ref, drawn } = useDrawOnEnter<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref} className={styles.plateWrap} data-sector-plate={sector.plateId}>
      <SectorPlate plateId={sector.plateId} drawn={drawn} className={styles.plate} />
    </div>
  );
}

export function SectorCard({
  sector,
  swapping,
}: {
  sector: Sector;
  swapping: boolean;
}) {
  return (
    <article
      className={styles.card}
      data-sector-card
      data-sector-id={sector.id}
      data-swapping={swapping ? "true" : "false"}
    >
      <div className={styles.cardTop}>
        <span className={styles.index}>{sector.index}</span>
        <SectorArtwork key={sector.id} sector={sector} />
      </div>

      <div className={styles.copy}>
        <h3 className={styles.name}>{sector.name}</h3>
        <p className={styles.descriptor}>{sector.descriptor}</p>
      </div>
    </article>
  );
}
