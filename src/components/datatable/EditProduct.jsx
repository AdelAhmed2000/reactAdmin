import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./editproduct.scss"; // ملف الاستايل الخاص بالصفحة
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // جلب الـ id من الرابط
  const navigate = useNavigate(); // للتنقل بين الصفحات
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  console.log(id);
   console.log("Product ID:", id);

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id); // مرجع المنتج
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProductData(productSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // تحديث بيانات المنتج
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, productData);
      console.log("Product updated successfully!");
      navigate(-1); // العودة للصفحة السابقة
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // تعديل البيانات في الـ state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="editProduct">
      <h1>Edit Product</h1>
      <form onSubmit={handleUpdate}>
        <div className="formGroup">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={productData.price || ""}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={productData.category || ""}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Image URL</label>
          <input
            type="text"
            name="img"
            value={productData.img || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProduct;
