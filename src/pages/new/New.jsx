import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // Function to upload file to Firebase
  const uploadFileToFirebase = (file, setData, setPerc) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPerc(progress);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setData((prev) => ({ ...prev, img: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      uploadFileToFirebase(file, setData, setPerc);
    }
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    console.log({ ...data, [id]: value });
  };

  const validateData = (data) => {
    if (!data.category || !data.img || !data.title) {
      return false; // Missing required fields
    }
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validateData(data)) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setStatus("Uploading...");
      const productId = data.id || `${new Date().getTime()}`;
      const productDoc = doc(db, "products", productId);
      await setDoc(productDoc, { ...data, timeStamp: serverTimestamp() });
      setStatus("Success! Product added.");
      navigate(-1);
    } catch (e) {
      setStatus("Error adding product.");
      console.log("Error adding document:", e);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <div className="formInput">
                <label htmlFor="category">Category</label>
                <select id="category" onChange={handleInput} defaultValue="">
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

              {status && <p>{status}</p>}

              <button disabled={per !== null && per < 100} type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
