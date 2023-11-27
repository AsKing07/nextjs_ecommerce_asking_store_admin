import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function CategoriesPage({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setIsLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties)
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Êtes-vous sûr?",
        text: `Voulez-vous supprimer la catégory ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, Supprimer!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, {name:'',values:''}];
    });
  }
//   function handlePropertyNameChange(index,property,newName) {
//     setProperties(prev => {
//       const properties = [...prev];
//       properties[index].name = newName;
//       return properties;
//     });
//   }
function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      const updatedProperty = { ...property, name: newName };
      updatedProperties[index] = updatedProperty;
      return updatedProperties;
    });
  }
  
  function handlePropertyValuesChange(index,property,newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Modifier la catégorie ${editedCategory.name}`
          : "Nom de la nouvelle catégorie"}
      </label>
      <form className="" onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className=""
            type="text"
            placeholder="Nom de la Catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">Pas de catégorie parent</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Caractéristiques</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2">
           Ajouter une nouvelle caractéristique pour les produits de cette catégorie
          </button>
          {properties.length > 0 && properties.map((property,index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input type="text"
                     value={property.name}
                     className="mb-0"
                     onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="Nom de la caractéristique (example: couleur)"/>
              <input type="text"
                     className="mb-0"
                     onChange={ev =>
                       handlePropertyValuesChange(
                         index,
                         property,ev.target.value
                       )}
                     value={property.values}
                     placeholder="Valeurs, séparées par des virgules"/>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                Retirer
              </button>
            </div>
          ))}
        </div>

       

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
              }}
              className="btn-default"
            >
              Annuler
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Enregistrer
          </button>
        </div>
      </form>

{isloading ? (
  <div className="flex justify-center">
    <Spinner />
  </div>
) : !editedCategory ? (
  <table className="basic mt-4">
    <thead>
      <tr>
        <td>Noms</td>
        <td>Catégorie Parent</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      {categories.length > 0 &&
        categories.map((category) => (
          <tr key={category.name}>
            <td>{category.name}</td>
            <td>{category?.parent?.name}</td>
            <td>
              <button
                onClick={() => editCategory(category)}
                className="btn-default mr-1"
              >
                Editer
              </button>
              <button
                onClick={() => deleteCategory(category)}
                className="btn-red"
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
) : null}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <CategoriesPage swal={swal} />);
