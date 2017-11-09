import React from "react"
import { observer } from "mobx-react"

interface IPaginatorProps {
  page: IPage
  changePage: (page: number) => () => any
}

const Paginator = ({ page, changePage }: IPaginatorProps) => {
  if (page.count) {
    return (
      <nav className="pagination is-centered">
        <a
          className="pagination-previous button"
          onClick={changePage(page.current - 1)}
        >
          &laquo;
        </a>
        <a
          className="pagination-next button"
          onClick={changePage(page.current + 1)}
        >
          &raquo;
        </a>
        <div className="pagination-list">
          <a className="pagination-next button">
            Strona {page.current} z {page.last}
          </a>
        </div>
      </nav>
    )
  }

  return null
}

export default observer(Paginator)
