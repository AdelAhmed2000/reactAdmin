export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.title}
        </div>
      );
    },
  },
  {
    field: "description",
    headerName: "Description",
    width: 230,
  },

  {
    field: "category",
    headerName: "Category",
    width: 100,
  },
  {
    field: "stock",
    headerName: "Stock",
    width: 100,
  },
  {
    field: "price",
    headerName: "Price",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.price}`}>
          {params.row.price}
        </div>
      );
    },
  },
];
