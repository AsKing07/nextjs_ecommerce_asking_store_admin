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
  category:assignedCategory,
  properties:assignedProperties,
}) {
  const [categoriesLoading,setCategoriesLoading]= useState(false)

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesccription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [goToProduct, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || [])
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category,setCategory] = useState(assignedCategory || '');
  const router = useRouter();

  useEffect(()=>{
    setCategoriesLoading(true)
    axios.get('/api/categories').then(result =>{
      setCategories(result.data)
      setCategoriesLoading(false)
    })
  }, [])

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price, images,category,properties:productProperties };

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
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  // if (categories.length > 0 && category) {
  //   let catInfo = categories.find(({_id}) => _id === category);
  //   propertiesToFill.push(...catInfo.properties);
  //   while(catInfo?.parent?._id) {
  //     const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
  //     propertiesToFill.push(...parentCat.properties);
  //     catInfo = parentCat;
  //   }
  // }
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    const uniqueProperties = new Map();
  
    // Ajouter les propriétés de la catégorie actuelle à l'objet Map
    catInfo?.properties.forEach((property) => {
      uniqueProperties.set(property.name, property);
    });
  
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
  
      // Ajouter les propriétés de la catégorie parent à l'objet Map
      parentCat.properties.forEach((property) => {
        uniqueProperties.set(property.name, property);
      });
  
      catInfo = parentCat;
    }
  
    // Convertir les valeurs de l'objet Map en un tableau
    propertiesToFill.push(...uniqueProperties.values());
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
      <label>Catégorie</label>
      <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
        <option value="">Pas de catégorie</option>
        {categories.length>0 && categories.map(category =>(
                     <option value={category._id} key={category._id}>
                        {category.name}
                     </option>
                    ))}
      </select>
      {categoriesLoading && (
          <Spinner />
        )}
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
              <select value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
              >
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrders}>
          {!!images?.length && images.map(link =>(
            <div key={link} className=" h-24 bg-whit p-4 shadow-sm rounded-sm border border-gray-200">
              <img src={link} alt="img" className="rounded-lg"/>
            </div>
          ))}
        </ReactSortable>
      
        {isUploading && (
          <div className="h-24  flex items-center">
            <Spinner />
          </div>
        )}
        <label className="  w-24 h-24 cursor-pointer text-center flex flex-col  items-center justify-center text-sm text-primary gap-1 rounded-sm bg-white shadow-sm border border-primary ">
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

          <div>Ajouter plus d'images</div>
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
        type="number" step={0.01}
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
