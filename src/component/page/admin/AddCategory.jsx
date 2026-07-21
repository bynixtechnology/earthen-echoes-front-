// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   FolderPlus,
//   Loader2,
//   X,
//   ImagePlus,
// } from "lucide-react";

// import {
//   CategoryService,
// } from "../../../services/productService";

// import {
//   showToast,
// } from "../../../config/toast";


// export default function AddCategory() {

//   const [categories, setCategories] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [isModalOpen, setIsModalOpen] =
//     useState(false);

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   const [categoryName, setCategoryName] =
//     useState("");

//   const [title, setTitle] =
//     useState("");

//   const [description, setDescription] =
//     useState("");

//   const [image, setImage] =
//     useState(null);

//   const [preview, setPreview] =
//     useState(null);

//   const fileInputRef =
//     useRef(null);


//   /*
//   |--------------------------------------------------------------------------
//   | Load Categories
//   |--------------------------------------------------------------------------
//   */

//   const loadCategories = async () => {

//     try {

//       setLoading(true);

//       const res =
//         await CategoryService.getAll();


//       const data =
//         Array.isArray(res?.data?.data)
//           ? res.data.data
//           : Array.isArray(res?.data)
//           ? res.data
//           : Array.isArray(res)
//           ? res
//           : [];


//       setCategories(data);

//     } catch (error) {

//       console.error(
//         "CATEGORY LOAD ERROR:",
//         error
//       );

//       showToast.error(
//         error?.response?.data?.message ||
//         "Failed to load categories."
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   useEffect(() => {

//     loadCategories();

//   }, []);


//   /*
//   |--------------------------------------------------------------------------
//   | Image Change
//   |--------------------------------------------------------------------------
//   */

//   const handleImageChange = (e) => {

//     const file =
//       e.target.files?.[0];

//     if (!file) return;


//     if (
//       !file.type.startsWith("image/")
//     ) {

//       showToast.error(
//         "Please select a valid image."
//       );

//       return;

//     }


//     setImage(file);


//     if (preview) {

//       URL.revokeObjectURL(
//         preview
//       );

//     }


//     setPreview(
//       URL.createObjectURL(file)
//     );

//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Reset Form
//   |--------------------------------------------------------------------------
//   */

//   const resetForm = () => {

//     setCategoryName("");

//     setTitle("");

//     setDescription("");

//     setImage(null);


//     if (preview) {

//       URL.revokeObjectURL(
//         preview
//       );

//     }

//     setPreview(null);


//     if (fileInputRef.current) {

//       fileInputRef.current.value =
//         "";

//     }

//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Close Modal
//   |--------------------------------------------------------------------------
//   */

//   const closeModal = () => {

//     if (isSubmitting) return;

//     resetForm();

//     setIsModalOpen(false);

//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Create Category
//   |--------------------------------------------------------------------------
//   */

//   const handleSubmit = async (e) => {

//     e.preventDefault();


//     if (!categoryName.trim()) {

//       return showToast.error(
//         "Category name is required."
//       );

//     }


//     if (!title.trim()) {

//       return showToast.error(
//         "Category title is required."
//       );

//     }


//     if (!image) {

//       return showToast.error(
//         "Category image is required."
//       );

//     }


//     try {

//       setIsSubmitting(true);


//       const formData =
//         new FormData();


//       formData.append(
//         "name",
//         categoryName.trim()
//       );

//       formData.append(
//         "title",
//         title.trim()
//       );

//       formData.append(
//         "description",
//         description.trim()
//       );

//       formData.append(
//         "image",
//         image
//       );


//       await CategoryService.create(
//         formData
//       );


//       showToast.success(
//         "Category created successfully."
//       );


//       /*
//       |--------------------------------------------------------------------------
//       | Close Popup
//       |--------------------------------------------------------------------------
//       */

//       setIsModalOpen(false);


//       /*
//       |--------------------------------------------------------------------------
//       | Full Page Reload
//       |--------------------------------------------------------------------------
//       */

//       window.location.reload();


//     } catch (error) {

//       console.error(
//         "CREATE CATEGORY ERROR:",
//         error
//       );


//       showToast.error(
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to create category."
//       );

//     } finally {

//       setIsSubmitting(false);

//     }

//   };


//   return (

//     <div className="p-4 sm:p-6">

//       {/* Header */}

//       <div
//         className="
//           mb-6
//           flex
//           items-center
//           justify-between
//         "
//       >

//         <div>

//           <h1
//             className="
//               text-xl
//               font-bold
//               text-slate-900
//             "
//           >
//             Categories
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-slate-500
//             "
//           >
//             Manage product categories
//           </p>

//         </div>


//         <button
//           type="button"

//           onClick={() =>
//             setIsModalOpen(true)
//           }

//           className="
//             flex
//             items-center
//             gap-2
//             rounded-lg
//             bg-slate-900
//             px-4
//             py-2.5
//             text-sm
//             font-medium
//             text-white
//             hover:bg-slate-800
//           "
//         >

//           <FolderPlus size={17} />

//           Add Category

//         </button>

//       </div>


//       {/* Category Table */}

//       <div
//         className="
//           overflow-hidden
//           rounded-xl
//           border
//           border-slate-200
//           bg-white
//         "
//       >

//         {loading ? (

//           <div
//             className="
//               flex
//               h-52
//               items-center
//               justify-center
//             "
//           >

//             <Loader2
//               className="animate-spin"
//               size={24}
//             />

//           </div>

//         ) : categories.length === 0 ? (

//           <div
//             className="
//               flex
//               h-52
//               flex-col
//               items-center
//               justify-center
//               text-slate-400
//             "
//           >

//             <ImagePlus size={32} />

//             <p className="mt-2 text-sm">
//               No categories found
//             </p>

//           </div>

//         ) : (

//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead
//                 className="
//                   border-b
//                   bg-slate-50
//                 "
//               >

//                 <tr>

//                   <th
//                     className="
//                       px-5
//                       py-3
//                       text-left
//                       text-xs
//                       font-semibold
//                       text-slate-500
//                     "
//                   >
//                     Image
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3
//                       text-left
//                       text-xs
//                       font-semibold
//                       text-slate-500
//                     "
//                   >
//                     Category Name
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3
//                       text-left
//                       text-xs
//                       font-semibold
//                       text-slate-500
//                     "
//                   >
//                     Title
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3
//                       text-left
//                       text-xs
//                       font-semibold
//                       text-slate-500
//                     "
//                   >
//                     Description
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {categories.map(
//                   (category) => (

//                     <tr
//                       key={category._id}

//                       className="
//                         border-b
//                         last:border-0
//                         hover:bg-slate-50
//                       "
//                     >

//                       <td className="px-5 py-3">

//                         {category.image ? (

//                           <img
//                             src={category.image}
//                             alt={category.name}

//                             className="
//                               h-12
//                               w-12
//                               rounded-lg
//                               border
//                               object-cover
//                             "
//                           />

//                         ) : (

//                           <div
//                             className="
//                               flex
//                               h-12
//                               w-12
//                               items-center
//                               justify-center
//                               rounded-lg
//                               bg-slate-100
//                             "
//                           >

//                             <ImagePlus
//                               size={18}
//                             />

//                           </div>

//                         )}

//                       </td>


//                       <td
//                         className="
//                           px-5
//                           py-3
//                           text-sm
//                           font-semibold
//                           text-slate-800
//                         "
//                       >
//                         {category.name}
//                       </td>


//                       <td
//                         className="
//                           px-5
//                           py-3
//                           text-sm
//                           text-slate-600
//                         "
//                       >
//                         {category.title || "-"}
//                       </td>


//                       <td
//                         className="
//                           max-w-xs
//                           px-5
//                           py-3
//                           text-sm
//                           text-slate-500
//                         "
//                       >

//                         <p className="line-clamp-2">

//                           {
//                             category.description ||
//                             "-"
//                           }

//                         </p>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>


//       {/* ================================================================
//           ADD CATEGORY MODAL
//       ================================================================= */}

//       {isModalOpen && (

//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             bg-black/50
//             p-4
//           "
//         >

//           <div
//             className="
//               w-full
//               max-w-lg
//               overflow-hidden
//               rounded-xl
//               bg-white
//               shadow-xl
//             "
//           >

//             {/* Modal Header */}

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between
//                 border-b
//                 px-5
//                 py-4
//               "
//             >

//               <div>

//                 <h2
//                   className="
//                     text-lg
//                     font-semibold
//                     text-slate-900
//                   "
//                 >
//                   Add Category
//                 </h2>

//                 <p
//                   className="
//                     mt-0.5
//                     text-xs
//                     text-slate-500
//                   "
//                 >
//                   Create a new product category
//                 </p>

//               </div>


//               <button
//                 type="button"

//                 onClick={closeModal}

//                 disabled={isSubmitting}

//                 className="
//                   rounded-lg
//                   p-2
//                   text-slate-500
//                   hover:bg-slate-100
//                 "
//               >

//                 <X size={19} />

//               </button>

//             </div>


//             {/* Form */}

//             <form
//               onSubmit={handleSubmit}
//             >

//               <div
//                 className="
//                   max-h-[70vh]
//                   space-y-4
//                   overflow-y-auto
//                   p-5
//                 "
//               >

//                 {/* Name */}

//                 <div>

//                   <label
//                     className="
//                       mb-1.5
//                       block
//                       text-sm
//                       font-medium
//                       text-slate-700
//                     "
//                   >
//                     Category Name
//                     <span className="text-red-500">
//                       {" *"}
//                     </span>
//                   </label>

//                   <input
//                     type="text"

//                     value={categoryName}

//                     onChange={(e) =>
//                       setCategoryName(
//                         e.target.value
//                       )
//                     }

//                     disabled={isSubmitting}

//                     placeholder="Enter category name"

//                     className="
//                       w-full
//                       rounded-lg
//                       border
//                       border-slate-300
//                       px-3
//                       py-2.5
//                       text-sm
//                       outline-none
//                       focus:border-slate-500
//                     "
//                   />

//                 </div>


//                 {/* Title */}

//                 <div>

//                   <label
//                     className="
//                       mb-1.5
//                       block
//                       text-sm
//                       font-medium
//                       text-slate-700
//                     "
//                   >
//                     Category Title
//                     <span className="text-red-500">
//                       {" *"}
//                     </span>
//                   </label>

//                   <input
//                     type="text"

//                     value={title}

//                     onChange={(e) =>
//                       setTitle(
//                         e.target.value
//                       )
//                     }

//                     disabled={isSubmitting}

//                     placeholder="Enter category title"

//                     className="
//                       w-full
//                       rounded-lg
//                       border
//                       border-slate-300
//                       px-3
//                       py-2.5
//                       text-sm
//                       outline-none
//                       focus:border-slate-500
//                     "
//                   />

//                 </div>


//                 {/* Description */}

//                 <div>

//                   <label
//                     className="
//                       mb-1.5
//                       block
//                       text-sm
//                       font-medium
//                       text-slate-700
//                     "
//                   >
//                     Description
//                   </label>

//                   <textarea
//                     rows={3}

//                     value={description}

//                     onChange={(e) =>
//                       setDescription(
//                         e.target.value
//                       )
//                     }

//                     disabled={isSubmitting}

//                     placeholder="Enter description"

//                     className="
//                       w-full
//                       resize-none
//                       rounded-lg
//                       border
//                       border-slate-300
//                       px-3
//                       py-2.5
//                       text-sm
//                       outline-none
//                       focus:border-slate-500
//                     "
//                   />

//                 </div>


//                 {/* Image */}

//                 <div>

//                   <label
//                     className="
//                       mb-1.5
//                       block
//                       text-sm
//                       font-medium
//                       text-slate-700
//                     "
//                   >
//                     Category Image
//                     <span className="text-red-500">
//                       {" *"}
//                     </span>
//                   </label>


//                   <input
//                     ref={fileInputRef}

//                     type="file"

//                     accept="image/*"

//                     disabled={isSubmitting}

//                     onChange={
//                       handleImageChange
//                     }

//                     className="
//                       w-full
//                       rounded-lg
//                       border
//                       border-slate-300
//                       p-2
//                       text-sm
//                     "
//                   />


//                   {preview && (

//                     <img
//                       src={preview}

//                       alt="Preview"

//                       className="
//                         mt-3
//                         h-36
//                         w-full
//                         rounded-lg
//                         border
//                         object-cover
//                       "
//                     />

//                   )}

//                 </div>

//               </div>


//               {/* Footer */}

//               <div
//                 className="
//                   flex
//                   justify-end
//                   gap-3
//                   border-t
//                   bg-slate-50
//                   px-5
//                   py-4
//                 "
//               >

//                 <button
//                   type="button"

//                   onClick={closeModal}

//                   disabled={isSubmitting}

//                   className="
//                     rounded-lg
//                     border
//                     border-slate-300
//                     bg-white
//                     px-4
//                     py-2
//                     text-sm
//                     font-medium
//                     text-slate-700
//                     hover:bg-slate-50
//                   "
//                 >
//                   Cancel
//                 </button>


//                 <button
//                   type="submit"

//                   disabled={isSubmitting}

//                   className="
//                     flex
//                     min-w-[130px]
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-lg
//                     bg-slate-900
//                     px-4
//                     py-2
//                     text-sm
//                     font-medium
//                     text-white
//                     hover:bg-slate-800
//                     disabled:opacity-60
//                   "
//                 >

//                   {isSubmitting ? (

//                     <>
//                       <Loader2
//                         size={16}
//                         className="animate-spin"
//                       />

//                       Creating...
//                     </>

//                   ) : (

//                     "Create Category"

//                   )}

//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }


import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FolderPlus,
  Loader2,
  X,
  ImagePlus,
} from "lucide-react";

import {
  fetchCategories,
  createCategory,
} from "../../../redux/thunks/categoryThunk";

import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoryActionLoading,
} from "../../../redux/slices/categorySlice";

import {
  showToast,
} from "../../../config/toast";


export default function AddCategory() {

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();


  const categories =
    useSelector(
      selectCategories
    );


  const loading =
    useSelector(
      selectCategoriesLoading
    );


  const isSubmitting =
    useSelector(
      selectCategoryActionLoading
    );


  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);


  const [
    categoryName,
    setCategoryName,
  ] = useState("");


  const [
    title,
    setTitle,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    image,
    setImage,
  ] = useState(null);


  const [
    preview,
    setPreview,
  ] = useState(null);


  const fileInputRef =
    useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      fetchCategories()
    );

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Image Preview Cleanup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    return () => {

      if (preview) {

        URL.revokeObjectURL(
          preview
        );

      }

    };

  }, [preview]);


  /*
  |--------------------------------------------------------------------------
  | Handle Image Change
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate File Type
    |--------------------------------------------------------------------------
    */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      showToast.error(
        "Please select a valid image."
      );


      e.target.value = "";

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Validate File Size - Max 5MB
    |--------------------------------------------------------------------------
    */

    const maxFileSize =
      5 * 1024 * 1024;


    if (
      file.size >
      maxFileSize
    ) {

      showToast.error(
        "Image size must be less than 5 MB."
      );


      e.target.value = "";

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Remove Old Preview
    |--------------------------------------------------------------------------
    */

    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    /*
    |--------------------------------------------------------------------------
    | Set Image
    |--------------------------------------------------------------------------
    */

    setImage(file);


    setPreview(
      URL.createObjectURL(
        file
      )
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Remove Selected Image
  |--------------------------------------------------------------------------
  */

  const removeImage = () => {

    if (isSubmitting) {
      return;
    }


    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    setImage(null);

    setPreview(null);


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {

    setCategoryName("");

    setTitle("");

    setDescription("");

    setImage(null);


    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    setPreview(null);


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Open Modal
  |--------------------------------------------------------------------------
  */

  const openModal = () => {

    resetForm();

    setIsModalOpen(
      true
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const closeModal = () => {

    if (isSubmitting) {
      return;
    }


    resetForm();


    setIsModalOpen(
      false
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Create Category
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      e
    ) => {

      e.preventDefault();


      /*
      |--------------------------------------------------------------------------
      | Prevent Multiple Requests
      |--------------------------------------------------------------------------
      */

      if (isSubmitting) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | Clean Values
      |--------------------------------------------------------------------------
      */

      const cleanName =
        categoryName
          .trim();


      const cleanTitle =
        title
          .trim();


      const cleanDescription =
        description
          .trim();


      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      if (!cleanName) {

        showToast.error(
          "Category name is required."
        );

        return;

      }


      if (!cleanTitle) {

        showToast.error(
          "Category title is required."
        );

        return;

      }


      if (!image) {

        showToast.error(
          "Category image is required."
        );

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Create FormData
      |--------------------------------------------------------------------------
      */

      const formData =
        new FormData();


      formData.append(
        "name",
        cleanName
      );


      formData.append(
        "title",
        cleanTitle
      );


      formData.append(
        "description",
        cleanDescription
      );


      formData.append(
        "image",
        image
      );


      /*
      |--------------------------------------------------------------------------
      | Dispatch Create Category Thunk
      |--------------------------------------------------------------------------
      */

      try {

        const response =
          await dispatch(
            createCategory(
              formData
            )
          ).unwrap();


        /*
        |--------------------------------------------------------------------------
        | Success Toast
        |--------------------------------------------------------------------------
        */

        showToast.success(
          response?.message ||
            "Category created successfully."
        );


        /*
        |--------------------------------------------------------------------------
        | Reset Form
        |--------------------------------------------------------------------------
        */

        resetForm();


        /*
        |--------------------------------------------------------------------------
        | Close Modal
        |--------------------------------------------------------------------------
        */

        setIsModalOpen(
          false
        );


        /*
        |--------------------------------------------------------------------------
        | Refresh Categories From Backend
        |--------------------------------------------------------------------------
        */

        dispatch(
          fetchCategories()
        );

      } catch (error) {

        console.error(
          "CREATE CATEGORY ERROR:",
          error
        );


        const message =

          typeof error ===
          "string"

            ? error

            : error?.message ||
              "Failed to create category.";


        showToast.error(
          message
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        p-4
        sm:p-6
      "
    >

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >

            Categories

          </h1>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >

            Manage product categories

          </p>

        </div>


        <button

          type="button"

          onClick={
            openModal
          }

          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-slate-900
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-slate-800
          "
        >

          <FolderPlus
            size={17}
          />

          Add Category

        </button>

      </div>


      {/* ================================================================
          CATEGORY TABLE
      ================================================================= */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
        "
      >

        {/* Loading */}

        {loading ? (

          <div
            className="
              flex
              h-52
              items-center
              justify-center
            "
          >

            <Loader2

              size={26}

              className="
                animate-spin
                text-slate-700
              "

            />

          </div>

        ) : categories.length ===
          0 ? (

          /* Empty */

          <div
            className="
              flex
              h-52
              flex-col
              items-center
              justify-center
              text-slate-400
            "
          >

            <ImagePlus
              size={32}
            />


            <p
              className="
                mt-2
                text-sm
              "
            >

              No categories found

            </p>

          </div>

        ) : (

          /* Table */

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                min-w-[750px]
              "
            >

              {/* Table Head */}

              <thead
                className="
                  border-b
                  border-slate-200
                  bg-slate-50
                "
              >

                <tr>

                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >

                    Image

                  </th>


                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >

                    Category Name

                  </th>


                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >

                    Title

                  </th>


                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >

                    Description

                  </th>

                </tr>

              </thead>


              {/* Table Body */}

              <tbody>

                {categories.map(
                  (
                    category,
                    index
                  ) => (

                    <tr

                      key={
                        category?._id ||
                        category?.id ||
                        index
                      }

                      className="
                        border-b
                        border-slate-100
                        transition
                        last:border-0
                        hover:bg-slate-50
                      "
                    >

                      {/* Image */}

                      <td
                        className="
                          px-5
                          py-3
                        "
                      >

                        {category?.image ? (

                          <img

                            src={
                              category.image
                            }

                            alt={
                              category?.name ||
                              "Category"
                            }

                            className="
                              h-12
                              w-12
                              rounded-lg
                              border
                              border-slate-200
                              object-cover
                            "
                          />

                        ) : (

                          <div
                            className="
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-lg
                              bg-slate-100
                              text-slate-400
                            "
                          >

                            <ImagePlus
                              size={18}
                            />

                          </div>

                        )}

                      </td>


                      {/* Name */}

                      <td
                        className="
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-slate-800
                        "
                      >

                        {category?.name ||
                          "-"}

                      </td>


                      {/* Title */}

                      <td
                        className="
                          px-5
                          py-3
                          text-sm
                          text-slate-600
                        "
                      >

                        {category?.title ||
                          "-"}

                      </td>


                      {/* Description */}

                      <td
                        className="
                          max-w-xs
                          px-5
                          py-3
                          text-sm
                          text-slate-500
                        "
                      >

                        <p
                          className="
                            line-clamp-2
                          "
                        >

                          {category?.description ||
                            "-"}

                        </p>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ================================================================
          ADD CATEGORY MODAL
      ================================================================= */}

      {isModalOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-[1px]
          "
        >

          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-xl
              bg-white
              shadow-2xl
            "
          >

            {/* ============================================================
                MODAL HEADER
            ============================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                  "
                >

                  Add Category

                </h2>


                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                  "
                >

                  Create a new product category

                </p>

              </div>


              <button

                type="button"

                onClick={
                  closeModal
                }

                disabled={
                  isSubmitting
                }

                aria-label="
                  Close modal
                "

                className="
                  rounded-lg
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <X
                  size={19}
                />

              </button>

            </div>


            {/* ============================================================
                FORM
            ============================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div
                className="
                  max-h-[70vh]
                  space-y-4
                  overflow-y-auto
                  p-5
                "
              >

                {/* ========================================================
                    CATEGORY NAME
                ========================================================= */}

                <div>

                  <label
                    htmlFor="
                      category-name
                    "

                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Category Name

                    <span
                      className="
                        text-red-500
                      "
                    >

                      {" *"}

                    </span>

                  </label>


                  <input

                    id="
                      category-name
                    "

                    type="text"

                    value={
                      categoryName
                    }

                    onChange={(
                      e
                    ) =>
                      setCategoryName(
                        e.target.value
                      )
                    }

                    disabled={
                      isSubmitting
                    }

                    placeholder="
                      Enter category name
                    "

                    autoComplete="
                      off
                    "

                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      px-3
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition

                      placeholder:text-slate-400

                      focus:border-slate-700
                      focus:ring-2
                      focus:ring-slate-200

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />

                </div>


                {/* ========================================================
                    CATEGORY TITLE
                ========================================================= */}

                <div>

                  <label
                    htmlFor="
                      category-title
                    "

                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Category Title

                    <span
                      className="
                        text-red-500
                      "
                    >

                      {" *"}

                    </span>

                  </label>


                  <input

                    id="
                      category-title
                    "

                    type="text"

                    value={
                      title
                    }

                    onChange={(
                      e
                    ) =>
                      setTitle(
                        e.target.value
                      )
                    }

                    disabled={
                      isSubmitting
                    }

                    placeholder="
                      Enter category title
                    "

                    autoComplete="
                      off
                    "

                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      px-3
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition

                      placeholder:text-slate-400

                      focus:border-slate-700
                      focus:ring-2
                      focus:ring-slate-200

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />

                </div>


                {/* ========================================================
                    DESCRIPTION
                ========================================================= */}

                <div>

                  <label
                    htmlFor="
                      category-description
                    "

                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Description

                  </label>


                  <textarea

                    id="
                      category-description
                    "

                    rows={4}

                    value={
                      description
                    }

                    onChange={(
                      e
                    ) =>
                      setDescription(
                        e.target.value
                      )
                    }

                    disabled={
                      isSubmitting
                    }

                    placeholder="
                      Enter category description
                    "

                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-slate-300
                      px-3
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition

                      placeholder:text-slate-400

                      focus:border-slate-700
                      focus:ring-2
                      focus:ring-slate-200

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />

                </div>


                {/* ========================================================
                    IMAGE
                ========================================================= */}

                <div>

                  <label
                    htmlFor="
                      category-image
                    "

                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Category Image

                    <span
                      className="
                        text-red-500
                      "
                    >

                      {" *"}

                    </span>

                  </label>


                  <input

                    id="
                      category-image
                    "

                    ref={
                      fileInputRef
                    }

                    type="file"

                    accept="
                      image/*
                    "

                    disabled={
                      isSubmitting
                    }

                    onChange={
                      handleImageChange
                    }

                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      p-2
                      text-sm
                      text-slate-600

                      file:mr-3
                      file:rounded-md
                      file:border-0
                      file:bg-slate-900
                      file:px-3
                      file:py-2
                      file:text-xs
                      file:font-medium
                      file:text-white
                      file:cursor-pointer

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />


                  <p
                    className="
                      mt-1.5
                      text-xs
                      text-slate-400
                    "
                  >

                    JPG, PNG, WEBP or other image formats. Maximum 5 MB.

                  </p>


                  {/* Image Preview */}

                  {preview && (

                    <div
                      className="
                        relative
                        mt-3
                        overflow-hidden
                        rounded-lg
                        border
                        border-slate-200
                      "
                    >

                      <img

                        src={
                          preview
                        }

                        alt="
                          Category preview
                        "

                        className="
                          h-40
                          w-full
                          object-cover
                        "
                      />


                      <button

                        type="button"

                        onClick={
                          removeImage
                        }

                        disabled={
                          isSubmitting
                        }

                        aria-label="
                          Remove image
                        "

                        className="
                          absolute
                          right-2
                          top-2
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-black/70
                          text-white
                          shadow
                          transition
                          hover:bg-black
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        <X
                          size={16}
                        />

                      </button>

                    </div>

                  )}

                </div>

              </div>


              {/* ============================================================
                  MODAL FOOTER
              ============================================================= */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  border-t
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                "
              >

                <button

                  type="button"

                  onClick={
                    closeModal
                  }

                  disabled={
                    isSubmitting
                  }

                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-100

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  Cancel

                </button>


                <button

                  type="submit"

                  disabled={
                    isSubmitting
                  }

                  className="
                    flex
                    min-w-[145px]
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-slate-900
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-slate-800

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {isSubmitting ? (

                    <>

                      <Loader2

                        size={16}

                        className="
                          animate-spin
                        "

                      />

                      Creating...

                    </>

                  ) : (

                    <>

                      <FolderPlus
                        size={16}
                      />

                      Create Category

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}