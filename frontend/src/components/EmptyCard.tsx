import React from "react"
import styles from "./style"

const EmptyCard = () => (
  <div className={`card ${styles.card}`}>
    <div className="card-content">
      <p className="is-size-4">Brak wyników</p>
    </div>
  </div>
)

export default EmptyCard
