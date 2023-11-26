/* eslint-disable react/no-unescaped-entities */
import Layout from "./Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs"

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDesccription,
  price: existingPrice,
  images:existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesccription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProduct, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || [])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter();

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price, images };

    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //Create
      await axios.post("/api/products", data);
    }

    setGoToProducts(true);
  }
  useEffect(() => {
    if (goToProduct) {
      router.push("/products");
    }
  }, [goToProduct]);

  async function uploadImages(e)
  {
    const files = e.target?.files;
    if(files?.length > 0)
    {
      setIsUploading(true);
      const data = new FormData();
      for(const file of files)
      {
        data.append('file', file);
      }
      const res =await axios.post('/api/upload', data);
      console.log(res.data);

      setImages(oldImages =>{
        return[...oldImages, ...res.data.links];
      });
      setIsUploading(false)
    }
  }
  function updateImagesOrders(images)
  {
    setImages(images);
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Nom du Produit</label>
      <input
        type="text"
        placeholder="Nom du produit"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrders}>
          {!!images?.length && images.map(link =>(
            <div key={link} className=" h-24">
              <img src={link} alt="img" className="rounded-lg"/>
            </div>
          ))}
        </ReactSortable>
      
        {isUploading && (
          <div className="h-24  flex items-center">
            <Spinner />
          </div>
        )}
        <label className="  w-24 h-24 cursor-pointer text-center flex  items-center justify-center text-sm text-gray-500 gap-1 rounded-lg bg-gray-200 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <div>Ajouter</div>
          <input type="file" className="hidden" onChange={uploadImages}/>
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Prix(en $)</label>
      <input
        type="number"
        placeholder="0.00"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit" className="btn-primary">
        Sauvegarder
      </button>
    </form>
  );
}
