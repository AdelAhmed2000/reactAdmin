import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import "./editproduct.scss"; // ملف الاستايل الخاص بالصفحة

const EditProduct = () => {
  const { id } = useParams(); // جلب الـ id من الرابط
  const navigate = useNavigate(); // للتنقل بين الصفحات
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // رفع الصورة وتحديث الرابط
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `products/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProductData((prev) => ({ ...prev, img: downloadURL }));
        console.log("File available at", downloadURL);
      }
    );
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
            name="title"
            value={productData.title || ""}
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
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            onChange={handleChange}
            value={productData.category || ""}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="womensBags">WomensBags</option>
            <option value="mobileAccessories">MobileAccessories</option>
            <option value="sports-accessories">Sports-accessories</option>
            <option value="shoes">Shoes</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div className="formGroup">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={productData.description || ""}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploadProgress > 0 && (
            <p>Upload Progress: {Math.round(uploadProgress)}%</p>
          )}
          {productData.img && (
            <img src={productData.img} alt="Product" className="previewImage" />
          )}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProduct;
