function BookPage({
  children,
  flipped,
  zIndex
}) {

  return (

    <div
      className={`page ${
        flipped ? "flipped" : ""
      }`}
      style={{ zIndex }}
    >

      <div className="page-front">

        <div className="page-shadow"></div>

        {children}

      </div>

      <div className="page-back">

        <div className="page-shadow"></div>

      </div>

    </div>

  )

}

export default BookPage